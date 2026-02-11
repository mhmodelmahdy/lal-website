import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();

    const companyName = String(body?.company || "").trim();
    const contactPerson = String(body?.contact || "").trim();
    const contactInfo = String(body?.contactInfo || "").trim();
    const products = String(body?.products || "").trim();
    const message = String(body?.message || "").trim() || null;

    // التحقق من البيانات
    const problems = [];
    if (companyName.length < 2) problems.push("اسم الشركة يجب أن يكون حرفين على الأقل");
    if (contactPerson.length < 2) problems.push("اسم المسؤول يجب أن يكون حرفين على الأقل");
    if (contactInfo.length < 5) problems.push("معلومات التواصل غير صحيحة");
    if (products.length < 3) problems.push("يجب إدخال المنتجات/الخدمات");

    if (problems.length) {
      return NextResponse.json(
        { 
          success: false, 
          error: "بيانات غير صحيحة", 
          problems,
          received: { 
            companyName, 
            contactPerson, 
            contactInfoLen: contactInfo.length,
            productsLen: products.length 
          } 
        },
        { status: 400 }
      );
    }

    // إدراج البيانات في قاعدة البيانات
    const res = await pool.query(
      `INSERT INTO public.supplier_registrations 
       (company_name, contact_person, contact_info, products_services, additional_notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, created_at`,
      [companyName, contactPerson, contactInfo, products, message]
    );

    return NextResponse.json(
      { 
        success: true, 
        message: "تم التسجيل بنجاح",
        data: res.rows[0] 
      }, 
      { status: 201 }
    );

  } catch (e) {
    console.error("Supplier registration error:", e);
    return NextResponse.json(
      { 
        success: false, 
        error: "خطأ في الخادم", 
        details: String(e?.message || e) 
      },
      { status: 500 }
    );
  }
}