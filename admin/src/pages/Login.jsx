// src/pages/Login.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const nav = useNavigate();
  const loc = useLocation();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data?.user?.role || "");
      localStorage.setItem("email", data?.user?.email || "");
      // go where user came from or applications
      const dest = loc.state?.from?.pathname || "/applications";
      nav(dest, { replace: true });
    } catch (e2) {
      setErr(e2?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f9fafb", padding: 24 }}>
      <form onSubmit={submit} style={{ width: 360, maxWidth: "100%", background: "#fff", padding: 24, borderRadius: 12, boxShadow: "0 6px 24px rgba(0,0,0,0.08)" }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Admin Login</h1>

        {err && <div style={{ background: "#FEF2F2", color: "#991B1B", border: "1px solid #FECACA", padding: 10, borderRadius: 8, marginBottom: 12 }}>{err}</div>}

        <label style={{ fontSize: 12, color: "#6b7280" }}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@company.com"
          style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 8, marginTop: 4, marginBottom: 12 }}
        />

        <label style={{ fontSize: 12, color: "#6b7280" }}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPwd(e.target.value)}
          required
          placeholder="••••••••"
          style={{ width: "100%", padding: "10px 12px", border: "1px solid #e5e7eb", borderRadius: 8, marginTop: 4, marginBottom: 16 }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%", padding: "10px 12px", background: "#111827", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
