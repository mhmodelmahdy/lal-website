"use client";

import { usePathname } from "next/navigation";
import { Mail, Phone } from "lucide-react";
import LanguageSwitch from "./LanguageSwitch";
import { company } from "../data/company";

export default function TopBar({ lang, pathname, containerClassName }) {
  const currentPathname = usePathname();
  const safePathname = pathname ?? currentPathname ?? `/${lang}`;
  const containerPadding = containerClassName ?? "px-4";
  const isRTL = lang === "ar";

  const phone = company.phones?.[0];
  const email = company.email?.[lang] || company.email?.en || company.email;

  return (
    <div className="bg-navy-dark text-white">
      <div
        className={[
          `mx-auto max-w-7xl ${containerPadding} py-2 flex gap-2`,
          "flex-col sm:flex-row sm:items-center sm:justify-between",
          isRTL ? "sm:flex-row-reverse" : "",
        ].join(" ")}
      >
        <div
          className={[
            "flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] sm:text-xs text-white/80",
            isRTL ? "justify-end" : "",
          ].join(" ")}
        >
          {phone && (
            <a href={`tel:${phone}`} className="inline-flex items-center gap-2 hover:text-gold transition-colors">
              <Phone size={14} className="text-gold" />
              <span dir="ltr" style={{ unicodeBidi: "plaintext" }}>
                {phone}
              </span>
            </a>
          )}
          {email && (
            <a href={`mailto:${email}`} className="inline-flex items-center gap-2 hover:text-gold transition-colors">
              <Mail size={14} className="text-gold" />
              <span dir="ltr" style={{ unicodeBidi: "plaintext" }}>
                {email}
              </span>
            </a>
          )}
        </div>

        <div className={isRTL ? "self-start sm:self-auto" : "self-end sm:self-auto"}>
          <LanguageSwitch lang={lang} pathname={safePathname} />
        </div>
      </div>
    </div>
  );
}
