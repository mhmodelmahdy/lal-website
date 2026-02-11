import PageTitle from "../../../components/PageTitle";
import NewsClient from "../../../components/pages/NewsClient";

export default async function NewsPage({ params }) {
  const { lang: rawLang } = await params;
  const lang = rawLang === "en" ? "en" : "ar";

  return (
    <>
      <PageTitle
        title={lang === "en" ? "News & Updates" : "الأخبار والتحديثات"}
        subtitle={lang === "en" ? "Latest company updates and announcements." : "آخر تحديثات وإعلانات الشركة."}
      />
      <NewsClient lang={lang} />
    </>
  );
}
