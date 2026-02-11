import PageTitle from "../../../components/PageTitle";
import SupportClient from "../../../components/pages/SupportClient";

export default async function SupportPage({ params }) {
  const { lang: rawLang } = await params;
  const lang = rawLang === "en" ? "en" : "ar";

  return (
    <>
      <PageTitle
        title={lang === "en" ? "Support & Help" : "الدعم والمساعدة"}
        subtitle={lang === "en" ? "Frequently asked questions and support requests." : "الأسئلة الشائعة وطلبات الدعم."}
      />
      <SupportClient lang={lang} />
    </>
  );
}
