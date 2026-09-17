import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Modal, Form, Row, Col, Badge, Spinner, Nav } from "react-bootstrap";
import { supabase, isSupabaseConfigured } from "../../lib/supabaseClient";
import ToastAlert from "../components/ToastAlert";
import ConfirmModal from "../components/ConfirmModal";
import { FiPlus, FiEdit2, FiTrash2, FiCheck, FiX } from "react-icons/fi";

const INITIAL_FORM = {
  name: "",
  category: "technical",
  icon_name: "",
  icon_package: "react-icons",
  icon_url: "",
  proficiency_level: "",
  display_order: 0,
  is_published: true,
};

function SkillsAdmin() {
  const [skills, setSkills] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ message: "", type: "success" });

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchSkills = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("skills")
        .select("*")
        .order("category", { ascending: true })
        .order("display_order", { ascending: true });

      if (error) throw error;
      setSkills(data || []);
    } catch (err) {
      setFeedback({ message: err.message || "Failed to load skills.", type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const filteredSkills =
    activeCategory === "all"
      ? skills
      : skills.filter((s) => s.category === activeCategory);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      ...INITIAL_FORM,
      category: activeCategory === "all" ? "technical" : activeCategory,
      display_order: filteredSkills.length + 1,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || "",
      category: item.category || "technical",
      icon_name: item.icon_name || "",
      icon_package: item.icon_package || "react-icons",
      icon_url: item.icon_url || "",
      proficiency_level: item.proficiency_level ?? "",
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
      name: formData.name.trim(),
      category: formData.category,
      icon_name: formData.icon_name.trim() || null,
      icon_package: formData.icon_package.trim() || "react-icons",
      icon_url: formData.icon_url.trim() || null,
      proficiency_level: formData.proficiency_level ? parseInt(formData.proficiency_level, 10) : null,
      display_order: parseInt(formData.display_order, 10) || 0,
      is_published: formData.is_published,
    };

    try {
      if (editingItem) {
        const { error } = await supabase.from("skills").update(payload).eq("id", editingItem.id);
        if (error) throw error;
        setFeedback({ message: "Skill updated successfully.", type: "success" });
      } else {
        const { error } = await supabase.from("skills").insert([payload]);
        if (error) throw error;
        setFeedback({ message: "Skill created successfully.", type: "success" });
      }
      setModalOpen(false);
      fetchSkills();
    } catch (err) {
      setFeedback({ message: err.message || "Failed to save skill.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (item) => {
    const nextStatus = !item.is_published;
    try {
      const { error } = await supabase.from("skills").update({ is_published: nextStatus }).eq("id", item.id);
      if (error) throw error;
      setSkills((prev) =>
        prev.map((s) => (s.id === item.id ? { ...s, is_published: nextStatus } : s))
      );
      setFeedback({
        message: `Skill ${nextStatus ? "published" : "hidden"}.`,
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
      const { error } = await supabase.from("skills").delete().eq("id", deleteTarget.id);
      if (error) throw error;
      setFeedback({ message: "Skill deleted.", type: "success" });
      setDeleteTarget(null);
      fetchSkills();
    } catch (err) {
      setFeedback({ message: err.message || "Failed to delete skill.", type: "error" });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>Skills & Tools</h2>
          <p style={{ color: "var(--admin-text-muted)", fontSize: "0.9rem", margin: 0 }}>
            Manage technical competencies, developer tools, and service skills
          </p>
        </div>
        <Button className="btn-admin-primary d-flex align-items-center gap-2" onClick={handleOpenCreate}>
          <FiPlus /> New Skill
        </Button>
      </div>

      <ToastAlert
        message={feedback.message}
        type={feedback.type}
        onClose={() => setFeedback({ message: "", type: "success" })}
      />

      {/* Category Tabs */}
      <Nav
        variant="pills"
        activeKey={activeCategory}
        onSelect={(k) => setActiveCategory(k)}
        className="mb-3"
      >
        <Nav.Item>
          <Nav.Link eventKey="all" className={activeCategory === "all" ? "btn-admin-primary" : "text-light"}>
            All ({skills.length})
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="technical" className={activeCategory === "technical" ? "btn-admin-primary" : "text-light"}>
            Technical ({skills.filter((s) => s.category === "technical").length})
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="tool" className={activeCategory === "tool" ? "btn-admin-primary" : "text-light"}>
            Tools ({skills.filter((s) => s.category === "tool").length})
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="service" className={activeCategory === "service" ? "btn-admin-primary" : "text-light"}>
            Service Capabilities ({skills.filter((s) => s.category === "service").length})
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" style={{ color: "#c770f0" }} />
          <p className="mt-2 text-muted">Loading skills...</p>
        </div>
      ) : filteredSkills.length === 0 ? (
        <div className="admin-card p-5 text-center">
          <p style={{ color: "var(--admin-text-muted)" }}>No skills found for this category.</p>
          <Button className="btn-admin-primary" onClick={handleOpenCreate}>
            Add Skill
          </Button>
        </div>
      ) : (
        <div className="admin-card">
          <Table responsive hover className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "60px" }}>Order</th>
                <th>Skill Name</th>
                <th>Category</th>
                <th>Icon Identifier</th>
                <th>Status</th>
                <th style={{ width: "130px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSkills.map((item) => (
                <tr key={item.id}>
                  <td>
                    <Badge bg="secondary" style={{ backgroundColor: "rgba(199, 112, 240, 0.2)", color: "#c770f0" }}>
                      #{item.display_order}
                    </Badge>
                  </td>
                  <td>
                    <strong>{item.name}</strong>
                  </td>
                  <td>
                    <Badge bg="dark" className="text-capitalize" style={{ border: "1px solid var(--admin-card-border)" }}>
                      {item.category}
                    </Badge>
                  </td>
                  <td>
                    <code>{item.icon_name || "—"}</code>
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
      <Modal show={modalOpen} onHide={() => setModalOpen(false)} centered className="admin-modal">
        <Form onSubmit={handleSave}>
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: "1.15rem", fontWeight: 700 }}>
              {editingItem ? "Edit Skill" : "Add Skill"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="g-3">
              <Col md={8}>
                <Form.Group>
                  <Form.Label className="admin-form-label">Skill Name</Form.Label>
                  <Form.Control
                    type="text"
                    className="admin-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. React.js, Docker, Python"
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
                  <Form.Label className="admin-form-label">Category</Form.Label>
                  <Form.Select
                    className="admin-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="technical">Technical (About page skillset)</option>
                    <option value="tool">Tool (Development tools)</option>
                    <option value="service">Service (Services page skillset)</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="admin-form-label">Icon Identifier (react-icons)</Form.Label>
                  <Form.Control
                    type="text"
                    className="admin-input"
                    value={formData.icon_name}
                    onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                    placeholder="e.g. DiJavascript1, DiReact, SiFirebase, SiNextdotjs"
                  />
                  <Form.Text className="text-muted" style={{ fontSize: "0.8rem" }}>
                    Name of the component from <code>react-icons</code> (e.g. <code>DiReact</code>, <code>SiPostman</code>).
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="admin-form-label">Optional Remote Icon URL</Form.Label>
                  <Form.Control
                    type="text"
                    className="admin-input"
                    value={formData.icon_url}
                    onChange={(e) => setFormData({ ...formData, icon_url: e.target.value })}
                    placeholder="https://... (if not using react-icons)"
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Check
                  type="switch"
                  id="skill-published-switch"
                  label="Published (Visible on Public Website)"
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
              {saving ? "Saving..." : editingItem ? "Save Changes" : "Create Skill"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <ConfirmModal
        show={Boolean(deleteTarget)}
        title="Delete Skill"
        message={`Are you sure you want to delete the skill "${deleteTarget?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}

export default SkillsAdmin;
