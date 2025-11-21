const express = require("express");
const router = express.Router();
const Job = require("../models/Job");

/* =========================
   GET /api/jobs
   Public - returns only active jobs
========================= */
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true })
      .sort({ createdAt: -1 })
      .select("-__v")
      .lean();
    res.status(200).json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

/* =========================
   GET /api/jobs/:slug
   Public - get single job by slug
========================= */
router.get("/:slug", async (req, res) => {
  try {
    const job = await Job.findOne({ slug: req.params.slug, isActive: true })
      .select("-__v")
      .lean();
    
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }
    
    res.status(200).json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch job" });
  }
});

/* =========================
   GET /api/jobs/admin/all
   Protected - returns all jobs (active + inactive)
========================= */
router.get("/admin/all", async (req, res) => {
  try {
    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .select("-__v")
      .lean();
    res.status(200).json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

/* =========================
   POST /admin/jobs
   Protected - create new job
========================= */
router.post("/admin/create", async (req, res) => {
  try {
    const { title, location, category, description, fullDescription, experience, type } = req.body;

    if (!title || !location || !category || !description) {
      return res.status(400).json({ error: "Missing required fields: title, location, category, description" });
    }

    const job = await Job.create({
      title: String(title).trim(),
      location: String(location).trim(),
      category: String(category).trim(),
      description: String(description).trim(),
      fullDescription: fullDescription ? String(fullDescription).trim() : "",
      experience: experience ? String(experience).trim() : "",
      type: type ? String(type).trim() : "Full-time",
      isActive: true,
    });

    res.status(201).json({ message: "Job created successfully", job });
  } catch (err) {
    console.error("Create job error:", err);
    if (err.code === 11000) {
      return res.status(400).json({ error: "A job with this title already exists" });
    }
    res.status(500).json({ error: "Failed to create job", detail: err.message });
  }
});

/* =========================
   PATCH /admin/jobs/:id
   Protected - update job
========================= */
router.patch("/admin/:id", async (req, res) => {
  try {
    const { title, location, category, description, fullDescription, experience, type } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = String(title).trim();
    if (location !== undefined) updateData.location = String(location).trim();
    if (category !== undefined) updateData.category = String(category).trim();
    if (description !== undefined) updateData.description = String(description).trim();
    if (fullDescription !== undefined) updateData.fullDescription = String(fullDescription).trim();
    if (experience !== undefined) updateData.experience = String(experience).trim();
    if (type !== undefined) updateData.type = String(type).trim();

    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.status(200).json({ message: "Job updated successfully", job });
  } catch (err) {
    console.error("Update job error:", err);
    res.status(500).json({ error: "Failed to update job", detail: err.message });
  }
});

/* =========================
   PATCH /admin/jobs/:id/toggle-active
   Protected - toggle job active status
========================= */
router.patch("/admin/:id/toggle-active", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    job.isActive = !job.isActive;
    await job.save();

    res.status(200).json({ 
      message: `Job ${job.isActive ? 'activated' : 'deactivated'} successfully`,
      job: job.toObject()
    });
  } catch (err) {
    console.error("Toggle active error:", err);
    res.status(500).json({ error: "Failed to toggle job status", detail: err.message });
  }
});

/* =========================
   DELETE /admin/jobs/:id
   Protected - delete job
========================= */
router.delete("/admin/:id", async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error("Delete job error:", err);
    res.status(500).json({ error: "Failed to delete job", detail: err.message });
  }
});

module.exports = router;

