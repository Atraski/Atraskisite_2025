const express = require("express");
const router = express.Router();
const multer = require("multer");
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

// ⚠️ Make sure folder name matches your project ("models" vs "Models")
const JobApplication = require("../models/JobApplication");

// Get GridFS bucket (initialized in server.js)
const getGridFSBucket = () => {
  if (global.gridFSBucket) {
    return global.gridFSBucket;
  }
  // Fallback: create if not initialized
  if (mongoose.connection.readyState === 1) {
    return new GridFSBucket(mongoose.connection.db, {
      bucketName: "resumes"
    });
  }
  return null;
};

// Multer memory storage (we'll upload to GridFS manually)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, DOC, DOCX, JPG, PNG allowed."));
    }
  },
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
    if (!req.file) {
      return res.status(400).json({ error: "Resume file is required" });
    }

    // Store file in MongoDB GridFS
    let fileId = null;
    const gridFSBucket = getGridFSBucket();
    
    if (req.file && gridFSBucket) {
      const fileName = `${Date.now()}-${(req.body.name || "resume").replace(/[^a-zA-Z0-9.-]/g, "_")}-${req.file.originalname}`;
      
      // Create write stream to GridFS
      const writeStream = gridFSBucket.openUploadStream(fileName, {
        contentType: req.file.mimetype,
        metadata: {
          originalName: req.file.originalname,
          uploadedBy: req.body.email || "anonymous",
        }
      });

      // Write buffer to GridFS
      writeStream.end(req.file.buffer);
      
      // Wait for file to be written
      fileId = await new Promise((resolve, reject) => {
        writeStream.on("finish", () => {
          resolve(writeStream.id);
        });
        writeStream.on("error", (err) => {
          console.error("GridFS upload error:", err);
          reject(err);
        });
      });
    } else if (req.file && !gridFSBucket) {
      console.error("GridFS bucket not available");
      return res.status(500).json({ error: "File storage not available" });
    }

    const doc = await JobApplication.create({
      name: req.body.name,
      email: req.body.email,
      contactNumber: req.body.contactNumber,
      whatsappNumber: req.body.whatsappNumber,
      jobTitle: req.body.jobTitle || "General",
      message: req.body.message || "", // Optional field
      location: req.body.Location || req.body.location || "", // Case-insensitive fallback
      jobLocationLabel: req.body.jobLocationLabel || "",
      resumeFileId: fileId,
      resumeFileName: req.file.originalname,
      resumeMimeType: req.file.mimetype,
      // Keep resumeUrl empty for new uploads
      resumeUrl: null,
      // status defaults to "pending" if your schema has it
    });

    res.status(200).json({ message: "Application submitted", doc });
  } catch (error) {
    console.error("Apply error:", error);
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
    if (!app) {
      return res.status(404).json({ error: "Application not found" });
    }

    // Priority: GridFS file > resumeUrl (for backward compatibility)
    const gridFSBucket = getGridFSBucket();
    
    if (app.resumeFileId && gridFSBucket) {
      try {
        // Convert to ObjectId
        const fileId = typeof app.resumeFileId === 'string' 
          ? new mongoose.Types.ObjectId(app.resumeFileId)
          : app.resumeFileId;

        // Check if file exists in GridFS
        const files = await gridFSBucket.find({ _id: fileId }).toArray();
        if (files.length === 0) {
          throw new Error("File not found in GridFS");
        }

        const file = files[0];
        const fileName = app.resumeFileName || file.filename || "resume.pdf";
        const mimeType = app.resumeMimeType || file.contentType || "application/octet-stream";

        // Set download headers
        const safeFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
        res.setHeader("Content-Disposition", `attachment; filename="${safeFileName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`);
        res.setHeader("Content-Type", mimeType);
        res.setHeader("Content-Length", file.length);
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");

        // Stream file from GridFS to response
        const downloadStream = gridFSBucket.openDownloadStream(fileId);
        downloadStream.pipe(res);

        downloadStream.on("error", (err) => {
          console.error("GridFS download error:", err);
          if (!res.headersSent) {
            res.status(500).json({ error: "Error downloading file" });
          }
        });

        return; // Don't continue to other handlers
      } catch (err) {
        console.error("GridFS error:", err.message, err.stack);
        // Fall through to legacy resumeUrl handling
      }
    }

    // Legacy: Handle old Cloudinary/local URLs (for backward compatibility)
    if (app.resumeUrl) {
      // If it's a Cloudinary URL, redirect (old data)
      if (app.resumeUrl.includes("cloudinary.com") || app.resumeUrl.includes("res.cloudinary.com")) {
        return res.redirect(app.resumeUrl);
      }
      
      // For local files
      if (app.resumeUrl.startsWith("/uploads/") || app.resumeUrl.startsWith("uploads/")) {
        const path = require("path");
        const fs = require("fs");
        const filePath = path.join(__dirname, "..", app.resumeUrl.startsWith("/") ? app.resumeUrl.slice(1) : app.resumeUrl);
        
        if (fs.existsSync(filePath)) {
          const fileName = path.basename(filePath);
          res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
          res.setHeader("Content-Type", "application/octet-stream");
          return res.sendFile(filePath);
        }
      }
      
      // Fallback: redirect to original URL
      return res.redirect(app.resumeUrl);
    }

    // No file found
    return res.status(404).json({ error: "Resume file not found" });
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

