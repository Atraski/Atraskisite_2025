import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api, API_BASE, logout } from "../api";
import "./Applications.css";

// Helper to download file
const downloadFile = async (url, filename) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Accept': '*/*'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Download failed');
      console.error('Download failed:', response.status, errorText);
      throw new Error(`Download failed: ${response.status}`);
    }
    
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    setTimeout(() => {
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(a);
    }, 100);
  } catch (err) {
    console.error('Download error:', err);
    alert('Download failed. Please try again or contact support.');
  }
};

const PAGE_SIZE = 20;

const STATUS_META = {
  approved: { label: "Approved", pill: "pill pill--green", dot: "dot dot--green" },
  rejected: { label: "Rejected", pill: "pill pill--red", dot: "dot dot--red" },
  pending:  { label: "Pending",  pill: "pill pill--yellow", dot: "dot dot--yellow" },
};

const normalizeUrl = (url = "") => url.replace(/\\/g, "/");

// Helper to get download URL - now uses MongoDB GridFS
const getResumeHref = (resumeUrl, resumeFileId, applicationId) => {
  // Priority: Use MongoDB GridFS if fileId exists
  if (applicationId && resumeFileId) {
    return `${API_BASE}api/applications/${applicationId}/resume`;
  }
  
  // Fallback: Legacy resumeUrl (for old data)
  if (resumeUrl) {
    const normalized = normalizeUrl(resumeUrl);
    
    // If it's a full URL (Cloudinary or external), use backend proxy
    if (normalized.startsWith("http") && applicationId) {
      return `${API_BASE}api/applications/${applicationId}/resume`;
    }
    
    // Local file path - prepend API_BASE
    if (!normalized.startsWith("http")) {
      return `${API_BASE}${normalized.startsWith("/") ? "" : "/"}${normalized}`;
    }
    
    return normalized;
  }
  
  // Use backend endpoint if we have applicationId
  if (applicationId) {
    return `${API_BASE}api/applications/${applicationId}/resume`;
  }
  
  return null;
};

// Helper to get file extension for download attribute
const getFileExtension = (url, mimeType, fileName) => {
  // Try filename first
  if (fileName) {
    const match = fileName.match(/\.([a-z0-9]+)$/i);
    if (match) return match[1].toLowerCase();
  }
  
  // Try MIME type
  if (mimeType) {
    const mimeMap = {
      'application/pdf': 'pdf',
      'application/msword': 'doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
      'image/jpeg': 'jpg',
      'image/png': 'png'
    };
    if (mimeMap[mimeType]) return mimeMap[mimeType];
  }
  
  // Try to extract extension from URL
  if (url) {
    const match = url.match(/\.([a-z0-9]+)(?:[?#]|$)/i);
    if (match) return match[1].toLowerCase();
  }
  
  return "pdf"; // Default to PDF
};

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [jobList, setJobList] = useState(["All"]);
  const [selectedJob, setSelectedJob] = useState("All");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [authError, setAuthError] = useState(false); // NEW: unauthorized flag
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setErr("");
    setAuthError(false);
    try {
      const { data } = await api.get("/api/applications");
      const clean = (Array.isArray(data) ? data : []).map((a) => ({
        ...a,
        jobTitle: (a.jobTitle || "General").trim(),
        status: a.status || "pending",
      }));
      setApps(clean);
      const titles = Array.from(
        new Set(
          clean
            .map((a) => a.jobTitle)
            .map((t) => (t || "").trim())
            .filter(Boolean)
        )
      );
      setJobList(["All", ...titles]);
      setPage(1);
    } catch (e) {
      // Detect 401
      if (e?.response?.status === 401) {
        setAuthError(true);
        setErr("You’re not logged in.");
      } else {
        setErr(e?.response?.data?.error || "Failed to load");
      }
      setApps([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    if (selectedJob === "All") return apps;
    return apps.filter((a) => (a.jobTitle || "").trim() === selectedJob.trim());
  }, [apps, selectedJob]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const current = filtered.slice(start, start + PAGE_SIZE);

  const setStatus = async (id, status) => {
    try {
      setBusyId(id);
      setApps((prev) => prev.map((a) => (a._id === id ? { ...a, status } : a)));
      await api.patch(`/api/applications/${id}/status`, { status });
    } catch {
      await fetchData();
    } finally {
      setBusyId(null);
    }
  };

  const userEmail = localStorage.getItem("email") || "";
  const userRole = localStorage.getItem("role") || "";

  return (
    <div className="ap-root">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <h2 className="ap-title" style={{ margin: 0 }}>Job Applications</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link to="/jobs" className="ap-btn ap-btn--secondary" style={{ textDecoration: 'none' }}>
            Manage Jobs
          </Link>
          {userEmail && (
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              <span style={{ fontWeight: 600, color: '#374151' }}>{userEmail}</span>
              {userRole && <span style={{ marginLeft: '8px', textTransform: 'capitalize' }}>({userRole})</span>}
            </div>
          )}
          <button className="ap-btn ap-btn--secondary" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {/* Unauthorized banner with Login CTA */}
      {authError && (
        <div className="ap-alert ap-alert--warn">
          <div className="ap-alert__text">
            Unauthorized (401). Please log in to access the admin panel.
          </div>
          <button
            className="ap-btn ap-btn--primary"
            onClick={() => {
              const after = encodeURIComponent(window.location.pathname + window.location.search);
              window.location.href = `/login?next=${after}`;
            }}
          >
            Go to Login
          </button>
        </div>
      )}

      {/* Other errors (non-401) */}
      {!authError && err && (
        <div className="ap-alert">
          {err === "Unauthorized"
            ? "Unauthorized (401). Please login again."
            : err}
        </div>
      )}

      {/* Top toolbar (hidden when unauthorized) */}
      {!authError && (
        <div className="ap-toolbar">
          <label className="ap-label">Filter by Job Title:</label>
          <select
            className="ap-select"
            value={selectedJob}
            onChange={(e) => {
              setSelectedJob(e.target.value);
              setPage(1);
            }}
          >
            {jobList.map((j) => (
              <option key={j} value={j}>{j}</option>
            ))}
          </select>

          <button className="ap-btn" onClick={fetchData}>Refresh</button>

          <div className="ap-legend">
            <span className="legendItem"><span className="dot dot--green" />Approved</span>
            <span className="legendItem"><span className="dot dot--red" />Rejected</span>
            <span className="legendItem"><span className="dot dot--yellow" />Pending</span>
          </div>
        </div>
      )}

      {/* Table or states */}
      {!authError && (
        <div className="ap-tableWrap">
          <table className="ap-table">
            {/* Fixed widths */}
            <colgroup>
              <col style={{ width: "110px" }} />
              <col style={{ width: "220px" }} />
              <col style={{ width: "280px" }} />
              <col style={{ width: "140px" }} />
              <col style={{ width: "140px" }} />
              <col style={{ width: "220px" }} />
              <col style={{ width: "180px" }} />
              <col />
              <col style={{ width: "130px" }} />
              <col style={{ width: "130px" }} />
              <col style={{ width: "160px" }} />
            </colgroup>
            <thead>
              <tr>
                <th>Status</th>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>WhatsApp</th>
                <th>Job Title</th>
                <th>Location</th>
                <th>Message</th>
                <th>Resume</th>
                <th>Applied On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="11" className="ap-empty">Loading…</td></tr>
              ) : current.length === 0 ? (
                <tr><td colSpan="11" className="ap-empty">No applications found</td></tr>
              ) : (
                current.map((app) => {
                  const meta = STATUS_META[app.status] || STATUS_META.pending;
                  const resumeHref = getResumeHref(app.resumeUrl, app.resumeFileId, app._id);
                  const fileExt = getFileExtension(app.resumeUrl, app.resumeMimeType, app.resumeFileName);
                  const fileName = app.resumeFileName || `resume-${(app.name || 'file').replace(/\s+/g, '-')}.${fileExt}`;

                  return (
                    <tr key={app._id}>
                      <td>
                        <div className={meta.pill}>
                          <span className={meta.dot} />
                          <span className="pill__text">{meta.label}</span>
                        </div>
                      </td>
                      <td className="td-text">{app.name || "—"}</td>
                      <td className="td-text">{app.email || "—"}</td>
                      <td className="td-text">{app.contactNumber || "—"}</td>
                      <td className="td-text">{app.whatsappNumber || "—"}</td>
                      <td className="td-text">{app.jobTitle || "General"}</td>
                      <td className="td-text">
                        {app.location || "—"}
                      </td>
                      <td className="td-text">{app.message || "—"}</td>
                      <td className="td-text">
                        {resumeHref ? (
                          <button
                            className="ap-link"
                            style={{ 
                              background: 'none', 
                              border: 'none', 
                              color: '#1d4ed8', 
                              textDecoration: 'underline', 
                              fontWeight: 700, 
                              fontSize: '13px',
                              cursor: 'pointer',
                              padding: 0
                            }}
                            onClick={async (e) => {
                              e.preventDefault();
                              await downloadFile(resumeHref, fileName);
                            }}
                          >
                            Download
                          </button>
                        ) : "—"}
                      </td>
                      <td className="td-text">
                        {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "—"}
                      </td>
                      <td>
                        <div className="actions">
                          <button
                            type="button"
                            className={`btn-dot btn-dot--green ${busyId === app._id ? "is-busy" : ""}`}
                            aria-label="Approve"
                            onClick={() => setStatus(app._id, "approved")}
                            disabled={busyId === app._id}
                          />
                          <button
                            type="button"
                            className={`btn-dot btn-dot--red ${busyId === app._id ? "is-busy" : ""}`}
                            aria-label="Reject"
                            onClick={() => setStatus(app._id, "rejected")}
                            disabled={busyId === app._id}
                          />
                          <button
                            type="button"
                            className={`btn-dot btn-dot--yellow ${busyId === app._id ? "is-busy" : ""}`}
                            aria-label="Set Pending"
                            onClick={() => setStatus(app._id, "pending")}
                            disabled={busyId === app._id}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pager */}
      {!authError && !loading && filtered.length > 0 && (
        <div className="ap-pager">
          <div className="ap-pager__info">
            Showing {start + 1}–{Math.min(start + PAGE_SIZE, filtered.length)} of {filtered.length}
          </div>
          <div className="ap-pager__nav">
            <button className="ap-btn small" onClick={() => setPage(1)} disabled={page === 1}>« First</button>
            <button className="ap-btn small" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>‹ Prev</button>
            <span className="ap-pageText">Page {page} of {totalPages}</span>
            <button className="ap-btn small" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next ›</button>
            <button className="ap-btn small" onClick={() => setPage(totalPages)} disabled={page === totalPages}>Last »</button>
          </div>
        </div>
      )}
    </div>
  );
}

