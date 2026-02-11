import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();

    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim();
    const phone = String(body?.phone || "").trim() || null;
    const message = String(body?.message || "").trim();

    const problems = [];
    if (name.length < 2) problems.push("name must be at least 2 chars");
    if (!email || !email.includes("@")) problems.push("email is invalid");
    if (message.length < 5) problems.push("message must be at least 5 chars");

    if (problems.length) {
      return NextResponse.json(
        { success: false, error: "Invalid payload", problems, received: { name, email, phone, messageLen: message.length } },
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
