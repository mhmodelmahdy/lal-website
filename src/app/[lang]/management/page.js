import PageTitle from "../../../components/PageTitle";
import ManagementClient from "../../../components/pages/ManagementClient";

export default async function ManagementPage({ params }) {
  const { lang: rawLang } = await params;
  const lang = rawLang === "en" ? "en" : "ar";

  return (
    <>
      <PageTitle
        title={lang === "en" ? "Management Structure" : "الهيكل الإداري"}
        subtitle={
          lang === "en" 
            ? "Meet our experienced leadership team driving excellence and innovation." 
            : "تعرف على فريق القيادة المتميز الذي يقود التميز والابتكار."
        }
      />
      <ManagementClient lang={lang} />
    </>
  );
}