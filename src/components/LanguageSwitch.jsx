import Link from "next/link";

export default function LanguageSwitch({ lang, pathname }) {
  const nextLang = lang === "ar" ? "en" : "ar";
  const nextPath = `/${nextLang}${pathname.replace(/^\/(ar|en)/, "") || ""}`;

  return (
    <Link href={nextPath} className="px-3 py-2 rounded-lg border text-sm">
      {nextLang === "ar" ? "العربية" : "English"}
    </Link>
  );
}
