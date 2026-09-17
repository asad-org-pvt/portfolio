import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { FiLock, FiArrowLeft } from "react-icons/fi";

function Login() {
  const { login, requestPasswordReset, isConfigured } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isResetView, setIsResetView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      await login(email.trim(), password);
    } catch (err) {
      setErrorMsg(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      await requestPasswordReset(email.trim());
      setSuccessMsg(
        "A password recovery link has been sent to your email. Please check your inbox."
      );
    } catch (err) {
      setErrorMsg(err.message || "Failed to initiate password reset.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-auth-container">
      <div className="admin-auth-card">
        <div className="text-center mb-4">
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "rgba(199, 112, 240, 0.15)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1rem",
              border: "1px solid rgba(199, 112, 240, 0.3)",
            }}
          >
            <FiLock style={{ fontSize: "1.6rem", color: "#c770f0" }} />
          </div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#fff", marginBottom: "0.25rem" }}>
            {isResetView ? "Reset Password" : "Portfolio CMS Admin"}
          </h1>
          <p style={{ color: "#a39cb5", fontSize: "0.9rem", margin: 0 }}>
            {isResetView
              ? "Enter your administrator email to receive a recovery link"
              : "Sign in to manage your portfolio content"}
          </p>
        </div>

        {!isConfigured && (
          <Alert variant="warning" style={{ fontSize: "0.85rem", borderRadius: "8px" }}>
            <strong>Notice:</strong> Supabase environment variables (<code>REACT_APP_SUPABASE_URL</code> and <code>REACT_APP_SUPABASE_ANON_KEY</code>) are not configured in your <code>.env</code> file.
          </Alert>
        )}

        {errorMsg && (
          <Alert variant="danger" style={{ fontSize: "0.85rem", borderRadius: "8px" }}>
            {errorMsg}
          </Alert>
        )}

        {successMsg && (
          <Alert variant="success" style={{ fontSize: "0.85rem", borderRadius: "8px" }}>
            {successMsg}
          </Alert>
        )}

        {isResetView ? (
          <Form onSubmit={handleResetSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="admin-form-label">Admin Email</Form.Label>
              <div style={{ position: "relative" }}>
                <Form.Control
                  type="email"
                  className="admin-input"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </Form.Group>

            <Button
              type="submit"
              className="btn-admin-primary w-100 mb-3"
              disabled={loading}
            >
              {loading ? "Sending Recovery Link..." : "Send Recovery Email"}
            </Button>

            <div className="text-center">
              <Button
                variant="link"
                className="text-muted"
                style={{ fontSize: "0.85rem", textDecoration: "none" }}
                onClick={() => {
                  setIsResetView(false);
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
              >
                <FiArrowLeft /> Back to Sign In
              </Button>
            </div>
          </Form>
        ) : (
          <Form onSubmit={handleLoginSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="admin-form-label">Email Identifier</Form.Label>
              <Form.Control
                type="email"
                className="admin-input"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Form.Label className="admin-form-label">Password</Form.Label>
                <Button
                  variant="link"
                  className="p-0 text-muted"
                  style={{ fontSize: "0.8rem", textDecoration: "none", color: "#c770f0" }}
                  onClick={() => {
                    setIsResetView(true);
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                >
                  Forgot password?
                </Button>
              </div>
              <Form.Control
                type="password"
                className="admin-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </Form.Group>

            <Button
              type="submit"
              className="btn-admin-primary w-100"
              disabled={loading}
              style={{ fontSize: "1rem" }}
            >
              {loading ? "Signing In..." : "Sign In to Admin"}
            </Button>
          </Form>
        )}
      </div>
    </div>
  );
}

export default Login;
