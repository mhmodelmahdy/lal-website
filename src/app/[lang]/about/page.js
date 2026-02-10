import PageTitle from "../../../components/PageTitle";
import { company } from "../../../data/company";
import { about } from "../../../data/about";

export default async function AboutPage({ params }) {
  const { lang: rawLang } = await params;
  const lang = rawLang === "en" ? "en" : "ar";

  return (
    <>
      <PageTitle
        title={lang === "en" ? "About" : "من نحن"}
        subtitle={company.aboutShort[lang]}
      />

      <div className="mx-auto max-w-6xl px-4 py-8 grid gap-4">
        <section className="bg-white border rounded-2xl p-6">
          <h2 className="text-xl font-semibold">{lang === "en" ? "Vision" : "رؤيتنا"}</h2>
          <p className="mt-3 leading-8 text-gray-700">{about.vision[lang]}</p>
        </section>

        <section className="bg-white border rounded-2xl p-6">
          <h2 className="text-xl font-semibold">{lang === "en" ? "Mission" : "رسالتنا"}</h2>
          <p className="mt-3 leading-8 text-gray-700">{about.mission[lang]}</p>
        </section>

        <section className="bg-white border rounded-2xl p-6">
          <h2 className="text-xl font-semibold">{lang === "en" ? "Objectives" : "أهدافنا"}</h2>

          <h3 className="mt-4 font-semibold">{lang === "en" ? "General" : "أهداف عامة"}</h3>
          <ul className="mt-2 grid gap-2 md:grid-cols-2">
            {about.objectives.general[lang].map((x) => (
              <li key={x} className="bg-gray-50 border rounded-xl p-3">{x}</li>
            ))}
          </ul>

          <h3 className="mt-6 font-semibold">{lang === "en" ? "Specific" : "أهداف خاصة"}</h3>
          <ul className="mt-2 grid gap-2 md:grid-cols-2">
            {about.objectives.specific[lang].map((x) => (
              <li key={x} className="bg-gray-50 border rounded-xl p-3">{x}</li>
            ))}
          </ul>
        </section>

        <section className="bg-white border rounded-2xl p-6">
          <h2 className="text-xl font-semibold">{lang === "en" ? "Values" : "قيمنا"}</h2>
          <ul className="mt-3 grid gap-2 md:grid-cols-2">
            {about.values[lang].map((x) => (
              <li key={x} className="bg-gray-50 border rounded-xl p-3">{x}</li>
            ))}
          </ul>
        </section>

        <section className="bg-white border rounded-2xl p-6">
          <h2 className="text-xl font-semibold">{lang === "en" ? "Work Strategy" : "استراتيجية العمل"}</h2>
          <ul className="mt-3 grid gap-2">
            {about.strategy[lang].map((x) => (
              <li key={x} className="bg-gray-50 border rounded-xl p-3">{x}</li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
