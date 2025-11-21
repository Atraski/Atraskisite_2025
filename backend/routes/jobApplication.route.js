// routes/jobRoute.route.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const JobApplication = require("../models/JobApplication.js");

/* -------------------- Uploads dir (for local file fallback) -------------------- */
const uploadFolder = path.join(__dirname, "../uploads");
fs.mkdirSync(uploadFolder, { recursive: true });

/* -------------------- Multer (fallback if resumeUrl not provided) -------------------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) => {
    const safe = (file.originalname || "resume").replace(/[^a-z0-9.\-_\s]/gi, "_");
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}-${safe}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const ok = new Set([
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
    ]);
    if (!ok.has(file.mimetype)) return cb(new Error("Only PDF/DOC/DOCX/JPG/PNG allowed."));
    cb(null, true);
  },
});

// accept both "file" and "resume" field names
const uploadFields = upload.fields([
  { name: "resume", maxCount: 1 },
  { name: "file",   maxCount: 1 },
]);

/* -------------------- POST /api/applications/apply -------------------- */
router.post("/apply", uploadFields, async (req, res) => {
  try {
    const {
      name,
      email,
      contactNumber,
      whatsappNumber,
      jobTitle,
      message,
      status, // optional override
    } = req.body;

    // normalize location (accept Location/location/locations)
    const location =
      (req.body.Location || req.body.location || req.body.locations || "").toString().trim();
    const jobLocationLabel = (req.body.jobLocationLabel || "").toString().trim();

    // 1) use resumeUrl if provided (Cloudinary etc.)
    // 2) else pick uploaded file from "resume" or "file"
    let resumeUrl = (req.body.resumeUrl || "").trim();
    if (!resumeUrl) {
      const picked =
        (req.files?.resume && req.files.resume[0]) ||
        (req.files?.file && req.files.file[0]) ||
        null;
      if (picked) resumeUrl = `/uploads/${picked.filename}`;
    }

    // basic validations (match FE requireds; don't force location label)
    const missing = [];
    for (const k of ["name", "email", "contactNumber", "whatsappNumber", "jobTitle"]) {
      if (!req.body[k] || String(req.body[k]).trim() === "") missing.push(k);
    }
    if (missing.length) return res.status(400).json({ message: `Missing fields: ${missing.join(", ")}` });
    if (!resumeUrl) return res.status(400).json({ message: "Resume file/URL is required." });

    const doc = await JobApplication.create({
      name:            String(name).trim(),
      email:           String(email).trim(),
      contactNumber:   String(contactNumber).trim(),
      whatsappNumber:  String(whatsappNumber).trim(),
      jobTitle:        String(jobTitle).trim(),
      message:         String(message).trim(),
      resumeUrl,

      // ⭐️ the important ones
      location,
      jobLocationLabel,

      ...(status ? { status } : {}),
    });

    return res.status(200).json({ message: "Application submitted", doc });
  } catch (error) {
    console.error("Apply error:", error);
    return res.status(500).json({ message: "Submission failed", error: error?.message || error });
  }
});

module.exports = router;
