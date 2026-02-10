import PageTitle from "../../../components/PageTitle";

export default async function NewsPage({ params }) {
  const { lang: rawLang } = await params;
  const lang = rawLang === "en" ? "en" : "ar";

  return (
    <>
      <PageTitle
        title={lang === "en" ? "News" : "الأخبار"}
        subtitle={lang === "en" ? "Company updates and announcements." : "آخر تحديثات وإعلانات الشركة."}
      />

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="bg-white border rounded-2xl p-6 text-gray-600 leading-8">
          {lang === "en" ? "News section will be updated soon." : "سيتم تحديث قسم الأخبار قريبًا."}
        </div>
      </div>
    </>
  );
}
