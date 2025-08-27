import React, { useEffect, useMemo, useState } from "react";
import { api, API_BASE } from "../api";
import "./Applications.css";

const PAGE_SIZE = 20;

const STATUS_META = {
  approved: { label: "Approved", pill: "pill pill--green", dot: "dot dot--green" },
  rejected: { label: "Rejected", pill: "pill pill--red", dot: "dot dot--red" },
  pending:  { label: "Pending",  pill: "pill pill--yellow", dot: "dot dot--yellow" },
};

const normalizeUrl = (url = "") => url.replace(/\\/g, "/");
const getResumeHref = (resumeUrl) => {
  if (!resumeUrl) return null;
  const normalized = normalizeUrl(resumeUrl);
  return normalized.startsWith("http")
    ? normalized
    : `${API_BASE}${normalized.startsWith("/") ? "" : "/"}${normalized}`;
};

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [jobList, setJobList] = useState(["All"]);
  const [selectedJob, setSelectedJob] = useState("All");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setErr("");
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
      setErr(e?.response?.data?.error || "Failed to load");
      setApps([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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

  return (
    <div className="ap-root">
      <h2 className="ap-title">Job Applications</h2>

      {err && (
        <div className="ap-alert">
          {err === "Unauthorized" ? "Unauthorized (401). Please login again." : err}
        </div>
      )}

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
              <th>Message</th>
              <th>Resume</th>
              <th>Applied On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="10" className="ap-empty">Loading…</td></tr>
            ) : current.length === 0 ? (
              <tr><td colSpan="10" className="ap-empty">No applications found</td></tr>
            ) : (
              current.map((app) => {
                const meta = STATUS_META[app.status] || STATUS_META.pending;
                const resumeHref = getResumeHref(app.resumeUrl);

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
                    <td className="td-text">{app.message || "—"}</td>
                    <td className="td-text">
                      {resumeHref ? (
                        <a className="ap-link" href={resumeHref} target="_blank" rel="noreferrer">
                          Download
                        </a>
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

      {!loading && filtered.length > 0 && (
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
