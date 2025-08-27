import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props){ super(props); this.state = { hasError: false, message: "" }; }
  static getDerivedStateFromError(err){ return { hasError: true, message: String(err?.message || err) }; }
  componentDidCatch(err, info){ console.error("UI Error:", err, info); }
  render(){
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24 }}>
          <h3 style={{ color: "#b91c1c", marginBottom: 8 }}>Something broke on this page.</h3>
          <div style={{ color: "#6b7280", fontSize: 14 }}>{this.state.message}</div>
        </div>
      );
    }
    return this.props.children;
  }
}
