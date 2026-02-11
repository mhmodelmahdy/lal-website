import PageTitle from "../../../../components/PageTitle";
import ClientPortalClient from "../../../../components/pages/portals/ClientPortalClient";

export default async function ClientPortalPage({ params }) {
    const { lang: rawLang } = await params;
    const lang = rawLang === "en" ? "en" : "ar";

    return (
        <>
            <PageTitle
                title={lang === "en" ? "Client Portal" : "بوابة العملاء"}
                subtitle={lang === "en" ? "Track orders and explore our products." : "تتبع الطلبات واستعرض منتجاتنا."}
            />
            <ClientPortalClient lang={lang} />
        </>
    );
}
