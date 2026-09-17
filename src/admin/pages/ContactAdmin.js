import React, { useState, useEffect, useCallback } from "react";
import { Form, Button, Card, Row, Col, Table, Modal, Badge, Spinner } from "react-bootstrap";
import { supabase, isSupabaseConfigured } from "../../lib/supabaseClient";
import ToastAlert from "../components/ToastAlert";
import ConfirmModal from "../components/ConfirmModal";
import { FiSave, FiPlus, FiEdit2, FiTrash2, FiExternalLink, FiCheck, FiX } from "react-icons/fi";

const INITIAL_SOCIAL_FORM = {
  platform: "",
  url: "",
  icon_name: "",
  display_order: 0,
  is_published: true,
};

function ContactAdmin() {
  const [contactId, setContactId] = useState(null);
  const [contactData, setContactData] = useState({
    email: "",
    phone: "",
    whatsapp: "",
    location: "",
    is_published: true,
  });

  const [socialLinks, setSocialLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingContact, setSavingContact] = useState(false);
  const [feedback, setFeedback] = useState({ message: "", type: "success" });

  // Social Modal State
  const [socialModalOpen, setSocialModalOpen] = useState(false);
  const [editingSocial, setEditingSocial] = useState(null);
  const [socialFormData, setSocialFormData] = useState(INITIAL_SOCIAL_FORM);
  const [savingSocial, setSavingSocial] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchContactAndSocials = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [contactRes, socialsRes] = await Promise.all([
        supabase.from("contact_info").select("*").limit(1).maybeSingle(),
        supabase.from("social_links").select("*").order("display_order", { ascending: true }),
      ]);

      if (contactRes.data) {
        setContactId(contactRes.data.id);
        setContactData({
          email: contactRes.data.email || "",
          phone: contactRes.data.phone || "",
          whatsapp: contactRes.data.whatsapp || "",
          location: contactRes.data.location || "",
          is_published: contactRes.data.is_published !== false,
        });
      }

      setSocialLinks(socialsRes.data || []);
    } catch (err) {
      setFeedback({ message: err.message || "Failed to load contact info.", type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContactAndSocials();
  }, [fetchContactAndSocials]);

  const handleSaveContact = async (e) => {
    e.preventDefault();
    setSavingContact(true);
    setFeedback({ message: "", type: "success" });

    const payload = {
      email: contactData.email.trim(),
      phone: contactData.phone.trim() || null,
      whatsapp: contactData.whatsapp.trim() || null,
      location: contactData.location.trim() || null,
      is_published: contactData.is_published,
    };

    try {
      if (contactId) {
        const { error } = await supabase
          .from("contact_info")
          .update(payload)
          .eq("id", contactId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("contact_info")
          .insert([payload])
          .select()
          .single();
        if (error) throw error;
        setContactId(data.id);
      }
      setFeedback({ message: "Contact information saved successfully!", type: "success" });
    } catch (err) {
      setFeedback({ message: err.message || "Failed to save contact info.", type: "error" });
    } finally {
      setSavingContact(false);
    }
  };

  const handleOpenSocialCreate = () => {
    setEditingSocial(null);
    setSocialFormData({ ...INITIAL_SOCIAL_FORM, display_order: socialLinks.length + 1 });
    setSocialModalOpen(true);
  };

  const handleOpenSocialEdit = (item) => {
    setEditingSocial(item);
    setSocialFormData({
      platform: item.platform || "",
      url: item.url || "",
      icon_name: item.icon_name || "",
      display_order: item.display_order ?? 0,
      is_published: item.is_published !== false,
    });
    setSocialModalOpen(true);
  };

  const handleSaveSocial = async (e) => {
    e.preventDefault();
    setSavingSocial(true);

    const payload = {
      platform: socialFormData.platform.trim().toLowerCase(),
      url: socialFormData.url.trim(),
      icon_name: socialFormData.icon_name.trim() || null,
      display_order: parseInt(socialFormData.display_order, 10) || 0,
      is_published: socialFormData.is_published,
    };

    try {
      if (editingSocial) {
        const { error } = await supabase
          .from("social_links")
          .update(payload)
          .eq("id", editingSocial.id);
        if (error) throw error;
        setFeedback({ message: "Social link updated.", type: "success" });
      } else {
        const { error } = await supabase.from("social_links").insert([payload]);
        if (error) throw error;
        setFeedback({ message: "Social link added.", type: "success" });
      }
      setSocialModalOpen(false);
      fetchContactAndSocials();
    } catch (err) {
      setFeedback({ message: err.message || "Failed to save social link.", type: "error" });
    } finally {
      setSavingSocial(false);
    }
  };

  const handleToggleSocialPublish = async (item) => {
    const nextStatus = !item.is_published;
    try {
      const { error } = await supabase
        .from("social_links")
        .update({ is_published: nextStatus })
        .eq("id", item.id);
      if (error) throw error;
      setSocialLinks((prev) =>
        prev.map((s) => (s.id === item.id ? { ...s, is_published: nextStatus } : s))
      );
    } catch (err) {
      setFeedback({ message: err.message || "Failed to toggle status.", type: "error" });
    }
  };

  const handleDeleteSocial = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const { error } = await supabase.from("social_links").delete().eq("id", deleteTarget.id);
      if (error) throw error;
      setFeedback({ message: "Social link deleted.", type: "success" });
      setDeleteTarget(null);
      fetchContactAndSocials();
    } catch (err) {
      setFeedback({ message: err.message || "Failed to delete link.", type: "error" });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" style={{ color: "#c770f0" }} />
        <p className="mt-2 text-muted">Loading contact & socials...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0 }}>Contact & Social Links</h2>
          <p style={{ color: "var(--admin-text-muted)", fontSize: "0.9rem", margin: 0 }}>
            Manage direct communication channels and public social media profiles
          </p>
        </div>
      </div>

      <ToastAlert
        message={feedback.message}
        type={feedback.type}
        onClose={() => setFeedback({ message: "", type: "success" })}
      />

      {/* Part 1: Direct Contact Info Form */}
      <Form onSubmit={handleSaveContact} className="mb-4">
        <Card className="admin-card">
          <Card.Header className="admin-card-header d-flex align-items-center justify-content-between">
            <span>Direct Contact Information</span>
            <Button type="submit" className="btn-admin-primary btn-sm d-flex align-items-center gap-1" disabled={savingContact}>
              <FiSave /> {savingContact ? "Saving..." : "Save Contact Info"}
            </Button>
          </Card.Header>
          <Card.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="admin-form-label">Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    className="admin-input"
                    value={contactData.email}
                    onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="admin-form-label">Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    className="admin-input"
                    value={contactData.phone}
                    onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                    placeholder="e.g. +92-313-6100930"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="admin-form-label">WhatsApp Number</Form.Label>
                  <Form.Control
                    type="text"
                    className="admin-input"
                    value={contactData.whatsapp}
                    onChange={(e) => setContactData({ ...contactData, whatsapp: e.target.value })}
                    placeholder="e.g. +92-313-6100930"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="admin-form-label">Location / Base</Form.Label>
                  <Form.Control
                    type="text"
                    className="admin-input"
                    value={contactData.location}
                    onChange={(e) => setContactData({ ...contactData, location: e.target.value })}
                    placeholder="e.g. Pakistan"
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Check
                  type="switch"
                  id="contact-pub-switch"
                  label="Display on Contact Us Page"
                  checked={contactData.is_published}
                  onChange={(e) => setContactData({ ...contactData, is_published: e.target.checked })}
                  style={{ fontWeight: 600 }}
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Form>

      {/* Part 2: Social Media Links Table */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>Social Profiles</h3>
        <Button className="btn-admin-primary btn-sm d-flex align-items-center gap-1" onClick={handleOpenSocialCreate}>
          <FiPlus /> Add Social Link
        </Button>
      </div>

      <div className="admin-card">
        <Table responsive hover className="admin-table">
          <thead>
            <tr>
              <th style={{ width: "60px" }}>Order</th>
              <th>Platform</th>
              <th>URL</th>
              <th>Icon</th>
              <th>Status</th>
              <th style={{ width: "130px", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {socialLinks.map((item) => (
              <tr key={item.id}>
                <td>
                  <Badge bg="secondary" style={{ backgroundColor: "rgba(199, 112, 240, 0.2)", color: "#c770f0" }}>
                    #{item.display_order}
                  </Badge>
                </td>
                <td>
                  <strong className="text-capitalize">{item.platform}</strong>
                </td>
                <td>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-info text-decoration-none d-flex align-items-center gap-1 small"
                  >
                    {item.url} <FiExternalLink size={11} />
                  </a>
                </td>
                <td>
                  <code>{item.icon_name || "Default"}</code>
                </td>
                <td>
                  <button
                    onClick={() => handleToggleSocialPublish(item)}
                    className={item.is_published ? "admin-badge-published" : "admin-badge-draft"}
                    style={{ border: "none", cursor: "pointer" }}
                  >
                    {item.is_published ? <FiCheck size={12} /> : <FiX size={12} />}{" "}
                    {item.is_published ? "Published" : "Draft"}
                  </button>
                </td>
                <td style={{ textAlign: "right" }}>
                  <Button variant="link" className="p-1 text-light" onClick={() => handleOpenSocialEdit(item)}>
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

      {/* Modal for Social Link Create/Edit */}
      <Modal show={socialModalOpen} onHide={() => setSocialModalOpen(false)} centered className="admin-modal">
        <Form onSubmit={handleSaveSocial}>
          <Modal.Header closeButton>
            <Modal.Title style={{ fontSize: "1.15rem", fontWeight: 700 }}>
              {editingSocial ? "Edit Social Link" : "New Social Link"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Row className="g-3">
              <Col md={8}>
                <Form.Group>
                  <Form.Label className="admin-form-label">Platform Name</Form.Label>
                  <Form.Control
                    type="text"
                    className="admin-input"
                    value={socialFormData.platform}
                    onChange={(e) => setSocialFormData({ ...socialFormData, platform: e.target.value })}
                    placeholder="e.g. github, linkedin, twitter, instagram"
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
                    value={socialFormData.display_order}
                    onChange={(e) => setSocialFormData({ ...socialFormData, display_order: e.target.value })}
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="admin-form-label">Profile URL</Form.Label>
                  <Form.Control
                    type="url"
                    className="admin-input"
                    value={socialFormData.url}
                    onChange={(e) => setSocialFormData({ ...socialFormData, url: e.target.value })}
                    placeholder="https://..."
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="admin-form-label">Icon Name (Optional)</Form.Label>
                  <Form.Control
                    type="text"
                    className="admin-input"
                    value={socialFormData.icon_name}
                    onChange={(e) => setSocialFormData({ ...socialFormData, icon_name: e.target.value })}
                    placeholder="e.g. AiFillGithub, FaLinkedinIn"
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Check
                  type="switch"
                  id="soc-pub-switch"
                  label="Published (Visible in Footer & Hero)"
                  checked={socialFormData.is_published}
                  onChange={(e) => setSocialFormData({ ...socialFormData, is_published: e.target.checked })}
                />
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" className="btn-admin-outline" onClick={() => setSocialModalOpen(false)} disabled={savingSocial}>
              Cancel
            </Button>
            <Button type="submit" className="btn-admin-primary" disabled={savingSocial}>
              {savingSocial ? "Saving..." : editingSocial ? "Save Changes" : "Create Link"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <ConfirmModal
        show={Boolean(deleteTarget)}
        title="Delete Social Link"
        message={`Are you sure you want to delete the link for "${deleteTarget?.platform}"?`}
        onConfirm={handleDeleteSocial}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}

export default ContactAdmin;
