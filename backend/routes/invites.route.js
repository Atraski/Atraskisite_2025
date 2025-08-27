const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const InviteToken = require("../models/InviteToken");
const User = require("../models/User");
const { sendInviteEmail } = require("../utils/mailer");

// POST /admin/invites   body: { email, role, name }
router.post("/", async (req, res) => {
  const { email, role = "hr", name = "" } = req.body || {};
  if (!email) return res.status(400).json({ error: "Email required" });
  if (!["hr","manager","Head"].includes(role)) return res.status(400).json({ error: "Invalid role" });

  // Manager cannot invite manager/Head (this route should already be protected by requireRoles in server.js;
  // if you still want double-check:
  if (req.auth.role === "manager" && role !== "hr") {
    return res.status(403).json({ error: "Managers can invite HR only" });
  }

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) return res.status(409).json({ error: "User already exists" });

  const raw = crypto.randomBytes(24).toString("hex"); // one-time token
  const tokenHash = await bcrypt.hash(raw, 10);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

  await InviteToken.create({
    email: email.toLowerCase(),
    role,
    name,
    tokenHash,
    expiresAt
  });

  const link = `${process.env.FRONTEND_ORIGIN}/accept-invite?token=${encodeURIComponent(raw)}&email=${encodeURIComponent(email)}`;

  // Try sending email if SMTP configured; otherwise just return link
  let emailed = false;
  try { emailed = await sendInviteEmail(email, link); } catch { emailed = false; }

  res.status(201).json({ inviteLink: link, emailed });
});

module.exports = router;
