const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const JobApplication = require("../Models/JobApplication.js");

// Ensure uploads folder exists
const uploadFolder = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);

// Multer local storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// ✅ POST Route (Local upload)
router.post("/apply", upload.single("resume"), async (req, res) => {
  try {
    const {
      name,
      email,
      contactNumber,
      whatsappNumber,
      jobTitle,   // ✅ matched with schema
      message,    // ✅ added
    } = req.body;

    const resumeUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newApp = new JobApplication({
      name,
      email,
      contactNumber,
      whatsappNumber,
      jobTitle,
      message,
      resumeUrl,
    });

    await newApp.save();
    res.status(200).json({ message: "Application submitted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Submission failed", error });
  }
});

module.exports = router;
