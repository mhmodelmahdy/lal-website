"use client";

import { useState, useEffect } from "react";
import TopBar from "./TopBar";
import Header from "./Header";

export default function BrandHeader({ lang, dict, pathname }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={[
        "sticky top-0 z-50 transition-shadow duration-300",
        scrolled ? "shadow-lg shadow-navy/8" : ""
      ].join(" ")}
    >
      <TopBar lang={lang} pathname={pathname} />
      <div className="bg-white">
        <Header key={pathname} lang={lang} dict={dict} pathname={pathname} />
      </div>
    </div>
  );
}
