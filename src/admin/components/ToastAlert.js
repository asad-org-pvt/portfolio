import React from "react";
import { Alert } from "react-bootstrap";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";

function ToastAlert({ message, type = "success", onClose }) {
  if (!message) return null;

  const isSuccess = type === "success";

  return (
    <Alert
      variant={isSuccess ? "success" : "danger"}
      dismissible={Boolean(onClose)}
      onClose={onClose}
      style={{
        backgroundColor: isSuccess
          ? "rgba(56, 217, 169, 0.15)"
          : "rgba(255, 107, 107, 0.15)",
        borderColor: isSuccess
          ? "rgba(56, 217, 169, 0.4)"
          : "rgba(255, 107, 107, 0.4)",
        color: isSuccess ? "#38d9a9" : "#ff6b6b",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        borderRadius: "8px",
        fontSize: "0.95rem",
        marginBottom: "1.25rem",
      }}
    >
      {isSuccess ? (
        <FiCheckCircle style={{ fontSize: "1.25rem", flexShrink: 0 }} />
      ) : (
        <FiAlertCircle style={{ fontSize: "1.25rem", flexShrink: 0 }} />
      )}
      <div style={{ flex: 1 }}>{message}</div>
    </Alert>
  );
}

export default ToastAlert;
