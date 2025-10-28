// models/JobApplication.js
const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema(
  {
    name:           { type: String, required: true, trim: true },
    email:          { type: String, required: true, trim: true },
    contactNumber:  { type: String, required: true, trim: true },
    whatsappNumber: { type: String, required: true, trim: true },
    jobTitle:       { type: String, required: true, trim: true },
    message:        { type: String, required: true, trim: true },

    // ✅ FINAL: singular field names
    location:         { type: String, trim: true },       // e.g., "Delhi"
    jobLocationLabel: { type: String, trim: true },       // e.g., "Delhi, Kolkata"

    // file/url (local uploads or cloud url)
    resumeUrl:      { type: String, trim: true },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// helpful indexes
jobApplicationSchema.index({ location: 1, jobTitle: 1, createdAt: -1 });
jobApplicationSchema.index({ email: 1, createdAt: -1 });

module.exports = mongoose.model("JobApplication", jobApplicationSchema);
