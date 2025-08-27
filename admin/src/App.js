// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";

import Applications from "./components/Applications"; // adjust if path differs
import Login from "./pages/Login";                   // make sure this file exists

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Navigate to="/applications" replace />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <Applications />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<div style={{ padding: 24 }}>Not Found</div>} />
      </Routes>
    </ErrorBoundary>
  );
}
