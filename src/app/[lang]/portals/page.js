import PageTitle from "../../../components/PageTitle";
import PortalsClient from "../../../components/pages/PortalsClient";

export default async function PortalsPage({ params }) {
    const { lang: rawLang } = await params;
    const lang = rawLang === "en" ? "en" : "ar";

    return (
        <>
            <PageTitle
                title={lang === "en" ? "Portals" : "البوابات"}
                subtitle={lang === "en" ? "Access your dedicated portal." : "ادخل إلى بوابتك المخصصة."}
            />
            <PortalsClient lang={lang} />
        </>
    );
}
