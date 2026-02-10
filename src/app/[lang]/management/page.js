import PageTitle from "../../../components/PageTitle";
import { management } from "../../../data/management";

export default async function ManagementPage({ params }) {
  const { lang: rawLang } = await params;
  const lang = rawLang === "en" ? "en" : "ar";

  return (
    <>
      <PageTitle
        title={lang === "en" ? "Management Structure" : "الهيكل الإداري"}
        subtitle={lang === "en" ? "Key leadership and department heads." : "الإدارة العليا ورؤساء الأقسام."}
      />

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-3 md:grid-cols-2">
          {management.map((m) => (
            <div key={m.en} className="bg-white border rounded-2xl p-5">
              <p className="leading-8">{m[lang]}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
