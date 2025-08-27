const mongoose = require("mongoose");

const inviteTokenSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, index: true, lowercase: true, trim: true },
    role:  { type: String, enum: ["hr","manager","Head"], required: true },
    name:  { type: String, default: "" },
    tokenHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    used: { type: Boolean, default: false }
  },
  { timestamps: true }
);

inviteTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("InviteToken", inviteTokenSchema);
