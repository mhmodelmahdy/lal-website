import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getAdminOrNull } from "@/lib/adminGuard";

export async function GET(req) {
  try {
    const admin = await getAdminOrNull();
    if (!admin) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const size = Math.min(Math.max(parseInt(searchParams.get("size") || "10", 10), 1), 50);
    const rawFilter = (searchParams.get("filter") || "all").toLowerCase(); // all | unread | read
    const filter = ["all", "unread", "read"].includes(rawFilter) ? rawFilter : "all";

    const offset = (page - 1) * size;
    const params = [];
    const whereParts = [];

    if (filter === "unread") {
      params.push(false);
      whereParts.push(`is_read = $${params.length}`);
    }
    if (filter === "read") {
      params.push(true);
      whereParts.push(`is_read = $${params.length}`);
    }

    const where = whereParts.length ? `where ${whereParts.join(" and ")}` : "";
    const limitPlaceholder = `$${params.length + 1}`;
    const offsetPlaceholder = `$${params.length + 2}`;
    params.push(size, offset);

    const res = await pool.query(
      `with filtered as (
         select id, name, email, phone, message, is_read, created_at
         from public.contact_messages
         ${where}
       ),
       total as (
         select count(*)::int as total from filtered
       ),
       paged as (
         select id, name, email, phone, message, is_read, created_at
         from filtered
         order by created_at desc
         limit ${limitPlaceholder} offset ${offsetPlaceholder}
       )
       select
         paged.id,
         paged.name,
         paged.email,
         paged.phone,
         paged.message,
         paged.is_read,
         paged.created_at,
         total.total
       from total
       left join paged on true`,
      params
    );

    const total = res.rows[0]?.total || 0;
    const items = res.rows
      .filter((row) => row.id != null)
      .map(({ total: _total, ...item }) => item);

    return NextResponse.json({
      success: true,
      data: {
        items,
        page,
        size,
        total,
        totalPages: Math.max(1, Math.ceil(total / size)),
      },
    });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: "Failed to load messages", details: String(e?.message || e) },
      { status: 500 }
    );
  }
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
