import PageTitle from "../../../components/PageTitle";
import { services } from "../../../data/services";
import ServicesClient from "../../../components/pages/ServicesClient";

export default async function ServicesPage({ params }) {
  const { lang: rawLang } = await params;
  const lang = rawLang === "en" ? "en" : "ar";

  return (
    <>
      <PageTitle
        title={lang === "en" ? "Products & Services" : "المنتجات والخدمات"}
        subtitle={lang === "en" ? "Our company activities and business areas." : "مجالات وأنشطة الشركة."}
      />
      <ServicesClient lang={lang} services={services} />
    </>
  );
}
