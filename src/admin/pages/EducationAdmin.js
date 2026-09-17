import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Modal, Form, Row, Col, Badge, Spinner } from "react-bootstrap";
import { supabase, isSupabaseConfigured } from "../../lib/supabaseClient";
import ToastAlert from "../components/ToastAlert";
import ConfirmModal from "../components/ConfirmModal";
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX } from "react-icons/fi";

const INITIAL_FORM = {
  institution: "",
  degree: "",
  field_of_study: "",
  location: "",
  start_date: "",
  end_date: "",
  is_current: false,
  grade_or_gpa: "",
  description: "",
  display_order: 0,
  is_published: true,
};

function EducationAdmin() {
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ message: "", type: "success" });

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchEducation = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("education")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEducations(data || []);
    } catch (err) {
      setFeedback({ message: err.message || "Failed to load education.", type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEducation();
  }, [fetchEducation]);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({ ...INITIAL_FORM, display_order: educations.length + 1 });
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      institution: item.institution || "",
      degree: item.degree || "",
      field_of_study: item.field_of_study || "",
      location: item.location || "",
      start_date: item.start_date || "",
      end_date: item.end_date || "",
      is_current: Boolean(item.is_current),
      grade_or_gpa: item.grade_or_gpa || "",
      description: item.description || "",
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
      institution: formData.institution.trim(),
      degree: formData.degree.trim(),
      field_of_study: formData.field_of_study.trim() || null,
      location: formData.location.trim() || null,
      start_date: formData.start_date || null,
      end_date: formData.is_current ? null : formData.end_date || null,
      is_current: formData.is_current,
      grade_or_gpa: formData.grade_or_gpa.trim() || null,
      description: formData.description.trim() || null,
      display_order: parseInt(formData.display_order, 10) || 0,
      is_published: formData.is_published,
    };

    try {
      if (editingItem) {
        const { error } = await supabase
          .from("education")
          .update(payload)
          .eq("id", editingItem.id);
        if (error) throw error;
        setFeedback({ message: "Education record updated.", type: "success" });
      } else {
        const { error } = await supabase.from("education").insert([payload]);
        if (error) throw error;
        setFeedback({ message: "Education record added.", type: "success" });
      }
      setModalOpen(false);
      fetchEducation();
    } catch (err) {
      setFeedback({ message: err.message || "Failed to save education.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (item) => {
    const nextStatus = !item.is_published;
    try {
      const { error } = await supabase
        .from("education")
        .update({ is_published: nextStatus })
        .eq("id", item.id);
      if (error) throw error;
      setEducations((prev) =>
        prev.map((e) => (e.id === item.id ? { ...e, is_published: nextStatus } : e))
      );
      setFeedback({
        message: `Education record ${nextStatus ? "published" : "hidden as draft"}.`,
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
      const { error } = await supabase.from("education").delete().eq("id", deleteTarget.id);
      if (error) throw error;
      setFeedback({ message: "Education record deleted.", type: "success" });
      setDeleteTarget(null);
      fetchEducation();
    } catch (err) {
      setFeedback({ message: err.message || "Failed to delete education.", type: "error" });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>Education & Academics</h2>
          <p style={{ color: "var(--admin-text-muted)", fontSize: "0.9rem", margin: 0 }}>
            Manage degrees, universities, fields of study, and qualifications
          </p>
        </div>
        <Button className="btn-admin-primary d-flex align-items-center gap-2" onClick={handleOpenCreate}>
          <FiPlus /> Add Education
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
          <p className="mt-2 text-muted">Loading education records...</p>
        </div>
      ) : educations.length === 0 ? (
        <div className="admin-card p-5 text-center">
          <p style={{ color: "var(--admin-text-muted)" }}>No education records found.</p>
          <Button className="btn-admin-primary" onClick={handleOpenCreate}>
            Add First Education
          </Button>
        </div>
      ) : (
        <div className="admin-card">
          <Table responsive hover className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "60px" }}>Order</th>
                <th>Degree</th>
                <th>Institution</th>
                <th>Field of Study</th>
                <th>Status</th>
                <th style={{ width: "130px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {educations.map((item) => (
                <tr key={item.id}>
                  <td>
                    <Badge bg="secondary" style={{ backgroundColor: "rgba(199, 112, 240, 0.2)", color: "#c770f0" }}>
                      #{item.display_order}
                    </Badge>
                  </td>
                  <td>
                    <strong>{item.degree}</strong>
                  </td>
                  <td>
                    {item.institution}
                    {item.location && <span className="text-muted small d-block">{item.location}</span>}
                  </td>
                  <td>{item.field_of_study || "—"}</td>
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
              {editingItem ? "Edit Education" : "Add Education"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="admin-form-label">Degree</Form.Label>
                  <Form.Control
                    type="text"
                    className="admin-input"
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    placeholder="e.g. Bachelor of Science (BS)"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="admin-form-label">Institution / University</Form.Label>
                  <Form.Control
                    type="text"
                    className="admin-input"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    placeholder="e.g. Sukkur IBA University"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="admin-form-label">Field of Study</Form.Label>
                  <Form.Control
                    type="text"
                    className="admin-input"
                    value={formData.field_of_study}
                    onChange={(e) => setFormData({ ...formData, field_of_study: e.target.value })}
                    placeholder="e.g. Software Engineering"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="admin-form-label">Location</Form.Label>
                  <Form.Control
                    type="text"
                    className="admin-input"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="admin-form-label">Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    className="admin-input"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="admin-form-label">End Date</Form.Label>
                  <Form.Control
                    type="date"
                    className="admin-input"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    disabled={formData.is_current}
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
                <Form.Check
                  type="switch"
                  id="edu-current-switch"
                  label="Currently enrolled"
                  checked={formData.is_current}
                  onChange={(e) => setFormData({ ...formData, is_current: e.target.checked })}
                />
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="admin-form-label">Grade / GPA (Optional)</Form.Label>
                  <Form.Control
                    type="text"
                    className="admin-input"
                    value={formData.grade_or_gpa}
                    onChange={(e) => setFormData({ ...formData, grade_or_gpa: e.target.value })}
                    placeholder="e.g. 3.8 / 4.0"
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="admin-form-label">Description / Highlights</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    className="admin-textarea"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Check
                  type="switch"
                  id="edu-published-switch"
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
              {saving ? "Saving..." : editingItem ? "Save Changes" : "Create Record"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <ConfirmModal
        show={Boolean(deleteTarget)}
        title="Delete Education Record"
        message={`Are you sure you want to delete "${deleteTarget?.degree} at ${deleteTarget?.institution}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}

export default EducationAdmin;
