import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  const res = await pool.query(
    `select id, title_ar, title_en, content_ar, content_en, image, date
     from public.news
     where is_published = true
     order by date desc, id desc`
  );

  return NextResponse.json({ success: true, items: res.rows });
}
