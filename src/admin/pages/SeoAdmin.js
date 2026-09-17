import React, { useState, useEffect, useCallback } from "react";
import { Form, Button, Card, Row, Col, Spinner } from "react-bootstrap";
import { supabase, isSupabaseConfigured } from "../../lib/supabaseClient";
import ToastAlert from "../components/ToastAlert";
import { FiSave, FiGlobe } from "react-icons/fi";

const ROUTE_OPTIONS = [
  { value: "global", label: "Global Defaults" },
  { value: "/", label: "Home Page (/)" },
  { value: "/about", label: "About Page (/about)" },
  { value: "/project", label: "Projects Page (/project)" },
  { value: "/services", label: "Services Page (/services)" },
  { value: "/certificates", label: "Certificates Page (/certificates)" },
  { value: "/resume", label: "Resume Page (/resume)" },
  { value: "/contact", label: "Contact Page (/contact)" },
];

const INITIAL_FORM = {
  title: "Asad Sarwar | Portfolio",
  meta_description: "Personal developer portfolio of Asad Sarwar, Software Engineer specializing in React, Node.js, and Mobile App Development.",
  keywords: "software engineer, react developer, full stack developer, asad sarwar, portfolio",
  og_title: "",
  og_description: "",
  og_image_url: "",
  twitter_card: "summary_large_image",
  canonical_url: "https://asadsarwar.com",
};

function SeoAdmin() {
  const [selectedRoute, setSelectedRoute] = useState("global");
  const [recordId, setRecordId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ message: "", type: "success" });

  const fetchSeoSettings = useCallback(async (route) => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setFeedback({ message: "", type: "success" });

    try {
      const { data, error } = await supabase
        .from("seo_settings")
        .select("*")
        .eq("page_route", route)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setRecordId(data.id);
        setFormData({
          title: data.title || "",
          meta_description: data.meta_description || "",
          keywords: data.keywords || "",
          og_title: data.og_title || "",
          og_description: data.og_description || "",
          og_image_url: data.og_image_url || "",
          twitter_card: data.twitter_card || "summary_large_image",
          canonical_url: data.canonical_url || "",
        });
      } else {
        setRecordId(null);
        setFormData({
          ...INITIAL_FORM,
          title: `${selectedRoute.replace("/", "").toUpperCase() || "Home"} | Asad Sarwar`,
        });
      }
    } catch (err) {
      setFeedback({ message: err.message || "Failed to load SEO settings.", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [selectedRoute]);

  useEffect(() => {
    fetchSeoSettings(selectedRoute);
  }, [selectedRoute, fetchSeoSettings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback({ message: "", type: "success" });

    const payload = {
      page_route: selectedRoute,
      title: formData.title.trim(),
      meta_description: formData.meta_description.trim(),
      keywords: formData.keywords.trim() || null,
      og_title: formData.og_title.trim() || null,
      og_description: formData.og_description.trim() || null,
      og_image_url: formData.og_image_url.trim() || null,
      twitter_card: formData.twitter_card || "summary_large_image",
      canonical_url: formData.canonical_url.trim() || null,
    };

    try {
      if (recordId) {
        const { error } = await supabase
          .from("seo_settings")
          .update(payload)
          .eq("id", recordId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("seo_settings")
          .insert([payload])
          .select()
          .single();
        if (error) throw error;
        setRecordId(data.id);
      }
      setFeedback({ message: `SEO settings for "${selectedRoute}" saved successfully!`, type: "success" });
    } catch (err) {
      setFeedback({ message: err.message || "Failed to save SEO settings.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>SEO & Meta Management</h2>
          <p style={{ color: "var(--admin-text-muted)", fontSize: "0.9rem", margin: 0 }}>
            Configure page titles, meta descriptions, and OpenGraph social sharing tags
          </p>
        </div>
      </div>

      <ToastAlert
        message={feedback.message}
        type={feedback.type}
        onClose={() => setFeedback({ message: "", type: "success" })}
      />

      {/* Target Route Selector */}
      <Card className="admin-card mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={3}>
              <Form.Label className="admin-form-label" style={{ margin: 0 }}>
                Select Page / Route:
              </Form.Label>
            </Col>
            <Col md={6}>
              <Form.Select
                className="admin-select"
                value={selectedRoute}
                onChange={(e) => setSelectedRoute(e.target.value)}
              >
                {ROUTE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" style={{ color: "#c770f0" }} />
          <p className="mt-2 text-muted">Loading settings for {selectedRoute}...</p>
        </div>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Card className="admin-card mb-4">
            <Card.Header className="admin-card-header d-flex align-items-center gap-2">
              <FiGlobe style={{ color: "var(--admin-accent)" }} /> Metadata for <code>{selectedRoute}</code>
            </Card.Header>
            <Card.Body>
              <Row className="g-3">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label className="admin-form-label">Page Title (&lt;title&gt;)</Form.Label>
                    <Form.Control
                      type="text"
                      className="admin-input"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group>
                    <Form.Label className="admin-form-label">Meta Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      className="admin-textarea"
                      value={formData.meta_description}
                      onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group>
                    <Form.Label className="admin-form-label">Keywords (Comma-separated)</Form.Label>
                    <Form.Control
                      type="text"
                      className="admin-input"
                      value={formData.keywords}
                      onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="admin-form-label">OpenGraph Title (Optional)</Form.Label>
                    <Form.Control
                      type="text"
                      className="admin-input"
                      value={formData.og_title}
                      onChange={(e) => setFormData({ ...formData, og_title: e.target.value })}
                      placeholder="Defaults to page title if blank"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="admin-form-label">Canonical URL</Form.Label>
                    <Form.Control
                      type="url"
                      className="admin-input"
                      value={formData.canonical_url}
                      onChange={(e) => setFormData({ ...formData, canonical_url: e.target.value })}
                      placeholder="https://yourdomain.com"
                    />
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group>
                    <Form.Label className="admin-form-label">OpenGraph Description (Optional)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      className="admin-textarea"
                      value={formData.og_description}
                      onChange={(e) => setFormData({ ...formData, og_description: e.target.value })}
                      placeholder="Defaults to meta description if blank"
                    />
                  </Form.Group>
                </Col>

                <Col md={8}>
                  <Form.Group>
                    <Form.Label className="admin-form-label">OpenGraph Social Share Image URL</Form.Label>
                    <Form.Control
                      type="text"
                      className="admin-input"
                      value={formData.og_image_url}
                      onChange={(e) => setFormData({ ...formData, og_image_url: e.target.value })}
                      placeholder="https://.../preview.png"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="admin-form-label">Twitter Card Type</Form.Label>
                    <Form.Select
                      className="admin-select"
                      value={formData.twitter_card}
                      onChange={(e) => setFormData({ ...formData, twitter_card: e.target.value })}
                    >
                      <option value="summary_large_image">summary_large_image</option>
                      <option value="summary">summary</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button type="submit" className="btn-admin-primary d-flex align-items-center gap-2" disabled={saving}>
              <FiSave /> {saving ? "Saving..." : `Save SEO for ${selectedRoute}`}
            </Button>
          </div>
        </Form>
      )}
    </div>
  );
}

export default SeoAdmin;
