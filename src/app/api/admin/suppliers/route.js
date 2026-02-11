import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { pool } from "@/lib/db";
import { COOKIE_NAME, requireAdminFromToken } from "@/lib/adminAuth";

export async function GET(req) {
  try {
    // ✅ التحقق من صلاحيات الأدمن
    const store = await cookies();
    const token = store.get(COOKIE_NAME)?.value;
    const admin = requireAdminFromToken(token);

    if (!admin) {
      return NextResponse.json(
        { success: false, error: "غير مصرح" },
        { status: 401 }
      );
    }

    // ✅ استخراج المعاملات من URL
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status") || "all";
    const search = searchParams.get("search") || "";

    const offset = (page - 1) * limit;

    // ✅ بناء الاستعلام
    let whereClause = "WHERE 1=1";
    const params = [];
    let paramCount = 0;

    if (status !== "all") {
      paramCount++;
      whereClause += ` AND status = $${paramCount}`;
      params.push(status);
    }

    if (search) {
      paramCount++;
      whereClause += ` AND (company_name ILIKE $${paramCount} OR contact_person ILIKE $${paramCount} OR products_services ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    // ✅ جلب العدد الكلي
    const countQuery = `SELECT COUNT(*) as total FROM public.supplier_registrations ${whereClause}`;
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);

    // ✅ جلب البيانات
    paramCount++;
    const limitParam = paramCount;
    paramCount++;
    const offsetParam = paramCount;

    const dataQuery = `
      SELECT 
        id, 
        company_name, 
        contact_person, 
        contact_info, 
        products_services, 
        additional_notes, 
        status,
        created_at
      FROM public.supplier_registrations
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${limitParam} OFFSET $${offsetParam}
    `;

    const dataResult = await pool.query(dataQuery, [...params, limit, offset]);

    return NextResponse.json({
      success: true,
      data: dataResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (e) {
    console.error("Admin suppliers fetch error:", e);
    return NextResponse.json(
      { success: false, error: "خطأ في الخادم", details: String(e?.message || e) },
      { status: 500 }
    );
  }
}

// ✅ تحديث حالة الطلب
export async function PATCH(req) {
  try {
    // ✅ التحقق من صلاحيات الأدمن
    const store = await cookies();
    const token = store.get(COOKIE_NAME)?.value;
    const admin = requireAdminFromToken(token);

    if (!admin) {
      return NextResponse.json(
        { success: false, error: "غير مصرح" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const id = parseInt(body?.id);
    const status = String(body?.status || "").trim();

    // ✅ التحقق من البيانات
    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "بيانات غير مكتملة" },
        { status: 400 }
      );
    }

    const allowedStatuses = ["pending", "approved", "rejected", "contacted"];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: "حالة غير صحيحة" },
        { status: 400 }
      );
    }

    // ✅ تحديث الحالة
    const result = await pool.query(
      `UPDATE public.supplier_registrations 
       SET status = $1 
       WHERE id = $2 
       RETURNING id, status, updated_at`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "الطلب غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "تم تحديث الحالة بنجاح",
      data: result.rows[0],
    });

  } catch (e) {
    console.error("Admin supplier status update error:", e);
    return NextResponse.json(
      { success: false, error: "خطأ في الخادم", details: String(e?.message || e) },
      { status: 500 }
    );
  }
}

// ✅ حذف طلب
export async function DELETE(req) {
  try {
    // ✅ التحقق من صلاحيات الأدمن
    const store = await cookies();
    const token = store.get(COOKIE_NAME)?.value;
    const admin = requireAdminFromToken(token);

    if (!admin) {
      return NextResponse.json(
        { success: false, error: "غير مصرح" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get("id"));

    if (!id) {
      return NextResponse.json(
        { success: false, error: "معرف غير صحيح" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `DELETE FROM public.supplier_registrations WHERE id = $1 RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "الطلب غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "تم حذف الطلب بنجاح",
    });

  } catch (e) {
    console.error("Admin supplier delete error:", e);
    return NextResponse.json(
      { success: false, error: "خطأ في الخادم", details: String(e?.message || e) },
      { status: 500 }
    );
  }
}