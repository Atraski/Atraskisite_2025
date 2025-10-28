// scripts/seedHead.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

(async () => {
  try {
    if (!process.env.MONGODB_URI) throw new Error("Missing MONGODB_URI");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Mongo connected");

    const email = "head@atraski.in";
    const plain = "ChangeMe#Head"; // <- yahi password se login karna

    const passwordHash = await bcrypt.hash(plain, 10);

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      {
        $set: {
          email: email.toLowerCase(),
          name: "Head User",
          role: "Head",
          passwordHash,
          isActive: true,
          passwordMustChange: false,
          lastPasswordChangeAt: new Date(),
        },
      },
      { upsert: true, new: true }
    );

    console.log("Seeded:", { email: user.email, role: user.role });
    console.log("Login with:", email, plain);
    await mongoose.disconnect();
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();