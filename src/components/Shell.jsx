"use client";

import { usePathname } from "next/navigation";
import { getDictionary } from "../i18n/getDictionary";
import BrandHeader from "./BrandHeader";
import Footer from "./Footer";

export default function Shell({ lang, children }) {
  const pathname = usePathname();
  const dict = getDictionary(lang); // لازم يرجّع object فيه nav

  return (
    <>
      <BrandHeader lang={lang} dict={dict} pathname={pathname} />
      <main className="min-h-[70vh]">{children}</main>
      <Footer lang={lang} />
    </>
  );
}
