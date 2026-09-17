import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

/**
 * Storage Service: Handles Supabase Storage file uploads, deletions, and URL resolution
 * for portfolio media (projects, certifications, resumes, profile).
 */

// Supported bucket configurations and size limits (matching supabase/storage.sql)
export const BUCKET_CONFIG = {
  projects: {
    bucketName: "projects",
    allowedMimeTypes: [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ],
    maxSizeBytes: 10 * 1024 * 1024, // 10MB
    label: "Project Media",
  },
  certifications: {
    bucketName: "certifications",
    allowedMimeTypes: [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
      "application/pdf",
    ],
    maxSizeBytes: 15 * 1024 * 1024, // 15MB
    label: "Certification Media & Documents",
  },
  resumes: {
    bucketName: "resumes",
    allowedMimeTypes: ["application/pdf"],
    maxSizeBytes: 10 * 1024 * 1024, // 10MB
    label: "Resume Documents",
  },
  profile: {
    bucketName: "profile",
    allowedMimeTypes: [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
      "image/svg+xml",
    ],
    maxSizeBytes: 10 * 1024 * 1024, // 10MB
    label: "Profile Media",
  },
};

// Disallowed dangerous file extensions to protect against malicious uploads
const DANGEROUS_EXTENSIONS = [
  "exe",
  "bat",
  "cmd",
  "sh",
  "php",
  "pl",
  "cgi",
  "jar",
  "html",
  "htm",
  "js",
  "jsx",
  "ts",
  "tsx",
  "vbs",
  "wsf",
];

/**
 * Validates a file against bucket policy, allowed MIME types, and file size limits.
 */
export function validateFile(file, bucket) {
  if (!file) {
    throw new Error("No file selected for upload.");
  }

  const config = BUCKET_CONFIG[bucket];
  if (!config) {
    throw new Error(`Invalid storage bucket '${bucket}'.`);
  }

  // Check file extension
  const extension = (file.name.split(".").pop() || "").toLowerCase();
  if (DANGEROUS_EXTENSIONS.includes(extension)) {
    throw new Error(`File extension '.${extension}' is not permitted for security reasons.`);
  }

  // Check MIME type
  const isMimeAllowed = config.allowedMimeTypes.some((mime) => {
    if (mime.endsWith("/*")) {
      const base = mime.split("/")[0];
      return file.type.startsWith(`${base}/`);
    }
    return file.type === mime;
  });

  if (!isMimeAllowed && file.type) {
    throw new Error(
      `Unsupported file type '${file.type || extension}'. Allowed types: ${config.allowedMimeTypes.join(", ")}`
    );
  }

  // Check file size
  if (file.size > config.maxSizeBytes) {
    const maxMb = (config.maxSizeBytes / (1024 * 1024)).toFixed(0);
    const fileMb = (file.size / (1024 * 1024)).toFixed(2);
    throw new Error(`File size (${fileMb}MB) exceeds the ${maxMb}MB limit for ${config.label}.`);
  }

  return true;
}

/**
 * Sanitizes a filename to prevent directory traversal and special character injection.
 */
export function sanitizeFilename(filename) {
  if (!filename) return "file";
  // Remove traversal dots and convert path separators / illegal characters to underscore
  const noTraversal = filename.replace(/\.\./g, "").replace(/[/\\?%*:|"<>]/g, "_");
  // Keep only alphanumeric, dots, dashes, underscores and collapse consecutive underscores
  const clean = noTraversal
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+/, "");
  return clean.toLowerCase() || "file";
}

/**
 * Uploads a file to a Supabase Storage bucket under a collision-safe path.
 *
 * Path format: {folder}/{timestamp}-{sanitizedFilename}
 * or {folder}/{entityId}/{timestamp}-{sanitizedFilename}
 */
export async function uploadPortfolioFile({ file, bucket, folder = "uploads", entityId = null }) {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase is not configured. Please supply valid credentials in environment.");
  }

  validateFile(file, bucket);

  const sanitized = sanitizeFilename(file.name);
  const timestamp = Date.now();
  const folderPart = folder.replace(/\/+$/, "");
  const entityPart = entityId ? `${entityId}/` : "";
  const storagePath = `${folderPart}/${entityPart}${timestamp}-${sanitized}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(storagePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    console.error("Supabase storage upload error:", uploadError);
    throw new Error(uploadError.message || "Failed to upload file to storage.");
  }

  // Obtain public URL for the uploaded object
  const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);
  const publicUrl = data?.publicUrl;

  return {
    publicUrl,
    storagePath,
    bucket,
    fileName: file.name,
    fileSize: file.size,
  };
}

/**
 * Safely removes a file from Supabase Storage.
 */
export async function deletePortfolioFile(bucket, storagePath) {
  if (!isSupabaseConfigured || !bucket || !storagePath) return false;

  try {
    const { error } = await supabase.storage.from(bucket).remove([storagePath]);
    if (error) {
      console.warn(`Could not delete file '${storagePath}' from '${bucket}':`, error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn(`deletePortfolioFile exception for '${storagePath}':`, err);
    return false;
  }
}

/**
 * Extracts the storage object path from a Supabase public URL if it belongs to the given bucket.
 */
export function extractStoragePath(publicUrl, bucket) {
  if (!publicUrl || typeof publicUrl !== "string") return null;
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx !== -1) {
    return decodeURIComponent(publicUrl.substring(idx + marker.length));
  }
  return null;
}
