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
    <div style={{ 
      minHeight: "100vh", 
      display: "grid", 
      placeItems: "center", 
      background: "#f9fafb", 
      padding: "20px 16px",
      boxSizing: "border-box"
    }}>
      <form onSubmit={submit} style={{ 
        width: "100%", 
        maxWidth: 400, 
        background: "#fff", 
        padding: "24px 20px", 
        borderRadius: 12, 
        boxShadow: "0 6px 24px rgba(0,0,0,0.08)",
        boxSizing: "border-box"
      }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20, color: "#111827" }}>Admin Login</h1>

        {err && <div style={{ 
          background: "#FEF2F2", 
          color: "#991B1B", 
          border: "1px solid #FECACA", 
          padding: "12px 16px", 
          borderRadius: 8, 
          marginBottom: 16,
          fontSize: 14
        }}>{err}</div>}

        <label style={{ 
          fontSize: 14, 
          color: "#374151", 
          fontWeight: 600,
          display: "block",
          marginBottom: 6
        }}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@company.com"
          style={{ 
            width: "100%", 
            padding: "12px 16px", 
            border: "1px solid #e5e7eb", 
            borderRadius: 8, 
            marginBottom: 16,
            fontSize: 14,
            boxSizing: "border-box"
          }}
        />

        <label style={{ 
          fontSize: 14, 
          color: "#374151", 
          fontWeight: 600,
          display: "block",
          marginBottom: 6
        }}>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPwd(e.target.value)}
          required
          placeholder="••••••••"
          style={{ 
            width: "100%", 
            padding: "12px 16px", 
            border: "1px solid #e5e7eb", 
            borderRadius: 8, 
            marginBottom: 20,
            fontSize: 14,
            boxSizing: "border-box"
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{ 
            width: "100%", 
            padding: "12px 16px", 
            background: loading ? "#6b7280" : "#111827", 
            color: "#fff", 
            border: "none", 
            borderRadius: 8, 
            fontWeight: 600, 
            fontSize: 14,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.2s"
          }}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
