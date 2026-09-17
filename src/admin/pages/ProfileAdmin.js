import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Card, Spinner } from "react-bootstrap";
import { supabase, isSupabaseConfigured } from "../../lib/supabaseClient";
import ToastAlert from "../components/ToastAlert";
import FileUpload from "../components/FileUpload";
import { FiSave } from "react-icons/fi";

function ProfileAdmin() {
  const [profileId, setProfileId] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "",
    initials: "AS",
    hero_greeting: "Hi There!",
    hero_intro_title: "LET ME INTRODUCE MYSELF",
    hero_intro_body: "",
    rotating_titles: "",
    about_heading: "Know Who I'M",
    about_body: "",
    about_quote: "",
    about_quote_author: "Asad",
    current_employer: "",
    education_summary: "",
    hobbies: "",
    avatar_url: "",
    hero_image_url: "",
    about_image_url: "",
    contact_image_url: "",
    github_url: "",
    linkedin_url: "",
    email: "",
    phone: "",
    whatsapp: "",
    github_username_main: "",
    github_username_alt: "",
    is_published: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ message: "", type: "success" });

  useEffect(() => {
    let isMounted = true;
    async function loadProfile() {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from("profile")
          .select("*")
          .limit(1)
          .maybeSingle();

        if (error) throw error;

        if (data && isMounted) {
          setProfileId(data.id);
          setFormData({
            full_name: data.full_name || "",
            initials: data.initials || "AS",
            hero_greeting: data.hero_greeting || "Hi There!",
            hero_intro_title: data.hero_intro_title || "LET ME INTRODUCE MYSELF",
            hero_intro_body: data.hero_intro_body || "",
            rotating_titles: Array.isArray(data.rotating_titles)
              ? data.rotating_titles.join("\n")
              : "",
            about_heading: data.about_heading || "Know Who I'M",
            about_body: data.about_body || "",
            about_quote: data.about_quote || "",
            about_quote_author: data.about_quote_author || "Asad",
            current_employer: data.current_employer || "",
            education_summary: data.education_summary || "",
            hobbies: Array.isArray(data.hobbies) ? data.hobbies.join("\n") : "",
            avatar_url: data.avatar_url || "",
            hero_image_url: data.hero_image_url || "",
            about_image_url: data.about_image_url || "",
            contact_image_url: data.contact_image_url || "",
            github_url: data.github_url || "",
            linkedin_url: data.linkedin_url || "",
            email: data.email || "",
            phone: data.phone || "",
            whatsapp: data.whatsapp || "",
            github_username_main: data.github_username_main || "",
            github_username_alt: data.github_username_alt || "",
            is_published: data.is_published !== false,
          });
        }
      } catch (err) {
        setFeedback({ message: err.message, type: "error" });
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback({ message: "", type: "success" });

    // Parse array fields
    const rotatingTitlesArray = formData.rotating_titles
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const hobbiesArray = formData.hobbies
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      full_name: formData.full_name,
      initials: formData.initials,
      hero_greeting: formData.hero_greeting,
      hero_intro_title: formData.hero_intro_title,
      hero_intro_body: formData.hero_intro_body,
      rotating_titles: rotatingTitlesArray,
      about_heading: formData.about_heading,
      about_body: formData.about_body,
      about_quote: formData.about_quote,
      about_quote_author: formData.about_quote_author,
      current_employer: formData.current_employer,
      education_summary: formData.education_summary,
      hobbies: hobbiesArray,
      avatar_url: formData.avatar_url || null,
      hero_image_url: formData.hero_image_url || null,
      about_image_url: formData.about_image_url || null,
      contact_image_url: formData.contact_image_url || null,
      github_url: formData.github_url || null,
      linkedin_url: formData.linkedin_url || null,
      email: formData.email || null,
      phone: formData.phone || null,
      whatsapp: formData.whatsapp || null,
      github_username_main: formData.github_username_main || null,
      github_username_alt: formData.github_username_alt || null,
      is_published: formData.is_published,
    };

    try {
      if (profileId) {
        const { error } = await supabase
          .from("profile")
          .update(payload)
          .eq("id", profileId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("profile")
          .insert([payload])
          .select()
          .single();
        if (error) throw error;
        setProfileId(data.id);
      }
      setFeedback({ message: "Profile settings saved successfully!", type: "success" });
    } catch (err) {
      setFeedback({ message: err.message || "Failed to save profile.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" style={{ color: "#c770f0" }} />
        <p className="mt-2 text-muted">Loading profile content...</p>
      </div>
    );
  }

  return (
    <div>
      <ToastAlert
        message={feedback.message}
        type={feedback.type}
        onClose={() => setFeedback({ message: "", type: "success" })}
      />

      <Form onSubmit={handleSubmit}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
          <Button
            type="submit"
            className="btn-admin-primary d-flex align-items-center gap-2"
            disabled={saving}
          >
            <FiSave /> {saving ? "Saving Changes..." : "Save Profile"}
          </Button>
        </div>

        {/* Section 1: Core Hero & Identity */}
        <Card className="admin-card mb-4">
          <Card.Header className="admin-card-header">Hero & Personal Identity</Card.Header>
          <Card.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="admin-form-label">Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    className="admin-input"
                    value={formData.full_name}
                    onChange={(e) => handleChange("full_name", e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="admin-form-label">Initials / Monogram</Form.Label>
                  <Form.Control
                    type="text"
                    className="admin-input"
                    value={formData.initials}
                    onChange={(e) => handleChange("initials", e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="admin-form-label">Hero Greeting</Form.Label>
                  <Form.Control
                    type="text"
                    className="admin-input"
                    value={formData.hero_greeting}
                    onChange={(e) => handleChange("hero_greeting", e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="admin-form-label">
                    Rotating Job Titles (One title per line for Typewriter effect)
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    className="admin-textarea"
                    value={formData.rotating_titles}
                    onChange={(e) => handleChange("rotating_titles", e.target.value)}
                    placeholder="Software Developer&#10;Freelancer&#10;MERN Stack Developer"
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="admin-form-label">Hero Intro Title</Form.Label>
                  <Form.Control
                    type="text"
                    className="admin-input"
                    value={formData.hero_intro_title}
                    onChange={(e) => handleChange("hero_intro_title", e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="admin-form-label">Hero Intro Body</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    className="admin-textarea"
                    value={formData.hero_intro_body}
                    onChange={(e) => handleChange("hero_intro_body", e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Section 2: About Details */}
        <Card className="admin-card mb-4">
          <Card.Header className="admin-card-header">About Page Details</Card.Header>
          <Card.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="admin-form-label">About Heading</Form.Label>
                  <Form.Control
                    type="text"
                    className="admin-input"
                    value={formData.about_heading}
                    onChange={(e) => handleChange("about_heading", e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="admin-form-label">Current Employer</Form.Label>
                  <Form.Control
                    type="text"
                    className="admin-input"
                    value={formData.current_employer}
                    onChange={(e) => handleChange("current_employer", e.target.value)}
                    placeholder="e.g. Stella Technology"
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="admin-form-label">About Bio Body</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    className="admin-textarea"
                    value={formData.about_body}
                    onChange={(e) => handleChange("about_body", e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={8}>
                <Form.Group>
                  <Form.Label className="admin-form-label">Personal Quote</Form.Label>
                  <Form.Control
                    type="text"
                    className="admin-input"
                    value={formData.about_quote}
                    onChange={(e) => handleChange("about_quote", e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="admin-form-label">Quote Author</Form.Label>
                  <Form.Control
                    type="text"
                    className="admin-input"
                    value={formData.about_quote_author}
                    onChange={(e) => handleChange("about_quote_author", e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="admin-form-label">
                    Hobbies & Interests (One per line)
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    className="admin-textarea"
                    value={formData.hobbies}
                    onChange={(e) => handleChange("hobbies", e.target.value)}
                    placeholder="Travelling&#10;Watching Movies&#10;Reading Ancient History"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Section 3: Integrations & Media URLs */}
        <Card className="admin-card mb-4">
          <Card.Header className="admin-card-header">GitHub Heatmaps & Media References</Card.Header>
          <Card.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="admin-form-label">Primary GitHub Username</Form.Label>
                  <Form.Control
                    type="text"
                    className="admin-input"
                    value={formData.github_username_main}
                    onChange={(e) => handleChange("github_username_main", e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="admin-form-label">Secondary GitHub Username</Form.Label>
                  <Form.Control
                    type="text"
                    className="admin-input"
                    value={formData.github_username_alt}
                    onChange={(e) => handleChange("github_username_alt", e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <FileUpload
                  bucket="profile"
                  folder="avatars"
                  entityId={profileId || "profile"}
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  currentUrl={formData.avatar_url}
                  label="Avatar Image"
                  helperText="Upload profile avatar (PNG, JPG, WebP, SVG, max 10MB)."
                  onUploadSuccess={(url) => handleChange("avatar_url", url)}
                  onClear={() => handleChange("avatar_url", "")}
                />
              </Col>
              <Col md={6}>
                <FileUpload
                  bucket="profile"
                  folder="heros"
                  entityId={profileId || "hero"}
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  currentUrl={formData.hero_image_url}
                  label="Hero Illustration Graphic"
                  helperText="Upload home section hero graphic (PNG, JPG, SVG, max 10MB)."
                  onUploadSuccess={(url) => handleChange("hero_image_url", url)}
                  onClear={() => handleChange("hero_image_url", "")}
                />
              </Col>
              <Col md={6}>
                <FileUpload
                  bucket="profile"
                  folder="about"
                  entityId={profileId || "about"}
                  accept="image/png,image/jpeg,image/webp"
                  currentUrl={formData.about_image_url}
                  label="About Page Illustration"
                  helperText="Upload about section illustration image."
                  onUploadSuccess={(url) => handleChange("about_image_url", url)}
                  onClear={() => handleChange("about_image_url", "")}
                />
              </Col>
              <Col md={6}>
                <FileUpload
                  bucket="profile"
                  folder="contact"
                  entityId={profileId || "contact"}
                  accept="image/png,image/jpeg,image/webp"
                  currentUrl={formData.contact_image_url}
                  label="Contact Page Illustration"
                  helperText="Upload contact section illustration image."
                  onUploadSuccess={(url) => handleChange("contact_image_url", url)}
                  onClear={() => handleChange("contact_image_url", "")}
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Section 4: Publishing Status */}
        <Card className="admin-card mb-4">
          <Card.Header className="admin-card-header">Publishing Control</Card.Header>
          <Card.Body>
            <Form.Check
              type="switch"
              id="profile-published-switch"
              label="Publish Profile on Public Website"
              checked={formData.is_published}
              onChange={(e) => handleChange("is_published", e.target.checked)}
              style={{ fontWeight: 600 }}
            />
          </Card.Body>
        </Card>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="submit"
            className="btn-admin-primary d-flex align-items-center gap-2"
            disabled={saving}
          >
            <FiSave /> {saving ? "Saving Changes..." : "Save Profile"}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default ProfileAdmin;
