import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Modal, Form, Row, Col, Badge, Spinner } from "react-bootstrap";
import { supabase, isSupabaseConfigured } from "../../lib/supabaseClient";
import ToastAlert from "../components/ToastAlert";
import ConfirmModal from "../components/ConfirmModal";
import FileUpload from "../components/FileUpload";
import { FiPlus, FiEdit2, FiTrash2, FiExternalLink, FiCheck, FiX } from "react-icons/fi";

const INITIAL_FORM = {
  title: "",
  issuer: "",
  issue_date: "",
  description: "",
  credential_url: "",
  credential_id: "",
  thumbnail_url: "",
  file_url: "",
  is_pdf: false,
  display_order: 0,
  is_published: true,
};

function CertificationsAdmin() {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ message: "", type: "success" });

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCertifications = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("certifications")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCertifications(data || []);
    } catch (err) {
      setFeedback({ message: err.message || "Failed to load certifications.", type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCertifications();
  }, [fetchCertifications]);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({ ...INITIAL_FORM, display_order: certifications.length + 1 });
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || "",
      issuer: item.issuer || "",
      issue_date: item.issue_date || "",
      description: item.description || "",
      credential_url: item.credential_url || "",
      credential_id: item.credential_id || "",
      thumbnail_url: item.thumbnail_url || "",
      file_url: item.file_url || "",
      is_pdf: Boolean(item.is_pdf),
      display_order: item.display_order ?? 0,
      is_published: item.is_published !== false,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback({ message: "", type: "success" });

    const payload = {
      title: formData.title.trim(),
      issuer: formData.issuer.trim(),
      issue_date: formData.issue_date || null,
      description: formData.description.trim(),
      credential_url: formData.credential_url.trim() || null,
      credential_id: formData.credential_id.trim() || null,
      thumbnail_url: formData.thumbnail_url.trim() || null,
      file_url: formData.file_url.trim() || null,
      is_pdf: formData.is_pdf,
      display_order: parseInt(formData.display_order, 10) || 0,
      is_published: formData.is_published,
    };

    try {
      if (editingItem) {
        const { error } = await supabase
          .from("certifications")
          .update(payload)
          .eq("id", editingItem.id);
        if (error) throw error;
        setFeedback({ message: "Certification updated.", type: "success" });
      } else {
        const { error } = await supabase.from("certifications").insert([payload]);
        if (error) throw error;
        setFeedback({ message: "Certification created.", type: "success" });
      }
      setModalOpen(false);
      fetchCertifications();
    } catch (err) {
      setFeedback({ message: err.message || "Failed to save certification.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (item) => {
    const nextStatus = !item.is_published;
    try {
      const { error } = await supabase
        .from("certifications")
        .update({ is_published: nextStatus })
        .eq("id", item.id);
      if (error) throw error;
      setCertifications((prev) =>
        prev.map((c) => (c.id === item.id ? { ...c, is_published: nextStatus } : c))
      );
      setFeedback({
        message: `Certification ${nextStatus ? "published" : "hidden as draft"}.`,
        type: "success",
      });
    } catch (err) {
      setFeedback({ message: err.message || "Failed to toggle status.", type: "error" });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const { error } = await supabase.from("certifications").delete().eq("id", deleteTarget.id);
      if (error) throw error;
      setFeedback({ message: "Certification deleted.", type: "success" });
      setDeleteTarget(null);
      fetchCertifications();
    } catch (err) {
      setFeedback({ message: err.message || "Failed to delete certification.", type: "error" });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>Certifications</h2>
          <p style={{ color: "var(--admin-text-muted)", fontSize: "0.9rem", margin: 0 }}>
            Manage verified certificates, issuers, verification links, and preview media
          </p>
        </div>
        <Button className="btn-admin-primary d-flex align-items-center gap-2" onClick={handleOpenCreate}>
          <FiPlus /> New Certificate
        </Button>
      </div>

      <ToastAlert
        message={feedback.message}
        type={feedback.type}
        onClose={() => setFeedback({ message: "", type: "success" })}
      />

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" style={{ color: "#c770f0" }} />
          <p className="mt-2 text-muted">Loading certifications...</p>
        </div>
      ) : certifications.length === 0 ? (
        <div className="admin-card p-5 text-center">
          <p style={{ color: "var(--admin-text-muted)" }}>No certifications found.</p>
          <Button className="btn-admin-primary" onClick={handleOpenCreate}>
            Add First Certificate
          </Button>
        </div>
      ) : (
        <div className="admin-card">
          <Table responsive hover className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "60px" }}>Order</th>
                <th>Certificate Title</th>
                <th>Issuer</th>
                <th>Credential Link</th>
                <th>Media Type</th>
                <th>Status</th>
                <th style={{ width: "130px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {certifications.map((item) => (
                <tr key={item.id}>
                  <td>
                    <Badge bg="secondary" style={{ backgroundColor: "rgba(199, 112, 240, 0.2)", color: "#c770f0" }}>
                      #{item.display_order}
                    </Badge>
                  </td>
                  <td>
                    <strong>{item.title}</strong>
                  </td>
                  <td>{item.issuer}</td>
                  <td>
                    {item.credential_url ? (
                      <a
                        href={item.credential_url}
                        target="_blank"
                        rel="noreferrer"
                        className="badge bg-dark text-info text-decoration-none d-flex align-items-center gap-1"
                        style={{ width: "fit-content" }}
                      >
                        Verify <FiExternalLink size={11} />
                      </a>
                    ) : (
                      <span className="text-muted small">—</span>
                    )}
                  </td>
                  <td>
                    <Badge bg={item.is_pdf ? "danger" : "secondary"}>
                      {item.is_pdf ? "PDF Doc" : "Image Thumbnail"}
                    </Badge>
                  </td>
                  <td>
                    <button
                      onClick={() => handleTogglePublish(item)}
                      className={item.is_published ? "admin-badge-published" : "admin-badge-draft"}
                      style={{ border: "none", cursor: "pointer" }}
                    >
                      {item.is_published ? <FiCheck size={12} /> : <FiX size={12} />}{" "}
                      {item.is_published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <Button variant="link" className="p-1 text-light" onClick={() => handleOpenEdit(item)}>
                      <FiEdit2 size={16} />
                    </Button>
                    <Button variant="link" className="p-1 text-danger" onClick={() => setDeleteTarget(item)}>
                      <FiTrash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Modal Form */}
      <Modal show={modalOpen} onHide={() => setModalOpen(false)} size="lg" centered className="admin-modal">
        <Form onSubmit={handleSave}>
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: "1.15rem", fontWeight: 700 }}>
              {editingItem ? "Edit Certification" : "New Certification"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="g-3">
              <Col md={8}>
                <Form.Group>
                  <Form.Label className="admin-form-label">Certificate Title</Form.Label>
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
                  <Form.Label className="admin-form-label">Display Order</Form.Label>
                  <Form.Control
                    type="number"
                    className="admin-input"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="admin-form-label">Issuing Organization</Form.Label>
                  <Form.Control
                    type="text"
                    className="admin-input"
                    value={formData.issuer}
                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                    placeholder="e.g. HackerRank, Google, AWS"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="admin-form-label">Issue Date</Form.Label>
                  <Form.Control
                    type="date"
                    className="admin-input"
                    value={formData.issue_date}
                    onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="admin-form-label">Description / Summary</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    className="admin-textarea"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="admin-form-label">Verification Link (Credential URL)</Form.Label>
                  <Form.Control
                    type="url"
                    className="admin-input"
                    value={formData.credential_url}
                    onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
                    placeholder="https://..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="admin-form-label">Credential ID (Optional)</Form.Label>
                  <Form.Control
                    type="text"
                    className="admin-input"
                    value={formData.credential_id}
                    onChange={(e) => setFormData({ ...formData, credential_id: e.target.value })}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <FileUpload
                  bucket="certifications"
                  folder="thumbnails"
                  entityId={editingItem?.id || "thumb"}
                  accept="image/png,image/jpeg,image/webp"
                  currentUrl={formData.thumbnail_url}
                  label="Certificate Thumbnail Image"
                  helperText="Upload JPG, PNG, or WebP thumbnail for the certificate grid."
                  onUploadSuccess={(url) => setFormData((prev) => ({ ...prev, thumbnail_url: url }))}
                  onClear={() => setFormData((prev) => ({ ...prev, thumbnail_url: "" }))}
                />
              </Col>
              <Col md={6}>
                <FileUpload
                  bucket="certifications"
                  folder="documents"
                  entityId={editingItem?.id || "doc"}
                  accept="application/pdf,image/png,image/jpeg,image/webp"
                  currentUrl={formData.file_url}
                  label="Certificate Document / Original PDF"
                  helperText="Upload PDF or high-res credential file (max 15MB)."
                  isPdf={formData.is_pdf || (formData.file_url && formData.file_url.endsWith(".pdf"))}
                  onUploadSuccess={(url) =>
                    setFormData((prev) => ({
                      ...prev,
                      file_url: url,
                      is_pdf: url.endsWith(".pdf") || prev.is_pdf,
                    }))
                  }
                  onClear={() => setFormData((prev) => ({ ...prev, file_url: "" }))}
                />
              </Col>

              <Col md={6}>
                <Form.Check
                  type="switch"
                  id="cert-pdf-switch"
                  label="Rendered via PDF Canvas (is_pdf)"
                  checked={formData.is_pdf}
                  onChange={(e) => setFormData({ ...formData, is_pdf: e.target.checked })}
                />
              </Col>
              <Col md={6}>
                <Form.Check
                  type="switch"
                  id="cert-published-switch"
                  label="Published on Public Website"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                />
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" className="btn-admin-outline" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" className="btn-admin-primary" disabled={saving}>
              {saving ? "Saving..." : editingItem ? "Save Changes" : "Create Certificate"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <ConfirmModal
        show={Boolean(deleteTarget)}
        title="Delete Certification"
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}

export default CertificationsAdmin;
