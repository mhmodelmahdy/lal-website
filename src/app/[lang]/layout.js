import "../globals.css";
import Shell from "../../components/Shell";
import { getDir } from "../../i18n/getDictionary";
import { Analytics } from "@vercel/analytics/next";

export async function generateMetadata({ params }) {
  const { lang: rawLang } = await params;
  const lang = rawLang === "en" ? "en" : "ar";

  return {
    title:
      lang === "en"
        ? "Lal Multi Activities Co. Ltd"
        : "شركة لال للأنشطة المتعددة المحدودة",

    description:
      lang === "en"
        ? "Export, Import, General Trading, General Supplies"
        : "التصدير والاستيراد والتجارة العامة والتوريدات العمومية",

    icons: {
      icon: "/icon.png",      // الفافيكون الأساسي
      shortcut: "/icon.png",  // للمتصفحات القديمة
      apple: "/icon.png",     // iPhone/iPad
    },
  };
}

export default async function LangLayout({ children, params }) {
  const { lang: rawLang } = await params;
  const lang = rawLang === "en" ? "en" : "ar";
  const dir = getDir(lang);

  return (
    <html key={lang} lang={lang} dir={dir}>
      <body className="bg-gray-50 text-gray-900">
        <Shell lang={lang}>{children}</Shell>
        <Analytics />
      </body>
    </html>
  );
}
