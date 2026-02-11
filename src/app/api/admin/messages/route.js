import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getAdminOrNull } from "@/lib/adminGuard";

export async function GET(req) {
  const admin = await getAdminOrNull();
  if (!admin) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
  const size = Math.min(Math.max(parseInt(searchParams.get("size") || "20", 10), 1), 100);
  const filter = (searchParams.get("filter") || "all").toLowerCase(); // all | unread | read

  const offset = (page - 1) * size;

  let where = "";
  if (filter === "unread") where = "where is_read = false";
  if (filter === "read") where = "where is_read = true";

  const [listRes, countRes] = await Promise.all([
    pool.query(
      `select id, name, email, phone, message, is_read, created_at
       from public.contact_messages
       ${where}
       order by created_at desc
       limit $1 offset $2`,
      [size, offset]
    ),
    pool.query(`select count(*)::int as total from public.contact_messages ${where}`),
  ]);

  const total = countRes.rows[0]?.total || 0;

  return NextResponse.json({
    success: true,
    data: {
      items: listRes.rows,
      page,
      size,
      total,
      totalPages: Math.ceil(total / size),
    },
  });
}

export async function PATCH(req) {
  const admin = await getAdminOrNull();
  if (!admin) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const id = Number(body?.id);
  const is_read = Boolean(body?.is_read);

  if (!Number.isFinite(id)) {
    return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 });
  }

  const res = await pool.query(
    `update public.contact_messages
     set is_read = $1
     where id = $2
     returning id, is_read`,
    [is_read, id]
  );

  if (res.rowCount === 0) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true, data: res.rows[0] });
}

export async function DELETE(req) {
  const admin = await getAdminOrNull();
  if (!admin) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  if (!Number.isFinite(id)) return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 });

  const res = await pool.query(`delete from public.contact_messages where id = $1`, [id]);
  if (res.rowCount === 0) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

  return NextResponse.json({ success: true });
}
