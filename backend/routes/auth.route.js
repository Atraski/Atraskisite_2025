// routes/auth.route.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");

// ⚠️ Use LOWERCASE 'models'
const User = require("../models/User");
const InviteToken = require("../models/InviteToken");

const loginLimiter = rateLimit({ windowMs: 60_000, max: 10 });

const ISSUE_TOKEN = (user) =>
  jwt.sign(
    { uid: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_TTL || "30m" }
  );

const validatePassword = (pwd = "") =>
  pwd.length >= 8 &&
  /[A-Z]/.test(pwd) &&
  /[a-z]/.test(pwd) &&
  /\d/.test(pwd) &&
  /[^A-Za-z0-9]/.test(pwd);

/* =========================
   POST /auth/login
========================= */
router.post("/login", loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const devMode = (process.env.NODE_ENV || "development") !== "production";
    const baseQuery = { email: String(email).toLowerCase() };

    // 👇 DEV: ignore isActive completely
    const query = devMode ? baseQuery : { ...baseQuery, isActive: true };

    // Extra debug to confirm DB/collection
    console.log("[LOGIN] query:", query);
    const user = await User.findOne(query);
    console.log("[LOGIN userFound?]", !!user);

    // If still not found, check email-only once (hard diagnostic)
    if (!user) {
      const emailOnly = await User.findOne(baseQuery);
      console.log("[LOGIN email-only exists?]", !!emailOnly, emailOnly ? { isActive: emailOnly.isActive } : null);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash || "");
    console.log("[LOGIN passwordMatch?]", ok);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = ISSUE_TOKEN(user);
    return res.json({
      token,
      user: { email: user.email, role: user.role, passwordMustChange: !!user.passwordMustChange },
    });
  } catch (err) {
    console.error("[AUTH /login] error:", err);
    return res.status(500).json({ error: "Login failed" });
  }
});


/* =========================
   POST /auth/change-password  (mount behind auth middleware)
========================= */
router.post("/change-password", async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body || {};
    if (!currentPassword || !newPassword || !confirmPassword)
      return res.status(400).json({ error: "All fields are required" });
    if (newPassword !== confirmPassword)
      return res.status(400).json({ error: "Passwords do not match" });
    if (!validatePassword(newPassword))
      return res
        .status(400)
        .json({ error: "Weak password (8+, upper/lower/number/symbol)" });

    const user = await User.findById(req.auth?.uid);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Current password is incorrect" });

    const same = await bcrypt.compare(newPassword, user.passwordHash);
    if (same) return res.status(400).json({ error: "New password must be different" });

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.passwordMustChange = false;
    user.lastPasswordChangeAt = new Date();
    await user.save();

    const token = ISSUE_TOKEN(user);
    return res.json({ ok: true, token, user: { email: user.email, role: user.role } });
  } catch (err) {
    console.error("[AUTH /change-password] error:", err);
    return res.status(500).json({ error: "Change password failed" });
  }
});

/* =========================
   GET /auth/validate-invite
========================= */
router.get("/validate-invite", async (req, res) => {
  try {
    const { email = "", token = "" } = req.query;
    const invite = await InviteToken.findOne({
      email: email.toLowerCase(),
      used: false,
    }).sort({ createdAt: -1 });

    if (!invite)
      return res.status(404).json({ ok: false, error: "Invalid/expired invite" });
    if (invite.expiresAt < new Date())
      return res.status(410).json({ ok: false, error: "Invite expired" });

    const ok = await bcrypt.compare(String(token), invite.tokenHash);
    if (!ok) return res.status(400).json({ ok: false, error: "Invalid invite" });

    return res.json({ ok: true, email: invite.email, role: invite.role, name: invite.name });
  } catch (err) {
    console.error("[AUTH /validate-invite] error:", err);
    return res.status(500).json({ ok: false, error: "Validation failed" });
  }
});

/* =========================
   POST /auth/accept-invite
========================= */
router.post("/accept-invite", async (req, res) => {
  try {
    const { email, token, password, name = "" } = req.body || {};
    if (!email || !token || !password)
      return res.status(400).json({ error: "Missing fields" });
    if (!validatePassword(password))
      return res.status(400).json({ error: "Weak password" });

    const invite = await InviteToken.findOne({
      email: email.toLowerCase(),
      used: false,
    }).sort({ createdAt: -1 });

    if (!invite) return res.status(400).json({ error: "Invalid invite" });
    if (invite.expiresAt < new Date())
      return res.status(410).json({ error: "Invite expired" });

    const ok = await bcrypt.compare(String(token), invite.tokenHash);
    if (!ok) return res.status(400).json({ error: "Invalid invite" });

    let user = await User.findOne({ email: email.toLowerCase() });
    const passwordHash = await bcrypt.hash(password, 10);

    if (!user) {
      user = await User.create({
        email: email.toLowerCase(),
        name: invite.name || name,
        role: invite.role,
        passwordHash,
        isActive: true,
        passwordMustChange: false,
        lastPasswordChangeAt: new Date(),
      });
    } else {
      user.name = user.name || invite.name || name;
      user.role = user.role || invite.role;
      user.isActive = true;
      user.passwordHash = passwordHash;
      user.passwordMustChange = false;
      user.lastPasswordChangeAt = new Date();
      await user.save();
    }

    invite.used = true;
    await invite.save();

    const tokenJwt = ISSUE_TOKEN(user);
    return res.json({ ok: true, token: tokenJwt, user: { email: user.email, role: user.role } });
  } catch (err) {
    console.error("[AUTH /accept-invite] error:", err);
    return res.status(500).json({ error: "Accept invite failed" });
  }
});

module.exports = router;
