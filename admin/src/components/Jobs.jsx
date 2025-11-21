import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, API_BASE, logout } from "../api";
import "./Jobs.css";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    category: "",
    description: "",
    fullDescription: "",
    experience: "",
    type: "Full-time",
  });

  const fetchJobs = async () => {
    setLoading(true);
    setErr("");
    try {
      const { data } = await api.get("/api/jobs/admin/all");
      setJobs(Array.isArray(data) ? data : []);
    } catch (e) {
      if (e?.response?.status === 401) {
        setErr("You're not logged in.");
      } else {
        setErr(e?.response?.data?.error || "Failed to load jobs");
      }
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleToggleActive = async (id, currentStatus) => {
    try {
      const { data } = await api.patch(`/api/jobs/admin/${id}/toggle-active`);
      setJobs((prev) =>
        prev.map((job) => (job._id === id ? { ...job, isActive: data.job.isActive } : job))
      );
    } catch (e) {
      alert(e?.response?.data?.error || "Failed to toggle job status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await api.delete(`/api/jobs/admin/${id}`);
      setJobs((prev) => prev.filter((job) => job._id !== id));
    } catch (e) {
      alert(e?.response?.data?.error || "Failed to delete job");
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job._id);
    setFormData({
      title: job.title || "",
      location: job.location || "",
      category: job.category || "",
      description: job.description || "",
      fullDescription: job.fullDescription || "",
      experience: job.experience || "",
      type: job.type || "Full-time",
    });
    setShowCreateModal(true);
  };

  const handleCreate = () => {
    setEditingJob(null);
    setFormData({
      title: "",
      location: "",
      category: "",
      description: "",
      fullDescription: "",
      experience: "",
      type: "Full-time",
    });
    setShowCreateModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingJob) {
        await api.patch(`/api/jobs/admin/${editingJob}`, formData);
      } else {
        await api.post("/api/jobs/admin/create", formData);
      }
      setShowCreateModal(false);
      setEditingJob(null);
      fetchJobs();
    } catch (e) {
      alert(e?.response?.data?.error || "Failed to save job");
    }
  };

  const userEmail = localStorage.getItem("email") || "";
  const userRole = localStorage.getItem("role") || "";

  return (
    <div className="jobs-root">
      <div className="jobs-header">
        <h2 className="jobs-title">Job Openings</h2>
        <div className="jobs-header-right">
          <Link to="/applications" className="jobs-btn jobs-btn--secondary" style={{ textDecoration: 'none' }}>
            View Applications
          </Link>
          {userEmail && (
            <div className="jobs-user-info">
              <span className="jobs-user-email">{userEmail}</span>
              {userRole && <span className="jobs-user-role">({userRole})</span>}
            </div>
          )}
          <button className="jobs-btn jobs-btn--primary" onClick={handleCreate}>
            + Create New Job
          </button>
          <button className="jobs-btn jobs-btn--secondary" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {err && <div className="jobs-alert jobs-alert--error">{err}</div>}

      {loading ? (
        <div className="jobs-loading">Loading jobs...</div>
      ) : (
        <div className="jobs-table-wrap">
          <table className="jobs-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Location</th>
                <th>Status</th>
                <th>Slug</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan="7" className="jobs-empty">
                    No jobs found. Create your first job opening!
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job._id}>
                    <td className="jobs-td-text">{job.title || "—"}</td>
                    <td className="jobs-td-text">{job.category || "—"}</td>
                    <td className="jobs-td-text">{job.location || "—"}</td>
                    <td>
                      <span
                        className={`jobs-status-badge ${
                          job.isActive ? "jobs-status-badge--active" : "jobs-status-badge--inactive"
                        }`}
                      >
                        {job.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="jobs-td-text jobs-slug">
                      <code>{job.slug || "—"}</code>
                    </td>
                    <td className="jobs-td-text">
                      {job.createdAt
                        ? new Date(job.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td>
                      <div className="jobs-actions">
                        <button
                          className="jobs-btn-small jobs-btn-small--edit"
                          onClick={() => handleEdit(job)}
                        >
                          Edit
                        </button>
                        <button
                          className={`jobs-btn-small ${
                            job.isActive
                              ? "jobs-btn-small--disable"
                              : "jobs-btn-small--enable"
                          }`}
                          onClick={() => handleToggleActive(job._id, job.isActive)}
                        >
                          {job.isActive ? "Disable" : "Enable"}
                        </button>
                        <button
                          className="jobs-btn-small jobs-btn-small--delete"
                          onClick={() => handleDelete(job._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="jobs-modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="jobs-modal" onClick={(e) => e.stopPropagation()}>
            <div className="jobs-modal-header">
              <h3>{editingJob ? "Edit Job" : "Create New Job"}</h3>
              <button
                className="jobs-modal-close"
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingJob(null);
                }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="jobs-form">
              <div className="jobs-form-group">
                <label>
                  Job Title <span className="jobs-required">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., MERN Full Stack Developer"
                />
              </div>

              <div className="jobs-form-row">
                <div className="jobs-form-group">
                  <label>
                    Category <span className="jobs-required">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Engineering"
                  />
                </div>

                <div className="jobs-form-group">
                  <label>
                    Location <span className="jobs-required">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Delhi, Kolkata"
                  />
                </div>
              </div>

              <div className="jobs-form-row">
                <div className="jobs-form-group">
                  <label>Experience</label>
                  <input
                    type="text"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    placeholder="e.g., 2+ years"
                  />
                </div>

                <div className="jobs-form-group">
                  <label>Job Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              <div className="jobs-form-group">
                <label>
                  Short Description <span className="jobs-required">*</span>
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description for job cards..."
                  rows={3}
                />
              </div>

              <div className="jobs-form-group">
                <label>Full Description (HTML supported)</label>
                <textarea
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  placeholder="Detailed job description with HTML formatting..."
                  rows={10}
                />
                <small className="jobs-form-hint">
                  You can use HTML tags like &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt; for formatting
                </small>
              </div>

              <div className="jobs-form-actions">
                <button
                  type="button"
                  className="jobs-btn jobs-btn--secondary"
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingJob(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="jobs-btn jobs-btn--primary">
                  {editingJob ? "Update Job" : "Create Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

