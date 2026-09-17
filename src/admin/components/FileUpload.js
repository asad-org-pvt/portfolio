import React, { useState, useRef } from "react";
import { Button, Spinner, Alert, Form } from "react-bootstrap";
import {
  FiUploadCloud,
  FiFileText,
  FiTrash2,
  FiExternalLink,
  FiCheckCircle,
  FiEdit3,
} from "react-icons/fi";
import { uploadPortfolioFile, validateFile } from "../../services/storageService";

export function FileUpload({
  bucket = "projects",
  folder = "uploads",
  entityId = null,
  accept = "image/*",
  currentUrl = "",
  onUploadSuccess,
  onClear,
  label = "Upload File",
  helperText = "",
  isPdf = false,
}) {
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef(null);

  const isCurrentPdf =
    isPdf ||
    (currentUrl &&
      (currentUrl.endsWith(".pdf") || currentUrl.includes("/resumes/") || currentUrl.includes("/documents/")));

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg("");
    setSuccessMsg("");

    try {
      // Validate client-side
      validateFile(file, bucket);

      setUploading(true);
      const result = await uploadPortfolioFile({
        file,
        bucket,
        folder,
        entityId,
      });

      setSuccessMsg(`Uploaded successfully! (${(file.size / 1024).toFixed(0)} KB)`);
      if (onUploadSuccess) {
        onUploadSuccess(result.publicUrl, result.storagePath);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setErrorMsg(err.message || "Failed to upload file to Supabase Storage.");
    } finally {
      setUploading(false);
      // Reset input value so same file can be re-selected if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleTriggerInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="admin-file-upload-container mb-3">
      {label && <Form.Label className="admin-form-label">{label}</Form.Label>}

      {errorMsg && (
        <Alert
          variant="danger"
          dismissible
          onClose={() => setErrorMsg("")}
          className="py-2 px-3 mb-2"
          style={{ fontSize: "0.85rem" }}
        >
          {errorMsg}
        </Alert>
      )}

      {successMsg && (
        <Alert
          variant="success"
          dismissible
          onClose={() => setSuccessMsg("")}
          className="py-2 px-3 mb-2 d-flex align-items-center gap-2"
          style={{ fontSize: "0.85rem" }}
        >
          <FiCheckCircle /> {successMsg}
        </Alert>
      )}

      <div
        className="p-3"
        style={{
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px dashed rgba(255, 255, 255, 0.15)",
          borderRadius: "8px",
        }}
      >
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          accept={accept}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        {/* Current Media Preview */}
        {currentUrl ? (
          <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 mb-3">
            <div className="d-flex align-items-center gap-3">
              {isCurrentPdf ? (
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 6,
                    background: "rgba(199, 112, 240, 0.15)",
                    color: "var(--admin-accent)",
                    fontSize: "1.5rem",
                    flexShrink: 0,
                  }}
                >
                  <FiFileText />
                </div>
              ) : (
                <img
                  src={currentUrl}
                  alt="Current preview"
                  style={{
                    width: 64,
                    height: 64,
                    objectFit: "cover",
                    borderRadius: 6,
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    flexShrink: 0,
                  }}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              )}

              <div style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                <span
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "var(--admin-text-main)",
                    display: "block",
                  }}
                >
                  {isCurrentPdf ? "PDF Document Attached" : "Image Media Attached"}
                </span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--admin-text-muted)",
                    display: "block",
                    wordBreak: "break-all",
                  }}
                >
                  {currentUrl.length > 50 ? `${currentUrl.slice(0, 50)}...` : currentUrl}
                </span>
                <a
                  href={currentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="d-inline-flex align-items-center gap-1 mt-1"
                  style={{ fontSize: "0.75rem", color: "var(--admin-accent)" }}
                >
                  <FiExternalLink /> Open media in new tab
                </a>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <Button
                variant="outline-primary"
                size="sm"
                className="btn-admin-outline d-inline-flex align-items-center gap-1"
                onClick={handleTriggerInput}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Spinner size="sm" animation="border" /> Uploading...
                  </>
                ) : (
                  <>
                    <FiUploadCloud /> Replace
                  </>
                )}
              </Button>

              {onClear && (
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="d-inline-flex align-items-center gap-1"
                  onClick={onClear}
                  disabled={uploading}
                  style={{ fontSize: "0.8rem" }}
                >
                  <FiTrash2 /> Remove
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-3">
            <FiUploadCloud
              style={{
                fontSize: "2rem",
                color: "var(--admin-accent)",
                marginBottom: "0.5rem",
              }}
            />
            <p style={{ fontSize: "0.85rem", color: "var(--admin-text-muted)", margin: 0 }}>
              No file currently uploaded. Select a file from your computer to upload to Supabase Storage.
            </p>
            <div className="mt-3">
              <Button
                variant="primary"
                size="sm"
                className="btn-admin-primary d-inline-flex align-items-center gap-2"
                onClick={handleTriggerInput}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Spinner size="sm" animation="border" /> Uploading...
                  </>
                ) : (
                  <>
                    <FiUploadCloud /> Choose File to Upload
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Toggleable URL input fallback */}
        <div className="mt-2 pt-2 border-top border-secondary" style={{ borderColor: "rgba(255,255,255,0.08) !important" }}>
          <button
            type="button"
            className="btn btn-link p-0 text-muted d-inline-flex align-items-center gap-1"
            style={{ fontSize: "0.75rem", textDecoration: "none" }}
            onClick={() => setShowUrlInput(!showUrlInput)}
          >
            <FiEdit3 /> {showUrlInput ? "Hide manual URL input" : "Or enter external URL manually"}
          </button>

          {showUrlInput && (
            <div className="mt-2">
              <Form.Control
                type="text"
                className="admin-input"
                style={{ fontSize: "0.85rem" }}
                value={currentUrl || ""}
                onChange={(e) => onUploadSuccess && onUploadSuccess(e.target.value, null)}
                placeholder="https://..."
              />
            </div>
          )}
        </div>
      </div>

      {helperText && (
        <Form.Text className="text-muted" style={{ fontSize: "0.75rem" }}>
          {helperText}
        </Form.Text>
      )}
    </div>
  );
}

export default FileUpload;
