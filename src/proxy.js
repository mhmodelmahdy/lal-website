import { NextResponse } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;
const locales = ["ar", "en"];
const defaultLocale = "ar";

export default function proxy(req) {
  const { pathname } = req.nextUrl;

  // ignore next internals and public files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // already has locale
  const hasLocale = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (hasLocale) return NextResponse.next();

  // detect from accept-language
  const accept = req.headers.get("accept-language") || "";
  const preferred = accept.toLowerCase().includes("en") ? "en" : defaultLocale;

  req.nextUrl.pathname = `/${preferred}${pathname}`;
  return NextResponse.redirect(req.nextUrl);
}

export const config = {
  matcher: ["/((?!_next).*)"],
};
