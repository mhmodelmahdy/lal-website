import PageTitle from "../../../components/PageTitle";
import { management } from "../../../data/management";
import ManagementClient from "../../../components/pages/ManagementClient";

export default async function ManagementPage({ params }) {
  const { lang: rawLang } = await params;
  const lang = rawLang === "en" ? "en" : "ar";

  return (
    <>
      <PageTitle
        title={lang === "en" ? "Management Structure" : "الهيكل الإداري"}
        subtitle={lang === "en" ? "Key leadership and department heads." : "الإدارة العليا ورؤساء الأقسام."}
      />
      <ManagementClient lang={lang} management={management} />
    </>
  );
}
