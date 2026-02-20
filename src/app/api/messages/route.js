import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const RATE_LIMIT_STORE_KEY = "__messagesRateLimitStore";
const rateLimitStore = globalThis[RATE_LIMIT_STORE_KEY] || new Map();

if (!globalThis[RATE_LIMIT_STORE_KEY]) {
  globalThis[RATE_LIMIT_STORE_KEY] = rateLimitStore;
}

function getClientIp(req) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }

  return req.headers.get("x-real-ip") || "unknown";
}

function checkRateLimit(clientIp) {
  const now = Date.now();
  const existing = rateLimitStore.get(clientIp);

  if (!existing || existing.resetAt <= now) {
    rateLimitStore.set(clientIp, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { limited: false, retryAfterSeconds: 0 };
  }

  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      limited: true,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  rateLimitStore.set(clientIp, existing);
  return { limited: false, retryAfterSeconds: 0 };
}

export async function POST(req) {
  try {
    const clientIp = getClientIp(req);
    const rateLimit = checkRateLimit(clientIp);
    if (rateLimit.limited) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many requests. Please wait and try again.",
          errorCode: "RATE_LIMITED",
        },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
        }
      );
    }

    const body = await req.json();

    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim();
    const phone = String(body?.phone || "").trim() || null;
    const message = String(body?.message || "").trim();

    const problems = [];
    if (name.length < 2) {
      problems.push({
        field: "name",
        code: "NAME_TOO_SHORT",
        message: "Name must be at least 2 characters.",
      });
    }
    if (!email || !email.includes("@")) {
      problems.push({
        field: "email",
        code: "EMAIL_INVALID",
        message: "Email is invalid.",
      });
    }
    if (message.length < 5) {
      problems.push({
        field: "message",
        code: "MESSAGE_TOO_SHORT",
        message: "Message must be at least 5 characters.",
      });
    }

    if (problems.length) {
      return NextResponse.json(
        {
          success: false,
          error: problems[0].message,
          errorCode: "VALIDATION_ERROR",
          problems,
          received: { name, email, phone, messageLen: message.length },
        },
        { status: 400 }
      );
    }

    const res = await pool.query(
      `insert into public.contact_messages (name, email, phone, message)
       values ($1,$2,$3,$4)
       returning id, created_at`,
      [name, email, phone, message]
    );

    return NextResponse.json({ success: true, data: res.rows[0] }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: "Server error", details: String(e?.message || e) },
      { status: 500 }
    );
  }
}
