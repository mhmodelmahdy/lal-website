"use client";

import Image from "next/image";
import TopBar from "./TopBar";
import Header from "./Header";

export default function BrandHeader({ lang, dict, pathname }) {
  const isRTL = lang === "ar";
  const logoSide = isRTL ? "left" : "right";

  return (
    <div className="relative bg-white">
      {/* TopBar: احجز مساحة ناحية اللوجو */}
      <TopBar lang={lang} reserveSide={logoSide} />

      {/* Header: المنيو في الناحية المقابلة للوجو */}
      <Header lang={lang} dict={dict} pathname={pathname} logoSide={logoSide} />

      {/* Logo Overlay: يمسك الاتنين */}
      <div className={`absolute top-0 h-full flex items-center ${isRTL ? "left-4" : "right-4"}`}>
        <Image
          src="/logo-wide.png"
          alt="Company Logo"
          width={185}
          height={90}
          priority
          className="object-contain"
        />
      </div>
    </div>
  );
}
