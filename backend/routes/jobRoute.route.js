const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// ⚠️ Make sure folder name matches your project ("models" vs "Models")
const JobApplication = require("../models/JobApplication");

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// small helper for neat public_id
const slug = (s = "") =>
  String(s).trim().toLowerCase().replace(/[^\w\-]+/g, "-").slice(0, 60);

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: process.env.CLOUDINARY_FOLDER || "job-applications",
    // "auto" handles pdf/doc/docx/jpg/png without juggling types
    resource_type: "auto",
    allowed_formats: ["pdf", "doc", "docx", "jpg", "jpeg", "png"],
    public_id: `${Date.now()}-${slug(req.body?.name || "resume")}`,
  }),
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

/* =========================
   GET /api/applications
   (Protected via server.js; returns newest first)
========================= */
router.get("/", async (_req, res) => {
  try {
    const apps = await JobApplication.find().sort({ createdAt: -1 }).lean();
    res.status(200).json(apps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
});

/* =========================
   POST /api/applications/apply  (Public)
========================= */
router.post("/apply", upload.single("file"), async (req, res) => {
  try {
    const resumeUrl = req.file?.path || null; // secure URL from Cloudinary

    const doc = await JobApplication.create({
      name: req.body.name,
      email: req.body.email,
      contactNumber: req.body.contactNumber,
      whatsappNumber: req.body.whatsappNumber,
      jobTitle: req.body.jobTitle || "General",
      message: req.body.message || "", // Optional field
      location: req.body.Location || req.body.location || "", // Case-insensitive fallback
      jobLocationLabel: req.body.jobLocationLabel || "",
      resumeUrl,
      // status defaults to "pending" if your schema has it
    });

    res.status(200).json({ message: "Application submitted", doc });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Submission failed", detail: error.message });
  }
});

/* =========================
   GET /api/applications/:id/resume  (Protected)
   Proxy download for resume files with proper headers
   NOTE: This route must be BEFORE /:id/status route
========================= */
router.get("/:id/resume", async (req, res) => {
  try {
    const app = await JobApplication.findById(req.params.id).lean();
    if (!app || !app.resumeUrl) {
      return res.status(404).json({ error: "Resume not found" });
    }

    const resumeUrl = app.resumeUrl;
    
    // If it's a Cloudinary URL, fetch and serve with download headers
    if (resumeUrl.includes("cloudinary.com") || resumeUrl.includes("res.cloudinary.com")) {
      try {
        // Format Cloudinary URL with fl_attachment transformation
        let downloadUrl = resumeUrl;
        
        // Check if fl_attachment is already in the URL
        if (!resumeUrl.includes("fl_attachment")) {
          // Use regex to insert fl_attachment after /upload/
          downloadUrl = resumeUrl.replace(
            /(\/upload\/)(v\d+\/)?/,
            (match, uploadPart, versionPart) => {
              if (versionPart) {
                return `${uploadPart}${versionPart}fl_attachment/`;
              } else {
                return `${uploadPart}fl_attachment/`;
              }
            }
          );
        }
        
        // Get filename from original URL
        const urlObj = new URL(resumeUrl);
        const fileName = urlObj.pathname.split("/").pop() || "resume.pdf";
        
        // Fetch file from Cloudinary and stream to client
        const https = require("https");
        const http = require("http");
        const protocol = downloadUrl.startsWith("https:") ? https : http;
        
        const request = protocol.get(downloadUrl, (fileRes) => {
          // Handle redirects
          if (fileRes.statusCode >= 300 && fileRes.statusCode < 400 && fileRes.headers.location) {
            return res.redirect(fileRes.headers.location);
          }
          
          if (fileRes.statusCode !== 200) {
            console.error(`Cloudinary error: ${fileRes.statusCode} for ${downloadUrl}`);
            if (!res.headersSent) {
              return res.status(500).json({ 
                error: "Failed to fetch file from Cloudinary",
                status: fileRes.statusCode 
              });
            }
            return;
          }
          
            // Set download headers to force download
            const safeFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
            res.setHeader("Content-Disposition", `attachment; filename="${safeFileName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`);
            res.setHeader("Content-Type", fileRes.headers["content-type"] || "application/octet-stream");
            res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            res.setHeader("Pragma", "no-cache");
            res.setHeader("Expires", "0");
            if (fileRes.headers["content-length"]) {
              res.setHeader("Content-Length", fileRes.headers["content-length"]);
            }
          
          // Pipe file to response
          fileRes.pipe(res);
          
          fileRes.on("error", (err) => {
            console.error("Stream error:", err);
            if (!res.headersSent) {
              res.status(500).json({ error: "Error streaming file" });
            }
          });
        });
        
        request.on("error", (err) => {
          console.error("Request error:", err.message, "URL:", downloadUrl);
          if (!res.headersSent) {
            // Fallback: redirect to original URL
            return res.redirect(resumeUrl);
          }
        });
        
        request.setTimeout(30000, () => {
          console.error("Request timeout for:", downloadUrl);
          request.destroy();
          if (!res.headersSent) {
            res.status(500).json({ error: "Request timeout" });
          }
        });
        
        return; // Don't continue to other handlers
      } catch (err) {
        console.error("Cloudinary processing error:", err.message);
        // Fallback: redirect to original URL
        return res.redirect(resumeUrl);
      }
    }
    
    // For local files, serve with download headers
    if (resumeUrl.startsWith("/uploads/") || resumeUrl.startsWith("uploads/")) {
      const path = require("path");
      const fs = require("fs");
      const filePath = path.join(__dirname, "..", resumeUrl.startsWith("/") ? resumeUrl.slice(1) : resumeUrl);
      
      if (fs.existsSync(filePath)) {
        const fileName = path.basename(filePath);
        res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
        res.setHeader("Content-Type", "application/octet-stream");
        return res.sendFile(filePath);
      }
    }
    
    // Fallback: redirect to original URL
    res.redirect(resumeUrl);
  } catch (e) {
    console.error("Resume download error:", e);
    res.status(500).json({ error: "Failed to download resume" });
  }
});

/* =========================
   PATCH /api/applications/:id/status  (Protected)
   Body: { status: "approved" | "rejected" | "pending" }
========================= */
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body || {};
    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updated = await JobApplication.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    ).lean();

    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true, doc: updated });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to update status" });
  }
});

module.exports = router;
