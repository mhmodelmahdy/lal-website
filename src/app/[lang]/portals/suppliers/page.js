import PageTitle from "../../../../components/PageTitle";
import SuppliersPortalClient from "../../../../components/pages/portals/SuppliersPortalClient";

export default async function SuppliersPortalPage({ params }) {
    const { lang: rawLang } = await params;
    const lang = rawLang === "en" ? "en" : "ar";

    return (
        <>
            <PageTitle
                title={lang === "en" ? "Suppliers Portal" : "بوابة الموردين"}
                subtitle={lang === "en" ? "Register as a supplier and submit your offers." : "سجّل كمورد وقدّم عروضك."}
            />
            <SuppliersPortalClient lang={lang} />
        </>
    );
}
