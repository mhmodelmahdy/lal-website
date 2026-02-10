// src/app/[lang]/page.js
import HomeClient from "../../components/home/HomeClient";
import { getDictionary } from "../../i18n/getDictionary";

export default async function HomePage({ params }) {
  const { lang: rawLang } = await params;
  const lang = rawLang === "en" ? "en" : "ar";

  const dict = getDictionary(lang);
  return <HomeClient lang={lang} messages={dict.Home} />;
}
