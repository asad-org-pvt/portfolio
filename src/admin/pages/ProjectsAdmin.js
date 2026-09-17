import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Modal, Form, Row, Col, Badge, Spinner } from "react-bootstrap";
import { supabase, isSupabaseConfigured } from "../../lib/supabaseClient";
import ToastAlert from "../components/ToastAlert";
import ConfirmModal from "../components/ConfirmModal";
import FileUpload from "../components/FileUpload";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiExternalLink,
  FiCheck,
  FiX,
  FiStar,
} from "react-icons/fi";

const INITIAL_FORM = {
  title: "",
  slug: "",
  description: "",
  demo_url: "",
  github_url: "",
  cover_image_url: "",
  is_featured: false,
  display_order: 0,
  is_published: true,
};

function ProjectsAdmin() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ message: "", type: "success" });

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProjects = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      setFeedback({ message: err.message || "Failed to load projects.", type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleOpenCreate = () => {
    setEditingProject(null);
    setFormData({ ...INITIAL_FORM, display_order: projects.length + 1 });
    setModalOpen(true);
  };

  const handleOpenEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || "",
      slug: project.slug || "",
      description: project.description || "",
      demo_url: project.demo_url || "",
      github_url: project.github_url || "",
      cover_image_url: project.cover_image_url || "",
      is_featured: Boolean(project.is_featured),
      display_order: project.display_order ?? 0,
      is_published: project.is_published !== false,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback({ message: "", type: "success" });

    const slug = formData.slug.trim()
      ? formData.slug.trim()
      : formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const payload = {
      title: formData.title.trim(),
      slug: slug,
      description: formData.description.trim(),
      demo_url: formData.demo_url.trim() || null,
      github_url: formData.github_url.trim() || null,
      cover_image_url: formData.cover_image_url.trim() || null,
      is_featured: formData.is_featured,
      display_order: parseInt(formData.display_order, 10) || 0,
      is_published: formData.is_published,
    };

    try {
      if (editingProject) {
        const { error } = await supabase
          .from("projects")
          .update(payload)
          .eq("id", editingProject.id);
        if (error) throw error;
        setFeedback({ message: "Project updated successfully.", type: "success" });
      } else {
        const { error } = await supabase.from("projects").insert([payload]);
        if (error) throw error;
        setFeedback({ message: "Project created successfully.", type: "success" });
      }
      setModalOpen(false);
      fetchProjects();
    } catch (err) {
      setFeedback({ message: err.message || "Failed to save project.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (project) => {
    const nextStatus = !project.is_published;
    try {
      const { error } = await supabase
        .from("projects")
        .update({ is_published: nextStatus })
        .eq("id", project.id);
      if (error) throw error;
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, is_published: nextStatus } : p))
      );
      setFeedback({
        message: `Project ${nextStatus ? "published" : "hidden as draft"}.`,
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
      const { error } = await supabase.from("projects").delete().eq("id", deleteTarget.id);
      if (error) throw error;
      setFeedback({ message: "Project deleted.", type: "success" });
      setDeleteTarget(null);
      fetchProjects();
    } catch (err) {
      setFeedback({ message: err.message || "Failed to delete project.", type: "error" });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>Projects Management</h2>
          <p style={{ color: "var(--admin-text-muted)", fontSize: "0.9rem", margin: 0 }}>
            Manage portfolio projects, demo links, media, and visibility
          </p>
        </div>
        <Button className="btn-admin-primary d-flex align-items-center gap-2" onClick={handleOpenCreate}>
          <FiPlus /> New Project
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
          <p className="mt-2 text-muted">Loading projects list...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="admin-card p-5 text-center">
          <p style={{ color: "var(--admin-text-muted)" }}>No projects found in the database.</p>
          <Button className="btn-admin-primary" onClick={handleOpenCreate}>
            Create First Project
          </Button>
        </div>
      ) : (
        <div className="admin-card">
          <Table responsive hover className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "60px" }}>Order</th>
                <th>Title</th>
                <th>Description</th>
                <th>Links</th>
                <th>Featured</th>
                <th>Status</th>
                <th style={{ width: "130px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td>
                    <Badge bg="secondary" style={{ backgroundColor: "rgba(199, 112, 240, 0.2)", color: "#c770f0" }}>
                      #{project.display_order}
                    </Badge>
                  </td>
                  <td>
                    <strong>{project.title}</strong>
                    {project.slug && (
                      <div style={{ fontSize: "0.75rem", color: "var(--admin-text-muted)" }}>
                        /{project.slug}
                      </div>
                    )}
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
                      title={project.description}
                    >
                      {project.description}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      {project.demo_url && (
                        <a
                          href={project.demo_url}
                          target="_blank"
                          rel="noreferrer"
                          className="badge bg-dark text-info text-decoration-none d-flex align-items-center gap-1"
                        >
                          Demo <FiExternalLink size={11} />
                        </a>
                      )}
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noreferrer"
                          className="badge bg-dark text-light text-decoration-none d-flex align-items-center gap-1"
                        >
                          GitHub <FiExternalLink size={11} />
                        </a>
                      )}
                    </div>
                  </td>
                  <td>
                    {project.is_featured ? (
                      <Badge bg="warning" text="dark" className="d-inline-flex align-items-center gap-1">
                        <FiStar size={12} /> Featured
                      </Badge>
                    ) : (
                      <span style={{ color: "var(--admin-text-muted)", fontSize: "0.8rem" }}>—</span>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => handleTogglePublish(project)}
                      className={project.is_published ? "admin-badge-published" : "admin-badge-draft"}
                      style={{ border: "none", cursor: "pointer" }}
                      title="Click to toggle publish status"
                    >
                      {project.is_published ? (
                        <>
                          <FiCheck size={12} /> Published
                        </>
                      ) : (
                        <>
                          <FiX size={12} /> Draft
                        </>
                      )}
                    </button>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <Button
                      variant="link"
                      className="p-1 text-light"
                      onClick={() => handleOpenEdit(project)}
                      title="Edit"
                    >
                      <FiEdit2 size={16} />
                    </Button>
                    <Button
                      variant="link"
                      className="p-1 text-danger"
                      onClick={() => setDeleteTarget(project)}
                      title="Delete"
                    >
                      <FiTrash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Create / Edit Project Modal */}
      <Modal
        show={modalOpen}
        onHide={() => setModalOpen(false)}
        size="lg"
        centered
        className="admin-modal"
      >
        <Form onSubmit={handleSave}>
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: "1.15rem", fontWeight: 700 }}>
              {editingProject ? "Edit Project" : "Create New Project"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="g-3">
              <Col md={8}>
                <Form.Group>
                  <Form.Label className="admin-form-label">Project Title</Form.Label>
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

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="admin-form-label">Slug (URL identifier)</Form.Label>
                  <Form.Control
                    type="text"
                    className="admin-input"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. confidant-health (auto-generated if blank)"
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="admin-form-label">Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    className="admin-textarea"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="admin-form-label">Live Demo URL</Form.Label>
                  <Form.Control
                    type="url"
                    className="admin-input"
                    value={formData.demo_url}
                    onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                    placeholder="https://..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="admin-form-label">GitHub Repository URL</Form.Label>
                  <Form.Control
                    type="url"
                    className="admin-input"
                    value={formData.github_url}
                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                    placeholder="https://github.com/..."
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <FileUpload
                  bucket="projects"
                  folder="covers"
                  entityId={editingProject?.id || formData.slug || "new"}
                  accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                  currentUrl={formData.cover_image_url}
                  label="Project Cover Image"
                  helperText="Upload JPG, PNG, WebP, GIF, or SVG image (max 10MB). Stored in Supabase 'projects' bucket."
                  onUploadSuccess={(url) => setFormData({ ...formData, cover_image_url: url })}
                  onClear={() => setFormData({ ...formData, cover_image_url: "" })}
                />
              </Col>

              <Col md={6}>
                <Form.Check
                  type="switch"
                  id="project-featured-switch"
                  label="Featured Project"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                />
              </Col>
              <Col md={6}>
                <Form.Check
                  type="switch"
                  id="project-published-switch"
                  label="Published (Visible on Public Website)"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                />
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              className="btn-admin-outline"
              onClick={() => setModalOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" className="btn-admin-primary" disabled={saving}>
              {saving ? "Saving..." : editingProject ? "Save Changes" : "Create Project"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        show={Boolean(deleteTarget)}
        title="Delete Project"
        message={`Are you sure you want to delete the project "${deleteTarget?.title}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}

export default ProjectsAdmin;
