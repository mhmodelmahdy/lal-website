import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, requireAdminFromToken } from "@/lib/adminAuth";

export async function GET() {
  const store = await cookies(); // ✅ مهم
  const token = store.get(COOKIE_NAME)?.value;

  const admin = requireAdminFromToken(token);
  if (!admin) return NextResponse.json({ ok: false }, { status: 401 });

  return NextResponse.json({ ok: true, admin: { role: admin.role } });
}
