import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiKey, FiCheckCircle } from "react-icons/fi";

function ResetPassword() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (newPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await updatePassword(newPassword);
      setSuccess(true);
    } catch (err) {
      setErrorMsg(err.message || "Failed to update password. Recovery link may have expired.");
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
            <FiKey style={{ fontSize: "1.6rem", color: "#c770f0" }} />
          </div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#fff", marginBottom: "0.25rem" }}>
            Set New Password
          </h1>
          <p style={{ color: "#a39cb5", fontSize: "0.9rem", margin: 0 }}>
            Enter your new administrator account password
          </p>
        </div>

        {errorMsg && (
          <Alert variant="danger" style={{ fontSize: "0.85rem", borderRadius: "8px" }}>
            {errorMsg}
          </Alert>
        )}

        {success ? (
          <div className="text-center">
            <Alert variant="success" style={{ fontSize: "0.95rem", borderRadius: "8px" }}>
              <FiCheckCircle style={{ marginRight: "0.5rem" }} />
              Password updated successfully!
            </Alert>
            <Button
              className="btn-admin-primary w-100 mt-3"
              onClick={() => navigate("/admin")}
            >
              Go to Admin Dashboard
            </Button>
          </div>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="admin-form-label">New Password</Form.Label>
              <Form.Control
                type="password"
                className="admin-input"
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="admin-form-label">Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                className="admin-input"
                placeholder="Repeat new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </Form.Group>

            <Button
              type="submit"
              className="btn-admin-primary w-100"
              disabled={loading}
            >
              {loading ? "Updating Password..." : "Update Password"}
            </Button>
          </Form>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
