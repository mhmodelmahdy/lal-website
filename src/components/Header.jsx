"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import LanguageSwitch from "./LanguageSwitch";

export default function Header({ lang, dict, pathname, logoSide = "right" }) {
  // في العربي اللوجو يمين => احجز مساحة يمين وخلّي المنيو ناحية الشمال (justify-end لليمين؟ لا)
  // في RTL: "justify-end" يروح للشمال فعليًا، فده اللي نحتاجه عشان المنيو يبقى في الناحية المقابلة للوجو.
  const justify = "justify-start";

  // مساحة اللوجو حسب جهته
  const sidePadding =
    logoSide === "right"
      ? "pr-[220px] md:pr-[240px]"
      : "pl-[220px] md:pl-[240px]";

  const nav = [
    { href: `/${lang}/about`, label: dict.nav.about },
    { href: `/${lang}/services`, label: dict.nav.services },
    { href: `/${lang}/management`, label: dict.nav.management },
    { href: `/${lang}/news`, label: dict.nav.news },
    { href: `/${lang}/contact`, label: dict.nav.contact },
  ];

  return (
    <motion.header
      initial={{ y: -6, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.28, delay: 0.04 }}
      className="bg-white"
    >
      <div className={`mx-auto max-w-7xl px-4 h-16 flex items-center gap-4 ${justify} ${sidePadding}`}>
        <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-blue-900 transition">
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Language على نفس جهة المنيو (المقابلة للوجو) */}
        <div>
          <LanguageSwitch lang={lang} pathname={pathname} />
        </div>
      </div>
    </motion.header>
  );
}
