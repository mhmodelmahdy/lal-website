import { cookies } from "next/headers";
import { COOKIE_NAME, requireAdminFromToken } from "@/lib/adminAuth";

export async function getAdminOrNull() {
  const store = await cookies(); // مهم في Next 16
  const token = store.get(COOKIE_NAME)?.value;
  return requireAdminFromToken(token);
}
