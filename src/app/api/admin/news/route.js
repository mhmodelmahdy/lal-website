import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getAdminOrNull } from "@/lib/adminGuard";

export async function GET(req) {
  const admin = await getAdminOrNull();
  if (!admin) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
  const size = Math.min(Math.max(parseInt(searchParams.get("size") || "20", 10), 1), 100);
  const q = (searchParams.get("q") || "").trim();
  const offset = (page - 1) * size;

  const where = q
    ? `where title_ar ilike $1 or title_en ilike $1 or content_ar ilike $1 or content_en ilike $1`
    : "";

  const params = q ? [`%${q}%`, size, offset] : [size, offset];

  const [listRes, countRes] = await Promise.all([
    pool.query(
      `select id, title_ar, title_en, content_ar, content_en, image, date, is_published, created_at, updated_at
       from public.news
       ${where}
       order by date desc, id desc
       limit $${q ? 2 : 1} offset $${q ? 3 : 2}`,
      params
    ),
    pool.query(
      `select count(*)::int as total from public.news ${where}`,
      q ? [`%${q}%`] : []
    ),
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

export async function POST(req) {
  const admin = await getAdminOrNull();
  if (!admin) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const title_ar = String(body?.title_ar || "").trim();
  const title_en = String(body?.title_en || "").trim();
  const content_ar = String(body?.content_ar || "").trim();
  const content_en = String(body?.content_en || "").trim();
  const image = String(body?.image || "").trim() || null;
  const date = body?.date ? new Date(body.date).toISOString() : new Date().toISOString();
  const is_published = Boolean(body?.is_published);

  if (!title_ar || !title_en || !content_ar || !content_en) {
    return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
  }

  const res = await pool.query(
    `insert into public.news (title_ar, title_en, content_ar, content_en, image, date, is_published)
     values ($1,$2,$3,$4,$5,$6,$7)
     returning id`,
    [title_ar, title_en, content_ar, content_en, image, date, is_published]
  );

  return NextResponse.json({ success: true, id: res.rows[0].id }, { status: 201 });
}

export async function PATCH(req) {
  const admin = await getAdminOrNull();
  if (!admin) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const id = Number(body?.id);
  if (!Number.isFinite(id)) return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 });

  const title_ar = body?.title_ar != null ? String(body.title_ar).trim() : null;
  const title_en = body?.title_en != null ? String(body.title_en).trim() : null;
  const content_ar = body?.content_ar != null ? String(body.content_ar).trim() : null;
  const content_en = body?.content_en != null ? String(body.content_en).trim() : null;
  const image = body?.image != null ? (String(body.image).trim() || null) : null;
  const date = body?.date != null ? new Date(body.date).toISOString() : null;
  const is_published = typeof body?.is_published === "boolean" ? body.is_published : null;

  const res = await pool.query(
    `update public.news
     set
       title_ar = coalesce($1, title_ar),
       title_en = coalesce($2, title_en),
       content_ar = coalesce($3, content_ar),
       content_en = coalesce($4, content_en),
       image = coalesce($5, image),
       date = coalesce($6, date),
       is_published = coalesce($7, is_published),
       updated_at = now()
     where id = $8
     returning id`,
    [title_ar, title_en, content_ar, content_en, image, date, is_published, id]
  );

  if (res.rowCount === 0) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req) {
  const admin = await getAdminOrNull();
  if (!admin) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));
  if (!Number.isFinite(id)) return NextResponse.json({ success: false, error: "Invalid id" }, { status: 400 });

  const res = await pool.query(`delete from public.news where id = $1`, [id]);
  if (res.rowCount === 0) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });

  return NextResponse.json({ success: true });
}
