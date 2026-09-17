import React, { useState, useEffect } from "react";
import { Form, Button, Card, Row, Col, Spinner } from "react-bootstrap";
import { supabase, isSupabaseConfigured } from "../../lib/supabaseClient";
import ToastAlert from "../components/ToastAlert";
import FileUpload from "../components/FileUpload";
import { FiSave, FiFileText } from "react-icons/fi";

function ResumeAdmin() {
  const [resumeId, setResumeId] = useState(null);
  const [formData, setFormData] = useState({
    title: "Asad_Resume.pdf",
    file_url: "",
    version_label: "v1.0",
    is_active: true,
  });
  const [updatedAt, setUpdatedAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ message: "", type: "success" });

  useEffect(() => {
    let isMounted = true;
    async function loadResume() {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from("resume")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) throw error;

        if (data && isMounted) {
          setResumeId(data.id);
          setFormData({
            title: data.title || "Asad_Resume.pdf",
            file_url: data.file_url || "",
            version_label: data.version_label || "",
            is_active: data.is_active !== false,
          });
          setUpdatedAt(data.updated_at || null);
        }
      } catch (err) {
        setFeedback({ message: err.message || "Failed to load resume info.", type: "error" });
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadResume();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback({ message: "", type: "success" });

    const payload = {
      title: formData.title.trim(),
      file_url: formData.file_url.trim(),
      version_label: formData.version_label.trim() || null,
      is_active: formData.is_active,
    };

    try {
      if (resumeId) {
        const { error } = await supabase
          .from("resume")
          .update(payload)
          .eq("id", resumeId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("resume")
          .insert([payload])
          .select()
          .single();
        if (error) throw error;
        setResumeId(data.id);
      }
      setUpdatedAt(new Date().toISOString());
      setFeedback({ message: "Resume configuration saved successfully!", type: "success" });
    } catch (err) {
      setFeedback({ message: err.message || "Failed to save resume.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" style={{ color: "#c770f0" }} />
        <p className="mt-2 text-muted">Loading resume configuration...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>Resume Management</h2>
          <p style={{ color: "var(--admin-text-muted)", fontSize: "0.9rem", margin: 0 }}>
            Configure active CV document download link, title, and versioning
          </p>
        </div>
      </div>

      <ToastAlert
        message={feedback.message}
        type={feedback.type}
        onClose={() => setFeedback({ message: "", type: "success" })}
      />

      <Form onSubmit={handleSubmit}>
        <Card className="admin-card mb-4">
          <Card.Header className="admin-card-header d-flex align-items-center justify-content-between">
            <span className="d-flex align-items-center gap-2">
              <FiFileText style={{ color: "var(--admin-accent)" }} /> CV Document Details
            </span>
            {updatedAt && (
              <small className="text-muted">
                Last modified: {new Date(updatedAt).toLocaleString()}
              </small>
            )}
          </Card.Header>
          <Card.Body>
            <Row className="g-3">
              <Col md={8}>
                <Form.Group>
                  <Form.Label className="admin-form-label">Resume Document Title</Form.Label>
                  <Form.Control
                    type="text"
                    className="admin-input"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="admin-form-label">Version Label</Form.Label>
                  <Form.Control
                    type="text"
                    className="admin-input"
                    value={formData.version_label}
                    onChange={(e) => setFormData({ ...formData, version_label: e.target.value })}
                    placeholder="e.g. 2026.1"
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <FileUpload
                  bucket="resumes"
                  folder="documents"
                  entityId={resumeId || "active"}
                  accept="application/pdf,.pdf"
                  isPdf={true}
                  currentUrl={formData.file_url}
                  label="Resume PDF Document"
                  helperText="Upload official CV document in PDF format (max 10MB). Stored in Supabase 'resumes' bucket."
                  onUploadSuccess={(url) => setFormData((prev) => ({ ...prev, file_url: url }))}
                  onClear={() => setFormData((prev) => ({ ...prev, file_url: "" }))}
                />
              </Col>

              <Col md={12}>
                <Form.Check
                  type="switch"
                  id="resume-active-switch"
                  label="Active (Available for Download on Resume Page)"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  style={{ fontWeight: 600 }}
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type="submit" className="btn-admin-primary d-flex align-items-center gap-2" disabled={saving}>
            <FiSave /> {saving ? "Saving Changes..." : "Save Resume Configuration"}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default ResumeAdmin;
