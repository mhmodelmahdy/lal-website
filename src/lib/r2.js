import crypto from "crypto";

const MIME_TO_EXT = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

export const ALLOWED_NEWS_IMAGE_MIME_TYPES = new Set(Object.keys(MIME_TO_EXT));
export const MAX_NEWS_IMAGE_BYTES = 5 * 1024 * 1024;

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value || !String(value).trim()) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return String(value).trim();
}

function normalizePathPart(input) {
  return String(input || "").trim().replace(/^\/+|\/+$/g, "");
}

function sanitizeFileBaseName(fileName) {
  const raw = String(fileName || "").trim();
  const withoutExt = raw.replace(/\.[^./\\]+$/, "");
  const normalized = withoutExt.toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/-+/g, "-").replace(/^[-_]+|[-_]+$/g, "");
  return normalized || "image";
}

function rfc3986Encode(value) {
  return encodeURIComponent(value).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}

function encodeCanonicalPath(pathname) {
  const parts = pathname.split("/").map((part) => rfc3986Encode(part));
  const encoded = parts.join("/");
  return encoded.startsWith("/") ? encoded : `/${encoded}`;
}

function sha256Hex(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function hmacSha256(key, value, encoding) {
  return crypto.createHmac("sha256", key).update(value).digest(encoding);
}

function getSignatureKey(secretAccessKey, dateStamp, regionName, serviceName) {
  const kDate = hmacSha256(`AWS4${secretAccessKey}`, dateStamp);
  const kRegion = hmacSha256(kDate, regionName);
  const kService = hmacSha256(kRegion, serviceName);
  return hmacSha256(kService, "aws4_request");
}

function getR2Config() {
  return {
    accessKeyId: getRequiredEnv("AWS_ACCESS_KEY_ID"),
    secretAccessKey: getRequiredEnv("AWS_SECRET_ACCESS_KEY"),
    bucketName: getRequiredEnv("AWS_STORAGE_BUCKET_NAME"),
    endpointUrl: getRequiredEnv("AWS_S3_ENDPOINT_URL"),
    regionName: String(process.env.AWS_S3_REGION_NAME || "auto").trim() || "auto",
    customDomain: normalizePathPart(process.env.AWS_S3_CUSTOM_DOMAIN),
    locationPrefix: normalizePathPart(process.env.AWS_LOCATION),
    mediaUrl: String(process.env.MEDIA_URL || "").trim(),
  };
}

function buildObjectKey({ fileName, mimeType, locationPrefix }) {
  const ext = MIME_TO_EXT[mimeType];
  if (!ext) throw new Error("Unsupported mime type");

  const now = new Date();
  const year = String(now.getUTCFullYear());
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const safeBase = sanitizeFileBaseName(fileName);
  const id = crypto.randomUUID();
  const objectName = `${id}-${safeBase}.${ext}`;

  const parts = [locationPrefix, "news", year, month, objectName].filter(Boolean);
  return parts.join("/");
}

function buildPublicUrl({ customDomain, mediaUrl, endpointUrl, bucketName, locationPrefix }, key) {
  if (customDomain) {
    return `https://${customDomain}/${key}`;
  }

  if (mediaUrl) {
    const base = mediaUrl.endsWith("/") ? mediaUrl : `${mediaUrl}/`;
    let relativeKey = key;
    if (locationPrefix) {
      const prefix = `${locationPrefix}/`;
      if (relativeKey.startsWith(prefix)) {
        relativeKey = relativeKey.slice(prefix.length);
      }
    }
    return new URL(relativeKey, base).toString();
  }

  const endpoint = new URL(endpointUrl);
  const basePath = normalizePathPart(endpoint.pathname);
  const path = [basePath, bucketName, key].filter(Boolean).join("/");
  return `${endpoint.origin}/${path}`;
}

export function validateNewsImageMeta({ fileName, mimeType, size }) {
  if (!fileName || !String(fileName).trim()) {
    return { ok: false, error: "File name is required" };
  }
  if (!ALLOWED_NEWS_IMAGE_MIME_TYPES.has(mimeType)) {
    return { ok: false, error: "Unsupported image type" };
  }
  if (!Number.isFinite(size) || size <= 0) {
    return { ok: false, error: "Invalid image size" };
  }
  if (size > MAX_NEWS_IMAGE_BYTES) {
    return { ok: false, error: `Image size exceeds limit (${MAX_NEWS_IMAGE_BYTES} bytes)` };
  }
  return { ok: true };
}

export function validateNewsImageSignature(buffer, mimeType) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 12) {
    return { ok: false, error: "Invalid image data" };
  }

  const signatures = {
    "image/jpeg": buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff,
    "image/png":
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a,
    "image/webp":
      buffer[0] === 0x52 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x46 &&
      buffer[8] === 0x57 &&
      buffer[9] === 0x45 &&
      buffer[10] === 0x42 &&
      buffer[11] === 0x50,
    "image/gif":
      buffer[0] === 0x47 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x38,
    "image/avif":
      buffer[4] === 0x66 &&
      buffer[5] === 0x74 &&
      buffer[6] === 0x79 &&
      buffer[7] === 0x70 &&
      buffer[8] === 0x61 &&
      buffer[9] === 0x76 &&
      buffer[10] === 0x69 &&
      (buffer[11] === 0x66 || buffer[11] === 0x73),
  };

  if (!signatures[mimeType]) {
    return { ok: false, error: "Image content does not match mime type" };
  }
  return { ok: true };
}

export function isAllowedNewsImageUrl(value) {
  const imageUrl = String(value || "").trim();
  if (!imageUrl) return true;

  try {
    const url = new URL(imageUrl);
    if (url.protocol !== "https:") return false;

    const allowedHosts = new Set();
    const customDomain = normalizePathPart(process.env.AWS_S3_CUSTOM_DOMAIN);
    if (customDomain) allowedHosts.add(customDomain.toLowerCase());

    const mediaUrl = String(process.env.MEDIA_URL || "").trim();
    if (mediaUrl) {
      const mediaHost = new URL(mediaUrl).host.toLowerCase();
      if (mediaHost) allowedHosts.add(mediaHost);
    }

    return allowedHosts.size > 0 && allowedHosts.has(url.host.toLowerCase());
  } catch {
    return false;
  }
}

export async function uploadNewsImageToR2({ fileName, mimeType, data }) {
  const config = getR2Config();
  const key = buildObjectKey({
    fileName,
    mimeType,
    locationPrefix: config.locationPrefix,
  });

  const endpoint = new URL(config.endpointUrl);
  const basePath = normalizePathPart(endpoint.pathname);
  const pathParts = [basePath, config.bucketName, key].filter(Boolean);
  const rawPath = `/${pathParts.join("/")}`;
  const canonicalUri = encodeCanonicalPath(rawPath);

  const now = new Date();
  const amzDate = now.toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
  const dateStamp = amzDate.slice(0, 8);
  const payloadHash = sha256Hex(data);

  const canonicalHeaders =
    `host:${endpoint.host}\n` +
    `x-amz-content-sha256:${payloadHash}\n` +
    `x-amz-date:${amzDate}\n`;
  const signedHeaders = "host;x-amz-content-sha256;x-amz-date";
  const canonicalRequest = ["PUT", canonicalUri, "", canonicalHeaders, signedHeaders, payloadHash].join("\n");

  const credentialScope = `${dateStamp}/${config.regionName}/s3/aws4_request`;
  const stringToSign = ["AWS4-HMAC-SHA256", amzDate, credentialScope, sha256Hex(canonicalRequest)].join("\n");
  const signingKey = getSignatureKey(config.secretAccessKey, dateStamp, config.regionName, "s3");
  const signature = hmacSha256(signingKey, stringToSign, "hex");
  const authorization =
    `AWS4-HMAC-SHA256 Credential=${config.accessKeyId}/${credentialScope}, ` +
    `SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const uploadUrl = `${endpoint.origin}${canonicalUri}`;

  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      Authorization: authorization,
      "Content-Type": mimeType,
      "x-amz-content-sha256": payloadHash,
      "x-amz-date": amzDate,
    },
    body: data,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`R2 upload failed (${res.status}): ${text.slice(0, 180)}`);
  }

  return {
    key,
    publicUrl: buildPublicUrl(config, key),
  };
}
