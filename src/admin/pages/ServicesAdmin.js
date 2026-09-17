import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Modal, Form, Row, Col, Badge, Spinner } from "react-bootstrap";
import { supabase, isSupabaseConfigured } from "../../lib/supabaseClient";
import ToastAlert from "../components/ToastAlert";
import ConfirmModal from "../components/ConfirmModal";
import FileUpload from "../components/FileUpload";
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX } from "react-icons/fi";

const INITIAL_FORM = {
  title: "",
  description: "",
  icon_url: "",
  cta_label: "Contact Us",
  cta_link: "/contact",
  display_order: 0,
  is_published: true,
};

function ServicesAdmin() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ message: "", type: "success" });

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchServices = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (err) {
      setFeedback({ message: err.message || "Failed to load services.", type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({ ...INITIAL_FORM, display_order: services.length + 1 });
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || "",
      description: item.description || "",
      icon_url: item.icon_url || "",
      cta_label: item.cta_label || "Contact Us",
      cta_link: item.cta_link || "/contact",
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
      description: formData.description.trim(),
      icon_url: formData.icon_url.trim() || null,
      cta_label: formData.cta_label.trim() || "Contact Us",
      cta_link: formData.cta_link.trim() || "/contact",
      display_order: parseInt(formData.display_order, 10) || 0,
      is_published: formData.is_published,
    };

    try {
      if (editingItem) {
        const { error } = await supabase.from("services").update(payload).eq("id", editingItem.id);
        if (error) throw error;
        setFeedback({ message: "Service updated successfully.", type: "success" });
      } else {
        const { error } = await supabase.from("services").insert([payload]);
        if (error) throw error;
        setFeedback({ message: "Service created successfully.", type: "success" });
      }
      setModalOpen(false);
      fetchServices();
    } catch (err) {
      setFeedback({ message: err.message || "Failed to save service.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (item) => {
    const nextStatus = !item.is_published;
    try {
      const { error } = await supabase
        .from("services")
        .update({ is_published: nextStatus })
        .eq("id", item.id);
      if (error) throw error;
      setServices((prev) =>
        prev.map((s) => (s.id === item.id ? { ...s, is_published: nextStatus } : s))
      );
      setFeedback({
        message: `Service ${nextStatus ? "published" : "hidden as draft"}.`,
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
      const { error } = await supabase.from("services").delete().eq("id", deleteTarget.id);
      if (error) throw error;
      setFeedback({ message: "Service deleted.", type: "success" });
      setDeleteTarget(null);
      fetchServices();
    } catch (err) {
      setFeedback({ message: err.message || "Failed to delete service.", type: "error" });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>Freelance Services</h2>
          <p style={{ color: "var(--admin-text-muted)", fontSize: "0.9rem", margin: 0 }}>
            Manage service offerings displayed on the Services page
          </p>
        </div>
        <Button className="btn-admin-primary d-flex align-items-center gap-2" onClick={handleOpenCreate}>
          <FiPlus /> New Service
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
          <p className="mt-2 text-muted">Loading services...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="admin-card p-5 text-center">
          <p style={{ color: "var(--admin-text-muted)" }}>No services found.</p>
          <Button className="btn-admin-primary" onClick={handleOpenCreate}>
            Add First Service
          </Button>
        </div>
      ) : (
        <div className="admin-card">
          <Table responsive hover className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "60px" }}>Order</th>
                <th>Service Title</th>
                <th>Description</th>
                <th>Icon Reference</th>
                <th>Status</th>
                <th style={{ width: "130px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((item) => (
                <tr key={item.id}>
                  <td>
                    <Badge bg="secondary" style={{ backgroundColor: "rgba(199, 112, 240, 0.2)", color: "#c770f0" }}>
                      #{item.display_order}
                    </Badge>
                  </td>
                  <td>
                    <strong>{item.title}</strong>
                  </td>
                  <td>
                    <div
                      style={{
                        maxWidth: "320px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        color: "var(--admin-text-muted)",
                      }}
                      title={item.description}
                    >
                      {item.description}
                    </div>
                  </td>
                  <td>
                    <span className="small text-muted">{item.icon_url || "Default"}</span>
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
              {editingItem ? "Edit Service" : "New Service"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="g-3">
              <Col md={8}>
                <Form.Group>
                  <Form.Label className="admin-form-label">Service Title</Form.Label>
                  <Form.Control
                    type="text"
                    className="admin-input"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Frontend Development"
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

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="admin-form-label">Description</Form.Label>
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

              <Col md={12}>
                <FileUpload
                  bucket="profile"
                  folder="services"
                  entityId={editingItem?.id || "service"}
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  currentUrl={formData.icon_url}
                  label="Service Icon Image"
                  helperText="Upload service icon (PNG, WebP, SVG, JPG)."
                  onUploadSuccess={(url) => setFormData((prev) => ({ ...prev, icon_url: url }))}
                  onClear={() => setFormData((prev) => ({ ...prev, icon_url: "" }))}
                />
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="admin-form-label">CTA Button Text</Form.Label>
                  <Form.Control
                    type="text"
                    className="admin-input"
                    value={formData.cta_label}
                    onChange={(e) => setFormData({ ...formData, cta_label: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="admin-form-label">CTA Link</Form.Label>
                  <Form.Control
                    type="text"
                    className="admin-input"
                    value={formData.cta_link}
                    onChange={(e) => setFormData({ ...formData, cta_link: e.target.value })}
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Check
                  type="switch"
                  id="srv-published-switch"
                  label="Published (Visible on Services Page)"
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
              {saving ? "Saving..." : editingItem ? "Save Changes" : "Create Service"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <ConfirmModal
        show={Boolean(deleteTarget)}
        title="Delete Service"
        message={`Are you sure you want to delete the service "${deleteTarget?.title}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}

export default ServicesAdmin;
