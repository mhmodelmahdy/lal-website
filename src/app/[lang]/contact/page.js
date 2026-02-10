import PageTitle from "../../../components/PageTitle";
import { company } from "../../../data/company";

export default async function ContactPage({ params }) {
  const { lang: rawLang } = await params;
  const lang = rawLang === "en" ? "en" : "ar";

  return (
    <>
      <PageTitle
        title={lang === "en" ? "Contact" : "تواصل معنا"}
        subtitle={lang === "en" ? "We are happy to hear from you." : "يسعدنا تواصلكم معنا."}
      />

      <div className="mx-auto max-w-6xl px-4 py-8 grid gap-4">
        <section className="bg-white border rounded-2xl p-6">
          <h2 className="text-xl font-semibold">{lang === "en" ? "Phone Numbers" : "أرقام الهاتف"}</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {company.phones.map((ph) => (
              <a key={ph} href={`tel:${ph}`} className="px-3 py-2 rounded-full bg-gray-100 border text-sm">
                {ph}
              </a>
            ))}
          </div>
        </section>

        <section className="bg-white border rounded-2xl p-6">
          <h2 className="text-xl font-semibold">{lang === "en" ? "Email & Address" : "البريد والعنوان"}</h2>
          <p className="mt-3 text-gray-600 leading-8">
            {lang === "en"
              ? "Add official email and address here once provided."
              : "سيتم إضافة البريد الرسمي والعنوان هنا فور تزويدنا به."}
          </p>
        </section>
      </div>
    </>
  );
}
