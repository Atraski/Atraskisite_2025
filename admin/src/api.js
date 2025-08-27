import axios from "axios";

export const API_BASE = import.meta?.env?.VITE_API_BASE || "http://localhost:5000";

export const api = axios.create({ baseURL: API_BASE });

// attach token
api.interceptors.request.use((cfg) => {
  try {
    const t = localStorage.getItem("token");
    if (t) cfg.headers.Authorization = `Bearer ${t}`;
  } catch {}
  return cfg;
});

// 401 -> go to /login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      try { localStorage.removeItem("token"); } catch {}
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

// optional helper
export const logout = () => {
  try { localStorage.removeItem("token"); } catch {}
  window.location.href = "/login";
};
