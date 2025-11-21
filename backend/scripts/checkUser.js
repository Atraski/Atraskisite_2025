// scripts/checkUser.js - Check user status in database
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

(async () => {
  try {
    if (!process.env.MONGODB_URI) throw new Error("Missing MONGODB_URI");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected\n");

    const email = process.argv[2] || "head@atraski.in";
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log("❌ User not found:", email);
      process.exit(1);
    }

    console.log("📋 User Details:");
    console.log("  Email:", user.email);
    console.log("  Name:", user.name);
    console.log("  Role:", user.role);
    console.log("  isActive:", user.isActive);
    console.log("  passwordMustChange:", user.passwordMustChange);
    console.log("  Has passwordHash:", !!user.passwordHash);
    console.log("  Created:", user.createdAt);
    console.log("  Updated:", user.updatedAt);
    console.log("");

    // Test password
    const testPassword = process.argv[3] || "ChangeMe#Head";
    const passwordMatch = await bcrypt.compare(testPassword, user.passwordHash || "");
    console.log("🔐 Password Test:");
    console.log("  Test password:", testPassword);
    console.log("  Password matches:", passwordMatch);
    console.log("");

    // Check if user can login in production
    const isProduction = process.env.NODE_ENV === "production";
    const canLogin = isProduction ? user.isActive === true : true;
    console.log("🚪 Login Status:");
    console.log("  Environment:", process.env.NODE_ENV || "development");
    console.log("  Can login:", canLogin);
    if (!canLogin) {
      console.log("  ⚠️  User cannot login because isActive is false in production!");
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (e) {
    console.error("❌ Error:", e);
    process.exit(1);
  }
})();


