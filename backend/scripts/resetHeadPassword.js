// scripts/resetHeadPassword.js - Reset Head user password
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

(async () => {
  try {
    if (!process.env.MONGODB_URI) throw new Error("Missing MONGODB_URI");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected\n");

    const email = (process.env.SEED_HEAD_EMAIL || "head@atraski.in").toLowerCase();
    const newPassword = process.argv[2] || process.env.SEED_HEAD_PASSWORD || "ChangeMe#Head";

    console.log("🔄 Resetting password for:", email);
    console.log("   New password:", newPassword);
    console.log("");

    const passwordHash = await bcrypt.hash(newPassword, 10);

    const user = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          passwordHash,
          isActive: true, // Ensure user is active
          passwordMustChange: false,
          lastPasswordChangeAt: new Date(),
        },
      },
      { upsert: true, new: true }
    );

    console.log("✅ Password reset successful!");
    console.log("📋 User Details:");
    console.log("  Email:", user.email);
    console.log("  Role:", user.role);
    console.log("  isActive:", user.isActive);
    console.log("");
    console.log("🔐 Login Credentials:");
    console.log("  Email:", email);
    console.log("  Password:", newPassword);
    console.log("");

    await mongoose.disconnect();
    process.exit(0);
  } catch (e) {
    console.error("❌ Error:", e);
    process.exit(1);
  }
})();


