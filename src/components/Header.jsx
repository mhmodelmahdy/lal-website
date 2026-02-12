"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Menu, X } from "lucide-react";

function isActivePath(pathname, href) {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  if (pathname === href) return true;
  return href !== "/" && pathname.startsWith(href + "/");
}

export default function Header({ lang, dict, pathname, containerClassName }) {
  const [open, setOpen] = useState(false);

  const nav = useMemo(() => {
    const t = (key, fallback) => dict?.nav?.[key] ?? fallback;
    return [
      { href: `/${lang}`, label: t("home", lang === "ar" ? "الرئيسية" : "Home") },
      { href: `/${lang}/about`, label: t("about", lang === "ar" ? "عن الشركة" : "About") },
      { href: `/${lang}/products`, label: t("Products", lang === "ar" ? "المنتجات" : "Products") },
      { href: `/${lang}/services`, label: t("services", lang === "ar" ? "الخدمات" : "Services") },
      { href: `/${lang}/management`, label: t("management", lang === "ar" ? "الإدارة" : "Management") },
      { href: `/${lang}/news`, label: t("news", lang === "ar" ? "الأخبار" : "News") },
      { href: `/${lang}/contact`, label: t("contact", lang === "ar" ? "تواصل" : "Contact") },
      { href: `/${lang}/support`, label: t("support", lang === "ar" ? "الدعم" : "Support") },
    ];
  }, [dict, lang]);

  const wrapperPadding = containerClassName ?? "px-4";

  return (
    <header className="border-b border-gray-100">
      <div className="mx-auto max-w-7xl">
        <div className={`relative flex items-center justify-between gap-4 py-3 ${wrapperPadding}`}>
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 text-navy hover:bg-gray-50 transition-colors"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>

          <Link
            href={`/${lang}`}
            className="md:hidden absolute left-1/2 -translate-x-1/2"
            aria-label="Home"
          >
            <Image
              src="/logo-wide.png"
              alt="Lal Multi Activities"
              width={160}
              height={64}
              priority
              className="h-8 w-auto object-contain"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {nav.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "text-sm font-medium transition-colors",
                    active ? "text-navy" : "text-gray-600 hover:text-navy",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Link
            href={`/${lang}/contact`}
            className="hidden md:inline-flex items-center justify-center px-4 py-2 rounded-xl bg-navy text-white text-sm font-semibold hover:bg-navy-dark transition-colors"
          >
            {dict?.nav?.contact ?? (lang === "ar" ? "تواصل" : "Contact")}
          </Link>
        </div>

        {open && (
          <div className="md:hidden border-t border-gray-100 bg-white">
            <nav className={`py-3 flex flex-col gap-1 ${wrapperPadding}`}>
              {nav.map((item) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={[
                      "px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                      active ? "bg-navy/10 text-navy" : "text-gray-700 hover:bg-gray-50",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
