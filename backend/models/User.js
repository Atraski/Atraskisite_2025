const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    name: { type: String, default: "" },
    role: { type: String, enum: ["hr", "manager", "Head"], required: true },
    passwordHash: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    passwordMustChange: { type: Boolean, default: false },
    lastPasswordChangeAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
