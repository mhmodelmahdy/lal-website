import { NextResponse } from "next/server";
import { getAdminOrNull } from "@/lib/adminGuard";
import {
  uploadNewsImageToR2,
  validateNewsImageMeta,
  validateNewsImageSignature,
} from "@/lib/r2";

export const runtime = "nodejs";

export async function POST(req) {
  const admin = await getAdminOrNull();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file !== "object" || typeof file.arrayBuffer !== "function") {
      return NextResponse.json({ success: false, error: "Image file is required" }, { status: 400 });
    }

    const fileName = String(file.name || "").trim();
    const mimeType = String(file.type || "").trim().toLowerCase();
    const size = Number(file.size || 0);

    const metaValidation = validateNewsImageMeta({ fileName, mimeType, size });
    if (!metaValidation.ok) {
      return NextResponse.json({ success: false, error: metaValidation.error }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const signatureValidation = validateNewsImageSignature(buffer, mimeType);
    if (!signatureValidation.ok) {
      return NextResponse.json({ success: false, error: signatureValidation.error }, { status: 400 });
    }

    const uploaded = await uploadNewsImageToR2({
      fileName,
      mimeType,
      data: buffer,
    });

    return NextResponse.json({
      success: true,
      data: {
        key: uploaded.key,
        url: uploaded.publicUrl,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error?.message || "Upload failed") },
      { status: 500 }
    );
  }
}
