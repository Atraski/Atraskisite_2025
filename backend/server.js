// server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const helmet = require("helmet");
const bcrypt = require("bcryptjs");

// 1) Load env
dotenv.config();

// 2) Core config
const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI ||
  process.env.MONGO ||
  "mongodb://127.0.0.1:27017/atraski";

// 3) App
const app = express();

/* -------------------- Security & CORS -------------------- */
// Helmet tuned for APIs
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  })
);

// Allowlist for multiple dev origins
const ALLOW = new Set(
  (process.env.CORS_ORIGINS ||
    "https://atraski.com"
  )
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
);

// Hard CORS (works reliably with Express 5 + multipart)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  // console.log("[CORS]", req.method, req.path, "origin:", origin); // <- debug if needed

  if (origin && ALLOW.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,PATCH,DELETE,OPTIONS"
    );
    // reflect requested headers so preflight never fails
    const reqHdr = req.headers["access-control-request-headers"];
    res.setHeader(
      "Access-Control-Allow-Headers",
      reqHdr || "Content-Type, Authorization"
    );
    // res.setHeader("Access-Control-Allow-Credentials", "true"); // only if you use cookies
  }

  // Preflight short-circuit (Express 5–safe)
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

/* -------------------- Parsers & Static -------------------- */
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* -------------------- Health -------------------- */
app.get("/healthz", (_req, res) => res.json({ ok: true, ts: Date.now() }));

/* -------------------- Auth & RBAC -------------------- */
const { auth, requireRoles } = require("./middleware/auth");

// Routes
const authRoutes = require("./routes/auth.route");        // /auth
const inviteRoutes = require("./routes/invites.route");   // /admin/invites
const userRoutes = require("./routes/users.routes");      // /admin/users
const jobRoutes = require("./routes/jobRoute.route");     // /api/applications

// Mount
app.use("/auth", authRoutes);

// Admin-only (Head + manager)
app.use("/admin/invites", auth, requireRoles("Head", "manager"), inviteRoutes);
app.use("/admin/users",   auth, requireRoles("Head", "manager"), userRoutes);

// Applications: POST (public apply), others protected (hr/manager/Head)
app.use(
  "/api/applications",
  (req, res, next) => {
    if (req.method !== "POST") {
      return auth(req, res, () =>
        requireRoles("hr", "manager", "Head")(req, res, next)
      );
    }
    return next();
  },
  jobRoutes
);

/* -------------------- Error Handler -------------------- */
app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  const message = err.message || "Server error";
  if (status >= 500) console.error(err);
  res.status(status).json({ error: message });
});

/* -------------------- Mongo & Start -------------------- */
mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log("✅ MongoDB connected");

    // debug: DB + collections
    mongoose.connection.once("open", async () => {
      const cols = await mongoose.connection.db.listCollections().toArray();
      console.log("🗄️  DB name:", mongoose.connection.name);
      console.log("📚 Collections:", cols.map((c) => c.name));
    });

    // Seed Head user if missing (dev convenience)
    try {
      const User = require("./models/User");
      const email = (process.env.SEED_HEAD_EMAIL || "head@atraski.in").toLowerCase();
      const pass  = process.env.SEED_HEAD_PASSWORD || "ChangeMe#Head";
      const exists = await User.findOne({ email });
      if (!exists) {
        const hash = await bcrypt.hash(pass, 10);
        await User.create({
          email,
          name: "Head User",
          role: "Head",
          passwordHash: hash,
          isActive: true,
          passwordMustChange: false,
          lastPasswordChangeAt: new Date(),
        });
        console.log("🟢 Seeded Head user:", email);
      } else {
        console.log("ℹ️  Head user exists:", exists.email);
      }
    } catch (e) {
      console.warn("Seed skipped:", e?.message || e);
    }

    app.listen(PORT, () =>
      console.log(`🚀 Server started at http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err?.message || err);
    process.exit(1);
  });
