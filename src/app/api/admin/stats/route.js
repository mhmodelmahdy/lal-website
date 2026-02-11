import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getAdminOrNull } from "@/lib/adminGuard";

export async function GET() {
  const admin = await getAdminOrNull();
  if (!admin) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const [newsTotalRes, msgTotalRes, msgUnreadRes, suppliersTotalRes] = await Promise.all([
    pool.query(`select count(*)::int as total from public.news`),
    pool.query(`select count(*)::int as total from public.contact_messages`),
    pool.query(`select count(*)::int as total from public.contact_messages where is_read = false`),
    pool.query(`select count(*)::int as total from public.supplier_registrations`),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      totalNews: newsTotalRes.rows[0]?.total || 0,
      totalMessages: msgTotalRes.rows[0]?.total || 0,
      unreadMessages: msgUnreadRes.rows[0]?.total || 0,
      totalSupplierRequests: suppliersTotalRes.rows[0]?.total || 0,
    },
  });
}
