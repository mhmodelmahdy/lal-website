import PageTitle from "../../../components/PageTitle";

export default async function SupportPage({ params }) {
  const { lang: rawLang } = await params;
  const lang = rawLang === "en" ? "en" : "ar";

  return (
    <>
      <PageTitle
        title={lang === "en" ? "Support" : "الدعم والمساعدة"}
        subtitle={lang === "en" ? "Frequently asked questions and support requests." : "الأسئلة الشائعة وطلبات الدعم."}
      />

      <div className="mx-auto max-w-6xl px-4 py-8 grid gap-4">
        <div className="bg-white border rounded-2xl p-6 text-gray-600 leading-8">
          {lang === "en"
            ? "Support content will be added. You can also contact us from the Contact page."
            : "سيتم إضافة محتوى الدعم. يمكنكم التواصل معنا من صفحة تواصل معنا."}
        </div>
      </div>
    </>
  );
}
