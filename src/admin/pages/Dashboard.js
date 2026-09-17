import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { supabase, isSupabaseConfigured } from "../../lib/supabaseClient";
import ToastAlert from "../components/ToastAlert";
import ConfirmModal from "../components/ConfirmModal";
import { seedPortfolioData } from "../../services/seedService";
import {
  FiFolder,
  FiAward,
  FiCode,
  FiLayers,
  FiBriefcase,
  FiBookOpen,
  FiFileText,
  FiUser,
  FiArrowRight,
  FiRefreshCw,
  FiDatabase,
} from "react-icons/fi";

function Dashboard() {
  const [counts, setCounts] = useState({
    projects: { total: 0, published: 0 },
    certifications: { total: 0, published: 0 },
    skills: { total: 0, published: 0 },
    services: { total: 0, published: 0 },
    experience: { total: 0, published: 0 },
    education: { total: 0, published: 0 },
  });
  const [resumeInfo, setResumeInfo] = useState(null);
  const [profileInfo, setProfileInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [showSeedConfirmModal, setShowSeedConfirmModal] = useState(false);
  const [feedback, setFeedback] = useState({ message: "", type: "success" });
  const [errorMsg, setErrorMsg] = useState("");

  const fetchDashboardData = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setErrorMsg("");

    try {
      // Parallel queries for all module counts
      const [
        projectsRes,
        certsRes,
        skillsRes,
        servicesRes,
        expRes,
        eduRes,
        resumeRes,
        profileRes,
      ] = await Promise.all([
        supabase.from("projects").select("id, is_published"),
        supabase.from("certifications").select("id, is_published"),
        supabase.from("skills").select("id, is_published"),
        supabase.from("services").select("id, is_published"),
        supabase.from("experience").select("id, is_published"),
        supabase.from("education").select("id, is_published"),
        supabase.from("resume").select("title, file_url, is_active, updated_at").order("created_at", { ascending: false }).limit(1).maybeSingle(),
        supabase.from("profile").select("full_name, is_published, updated_at").limit(1).maybeSingle(),
      ]);

      const computeCounts = (res) => {
        const items = res.data || [];
        return {
          total: items.length,
          published: items.filter((item) => item.is_published).length,
        };
      };

      setCounts({
        projects: computeCounts(projectsRes),
        certifications: computeCounts(certsRes),
        skills: computeCounts(skillsRes),
        services: computeCounts(servicesRes),
        experience: computeCounts(expRes),
        education: computeCounts(eduRes),
      });

      setResumeInfo(resumeRes.data || null);
      setProfileInfo(profileRes.data || null);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setErrorMsg(err.message || "Failed to load dashboard overview data.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await seedPortfolioData(supabase);
      setFeedback({
        message: `Successfully seeded portfolio! Populated profile, ${res.projects} projects, ${res.skills} skills, ${res.services} services, ${res.certifications} certifications, resume, contact & SEO settings.`,
        type: "success",
      });
      fetchDashboardData();
    } catch (err) {
      setFeedback({
        message: err.message || "Failed to seed portfolio data.",
        type: "error",
      });
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const statItems = [
    {
      title: "Projects",
      count: counts.projects.total,
      published: counts.projects.published,
      path: "/admin/projects",
      icon: FiFolder,
    },
    {
      title: "Certifications",
      count: counts.certifications.total,
      published: counts.certifications.published,
      path: "/admin/certifications",
      icon: FiAward,
    },
    {
      title: "Skills & Tools",
      count: counts.skills.total,
      published: counts.skills.published,
      path: "/admin/skills",
      icon: FiCode,
    },
    {
      title: "Services",
      count: counts.services.total,
      published: counts.services.published,
      path: "/admin/services",
      icon: FiLayers,
    },
    {
      title: "Experience",
      count: counts.experience.total,
      published: counts.experience.published,
      path: "/admin/experience",
      icon: FiBriefcase,
    },
    {
      title: "Education",
      count: counts.education.total,
      published: counts.education.published,
      path: "/admin/education",
      icon: FiBookOpen,
    },
  ];

  const isDatabaseEmpty =
    counts.projects.total === 0 &&
    counts.certifications.total === 0 &&
    counts.skills.total === 0;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>Content Overview</h2>
          <p style={{ color: "var(--admin-text-muted)", fontSize: "0.9rem", margin: 0 }}>
            Live status of your Supabase-powered portfolio modules
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          {isDatabaseEmpty ? (
            <Button
              variant="primary"
              className="btn-admin-primary d-flex align-items-center gap-2"
              onClick={handleSeed}
              disabled={seeding || loading}
            >
              {seeding ? (
                <>
                  <Spinner size="sm" animation="border" /> Seeding Data...
                </>
              ) : (
                <>
                  <FiDatabase /> Seed Initial Portfolio
                </>
              )}
            </Button>
          ) : (
            <Button
              variant="outline-secondary"
              className="btn-admin-outline d-flex align-items-center gap-2"
              onClick={() => setShowSeedConfirmModal(true)}
              disabled={seeding || loading}
              title="Reset or re-seed baseline portfolio data"
            >
              <FiDatabase /> Reset Defaults
            </Button>
          )}

          <Button
            variant="outline-secondary"
            className="btn-admin-outline d-flex align-items-center gap-1"
            onClick={fetchDashboardData}
            disabled={loading || seeding}
          >
            <FiRefreshCw className={loading ? "spin" : ""} /> Refresh
          </Button>
        </div>
      </div>

      <ToastAlert message={feedback.message} type={feedback.type} onClose={() => setFeedback({ message: "", type: "success" })} />
      <ToastAlert message={errorMsg} type="error" onClose={() => setErrorMsg("")} />

      <ConfirmModal
        show={showSeedConfirmModal}
        title="Reset Portfolio to Default Content?"
        message="Warning: This operation will upsert the baseline portfolio data (Profile, Projects, Skills, Services, and Certifications). Any custom edits to default records may be reset. Are you sure you want to proceed?"
        confirmLabel="Reset & Seed Data"
        confirmVariant="warning"
        loading={seeding}
        onConfirm={() => {
          setShowSeedConfirmModal(false);
          handleSeed();
        }}
        onCancel={() => setShowSeedConfirmModal(false)}
      />

      {isDatabaseEmpty && !loading && (
        <div
          className="p-4 mb-4"
          style={{
            background: "rgba(199, 112, 240, 0.08)",
            border: "1px solid rgba(199, 112, 240, 0.25)",
            borderRadius: "8px",
          }}
        >
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
            <div>
              <h5 style={{ fontWeight: 700, color: "var(--admin-accent)", margin: 0 }}>
                Initial Setup Required: Supabase Database Is Empty
              </h5>
              <p style={{ color: "var(--admin-text-muted)", fontSize: "0.85rem", margin: "0.3rem 0 0" }}>
                Populate all 11 Supabase tables with the complete portfolio baseline (Profile, Projects, Skills, Services, Certifications, Experience, Education, Resume, and SEO).
              </p>
            </div>
            <Button
              variant="primary"
              className="btn-admin-primary d-inline-flex align-items-center gap-2 text-nowrap"
              onClick={handleSeed}
              disabled={seeding}
            >
              {seeding ? <Spinner size="sm" animation="border" /> : <FiDatabase />} Populate Database Now
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" style={{ color: "#c770f0" }} />
          <p className="mt-2 text-muted">Querying database counts...</p>
        </div>
      ) : (
        <>
          {/* Stat Cards Grid */}
          <Row className="g-3 mb-4">
            {statItems.map((stat) => {
              const Icon = stat.icon;
              return (
                <Col key={stat.title} xs={12} sm={6} lg={4}>
                  <Link to={stat.path} style={{ textDecoration: "none" }}>
                    <div className="admin-stat-card">
                      <div>
                        <p className="admin-stat-val">{stat.count}</p>
                        <p className="admin-stat-label">{stat.title}</p>
                        <div style={{ marginTop: "0.35rem" }}>
                          <span className="admin-badge-published">
                            {stat.published} published
                          </span>
                        </div>
                      </div>
                      <Icon className="admin-stat-icon" />
                    </div>
                  </Link>
                </Col>
              );
            })}
          </Row>

          {/* Quick Overview Panels */}
          <Row className="g-3">
            <Col md={6}>
              <Card className="admin-card h-100">
                <Card.Header className="admin-card-header d-flex align-items-center justify-content-between">
                  <span className="d-flex align-items-center gap-2">
                    <FiUser style={{ color: "var(--admin-accent)" }} /> Profile Status
                  </span>
                  <Link to="/admin/profile" className="btn btn-sm btn-admin-outline d-flex align-items-center gap-1">
                    Edit Profile <FiArrowRight />
                  </Link>
                </Card.Header>
                <Card.Body>
                  <p style={{ margin: 0, fontSize: "0.95rem" }}>
                    <strong>Name:</strong> {profileInfo?.full_name || "Asad Sarwar (Default)"}
                  </p>
                  <p style={{ marginTop: "0.5rem", fontSize: "0.95rem" }}>
                    <strong>Status:</strong>{" "}
                    {profileInfo?.is_published !== false ? (
                      <span className="admin-badge-published">Published</span>
                    ) : (
                      <span className="admin-badge-draft">Hidden / Draft</span>
                    )}
                  </p>
                  {profileInfo?.updated_at && (
                    <small className="text-muted">
                      Last updated: {new Date(profileInfo.updated_at).toLocaleString()}
                    </small>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="admin-card h-100">
                <Card.Header className="admin-card-header d-flex align-items-center justify-content-between">
                  <span className="d-flex align-items-center gap-2">
                    <FiFileText style={{ color: "var(--admin-accent)" }} /> Active Resume
                  </span>
                  <Link to="/admin/resume" className="btn btn-sm btn-admin-outline d-flex align-items-center gap-1">
                    Manage Resume <FiArrowRight />
                  </Link>
                </Card.Header>
                <Card.Body>
                  <p style={{ margin: 0, fontSize: "0.95rem" }}>
                    <strong>Document:</strong> {resumeInfo?.title || "Asad_Resume.pdf"}
                  </p>
                  <p style={{ marginTop: "0.5rem", fontSize: "0.95rem" }}>
                    <strong>Status:</strong>{" "}
                    {resumeInfo?.is_active !== false ? (
                      <span className="admin-badge-published">Active for Download</span>
                    ) : (
                      <span className="admin-badge-draft">Inactive</span>
                    )}
                  </p>
                  {resumeInfo?.updated_at && (
                    <small className="text-muted">
                      Last updated: {new Date(resumeInfo.updated_at).toLocaleString()}
                    </small>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}

export default Dashboard;
