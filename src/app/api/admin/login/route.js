import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, createAdminToken } from "@/lib/adminAuth";

export async function POST(req) {
  try {
    const body = await req.json();
    const user = String(body?.username || "");
    const pass = String(body?.password || "");

    if (user !== process.env.ADMIN_USERNAME || pass !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
    }

    const token = createAdminToken({ role: "admin", exp: Date.now() + 6 * 60 * 60 * 1000 });

    const store = await cookies(); // ✅ مهم
    store.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
