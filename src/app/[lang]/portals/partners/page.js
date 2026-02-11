import PageTitle from "../../../../components/PageTitle";
import PartnersPortalClient from "../../../../components/pages/portals/PartnersPortalClient";

export default async function PartnersPortalPage({ params }) {
    const { lang: rawLang } = await params;
    const lang = rawLang === "en" ? "en" : "ar";

    return (
        <>
            <PageTitle
                title={lang === "en" ? "Partners Portal" : "بوابة الشركاء"}
                subtitle={lang === "en" ? "Explore partnership opportunities." : "اكتشف فرص الشراكة والتعاون."}
            />
            <PartnersPortalClient lang={lang} />
        </>
    );
}
