import React from "react";
import { Modal, Button } from "react-bootstrap";

function ConfirmModal({
  show,
  title = "Confirm Action",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  confirmLabel = "Delete",
  confirmVariant = "danger",
  onConfirm,
  onCancel,
  loading = false,
}) {
  return (
    <Modal show={show} onHide={onCancel} centered className="admin-modal">
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: "1.15rem", fontWeight: 700 }}>
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ color: "#d1cce0" }}>{message}</Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          className="btn-admin-outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          variant={confirmVariant}
          className={confirmVariant === "primary" ? "btn-admin-primary" : "btn-admin-danger"}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? "Processing..." : confirmLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmModal;
