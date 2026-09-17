import React from "react";
import { useAuth } from "../context/AuthContext";
import Login from "../pages/Login";
import AdminLayout from "./AdminLayout";
import { Spinner, Button } from "react-bootstrap";
import { FiShield, FiLogOut } from "react-icons/fi";

function ProtectedRoute({ children, title }) {
  const { user, isAdmin, loading, logout, isConfigured } = useAuth();

  if (loading) {
    return (
      <div
        className="admin-auth-container"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spinner animation="border" variant="primary" style={{ color: "#c770f0" }} />
        <p style={{ marginTop: "1rem", color: "#a39cb5" }}>
          Authenticating administrator session...
        </p>
      </div>
    );
  }

  // Not logged in -> Show Login view
  if (!user) {
    return <Login />;
  }

  // Logged in but not designated administrator -> Access Denied screen
  if (!isAdmin) {
    return (
      <div className="admin-auth-container">
        <div className="admin-auth-card text-center">
          <FiShield style={{ fontSize: "3.5rem", color: "#ff6b6b", marginBottom: "1rem" }} />
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff", marginBottom: "0.5rem" }}>
            Access Denied
          </h2>
          <p style={{ color: "#a39cb5", fontSize: "0.95rem" }}>
            The account <strong>{user.email}</strong> is authenticated, but is not listed in the portfolio's <code>admin_users</code> authorization table.
          </p>
          {!isConfigured && (
            <p style={{ color: "#fcc419", fontSize: "0.85rem" }}>
              Note: Supabase environment variables are missing or set to placeholder values.
            </p>
          )}
          <Button
            variant="danger"
            className="btn-admin-danger mt-3"
            onClick={() => logout()}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
          >
            <FiLogOut /> Sign Out
          </Button>
        </div>
      </div>
    );
  }

  // Authenticated administrator -> Render protected page inside AdminLayout
  return <AdminLayout pageTitle={title}>{children}</AdminLayout>;
}

export default ProtectedRoute;
