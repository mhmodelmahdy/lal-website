import PageTitle from "../../../components/PageTitle";
import { company } from "../../../data/company";
import { about } from "../../../data/about";
import AboutClient from "../../../components/pages/AboutClient";

export default async function AboutPage({ params }) {
  const { lang: rawLang } = await params;
  const lang = rawLang === "en" ? "en" : "ar";

  return (
    <>
      <PageTitle
        title={lang === "en" ? "About Us" : "من نحن"}
        subtitle={company.aboutShort[lang]}
      />
      <AboutClient lang={lang} about={about} company={company} />
    </>
  );
}
