const express = require("express");
const router = express.Router();
const User = require("../models/User");

// List users (Head + manager)
router.get("/", async (req, res) => {
  const { role, q = "", page = 1, limit = 25 } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (q) filter.$or = [{ email: new RegExp(q, "i") }, { name: new RegExp(q, "i") }];

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
    User.countDocuments(filter)
  ]);
  res.json({ items, total, page: Number(page), limit: Number(limit) });
});

// Change role (Head only) — mount with requireRoles("Head") in server.js
router.patch("/:id/role", async (req, res) => {
  const { role } = req.body || {};
  if (!["hr","manager","Head"].includes(role)) return res.status(400).json({ error: "Invalid role" });
  const u = await User.findById(req.params.id);
  if (!u) return res.status(404).json({ error: "User not found" });

  // prevent removing last Head
  if (u.role === "Head" && role !== "Head") {
    const heads = await User.countDocuments({ role: "Head", isActive: true });
    if (heads <= 1) return res.status(400).json({ error: "Cannot demote last active Head" });
  }

  u.role = role;
  await u.save();
  res.json({ ok: true });
});

// Activate/deactivate (Head only)
router.patch("/:id/status", async (req, res) => {
  const { isActive } = req.body || {};
  const u = await User.findById(req.params.id);
  if (!u) return res.status(404).json({ error: "User not found" });

  if (u.role === "Head" && isActive === false) {
    const heads = await User.countDocuments({ role: "Head", isActive: true });
    if (heads <= 1) return res.status(400).json({ error: "Cannot deactivate last active Head" });
  }

  u.isActive = !!isActive;
  await u.save();
  res.json({ ok: true });
});

module.exports = router;
