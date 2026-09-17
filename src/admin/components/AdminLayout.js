import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiGrid,
  FiUser,
  FiFolder,
  FiBriefcase,
  FiBookOpen,
  FiCode,
  FiLayers,
  FiAward,
  FiFileText,
  FiMail,
  FiGlobe,
  FiLogOut,
  FiExternalLink,
  FiMenu,
  FiX,
} from "react-icons/fi";

const NAV_ITEMS = [
  { path: "/admin", label: "Dashboard", icon: FiGrid, exact: true },
  { path: "/admin/profile", label: "Profile & Hero", icon: FiUser },
  { path: "/admin/projects", label: "Projects", icon: FiFolder },
  { path: "/admin/experience", label: "Experience", icon: FiBriefcase },
  { path: "/admin/education", label: "Education", icon: FiBookOpen },
  { path: "/admin/skills", label: "Skills & Tools", icon: FiCode },
  { path: "/admin/services", label: "Services", icon: FiLayers },
  { path: "/admin/certifications", label: "Certifications", icon: FiAward },
  { path: "/admin/resume", label: "Resume", icon: FiFileText },
  { path: "/admin/contact", label: "Contact & Socials", icon: FiMail },
  { path: "/admin/seo", label: "SEO & Meta", icon: FiGlobe },
];

function AdminLayout({ children, pageTitle = "Dashboard" }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/admin");
  };

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="admin-wrapper">
      {/* Sidebar */}
      <aside
        className={`admin-sidebar ${mobileOpen ? "mobile-open" : ""}`}
        style={{
          display: mobileOpen || window.innerWidth > 768 ? "flex" : "none",
        }}
      >
        <div className="admin-sidebar-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <h2 className="admin-brand-title">Portfolio CMS</h2>
            <span className="admin-brand-badge">ADMIN</span>
          </div>
          <button
            className="d-md-none btn btn-sm btn-link text-white"
            onClick={() => setMobileOpen(false)}
            style={{ textDecoration: "none" }}
          >
            <FiX size={20} />
          </button>
        </div>

        <nav className="admin-sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`admin-nav-item ${active ? "active" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                <Icon style={{ fontSize: "1.1rem" }} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <span className="admin-user-email">{user?.email || "Admin"}</span>
            <span className="admin-user-role">Administrator</span>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-admin-outline w-50 d-flex align-items-center justify-content-center gap-1"
              title="Open Public Portfolio"
            >
              <FiExternalLink /> Live Site
            </a>
            <button
              onClick={handleLogout}
              className="btn btn-sm btn-admin-danger w-50 d-flex align-items-center justify-content-center gap-1"
              title="Sign Out"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button
              className="d-md-none btn btn-sm btn-admin-outline"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <FiMenu size={20} />
            </button>
            <h1 className="admin-page-title">{pageTitle}</h1>
          </div>
          <div>
            <span
              style={{
                fontSize: "0.85rem",
                color: "var(--admin-text-muted)",
              }}
            >
              Supabase RLS Protected
            </span>
          </div>
        </header>

        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
}

export default AdminLayout;
