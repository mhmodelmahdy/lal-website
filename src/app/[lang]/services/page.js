import PageTitle from "../../../components/PageTitle";
import { services } from "../../../data/services";

function Block({ title, intro, items, lang, extraListTitle, extraList }) {
  return (
    <section className="bg-white border rounded-2xl p-6">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-3 leading-8 text-gray-700">{intro}</p>

      <ul className="mt-4 grid gap-2 md:grid-cols-2">
        {items.map((x) => (
          <li key={x.en} className="bg-gray-50 border rounded-xl p-3">
            {x[lang]}
          </li>
        ))}
      </ul>

      {extraList?.length ? (
        <>
          <h3 className="mt-6 font-semibold">{extraListTitle}</h3>
          <ul className="mt-2 grid gap-2 md:grid-cols-2">
            {extraList.map((x) => (
              <li key={x} className="bg-gray-50 border rounded-xl p-3">{x}</li>
            ))}
          </ul>
        </>
      ) : null}
    </section>
  );
}

export default async function ServicesPage({ params }) {
  const { lang: rawLang } = await params;
  const lang = rawLang === "en" ? "en" : "ar";

  return (
    <>
      <PageTitle
        title={lang === "en" ? "Services" : "المنتجات / الخدمات"}
        subtitle={lang === "en" ? "Our company activities and business areas." : "مجالات وأنشطة الشركة."}
      />

      <div className="mx-auto max-w-6xl px-4 py-8 grid gap-4">
        <Block
          lang={lang}
          title={services.export.title[lang]}
          intro={services.export.intro[lang]}
          items={services.export.items}
        />

        <Block
          lang={lang}
          title={services.import.title[lang]}
          intro={services.import.intro[lang]}
          items={services.import.items}
        />

        <Block
          lang={lang}
          title={services.supplies.title[lang]}
          intro={services.supplies.intro[lang]}
          items={services.supplies.items}
          extraListTitle={lang === "en" ? "Provided to" : "وذلك لصالح"}
          extraList={services.supplies.forWhom[lang]}
        />

        <Block
          lang={lang}
          title={services.thirdParty.title[lang]}
          intro={services.thirdParty.intro[lang]}
          items={services.thirdParty.items}
        />
      </div>
    </>
  );
}
