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
      message: req.body.message,
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
