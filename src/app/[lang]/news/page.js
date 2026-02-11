import PageTitle from "../../../components/PageTitle";
import Link from "next/link";

export default async function NewsPage({ params }) {
  const { lang: rawLang } = await params;
  const lang = rawLang === "en" ? "en" : "ar";

  // مهم: استخدم DB مباشرة لتفادي مشاكل Invalid URL و base url
  const { pool } = await import("@/lib/db");
  const res = await pool.query(
    `select id, title_ar, title_en, content_ar, content_en, image, date
     from public.news
     where is_published = true
     order by date desc, id desc`
  );

  const itemsRaw = res.rows || [];

  // ✅ هنا بنحوّل الداتا حسب اللغة
  const items = itemsRaw.map((n) => ({
    id: n.id,
    title: lang === "ar" ? n.title_ar : n.title_en,
    content: lang === "ar" ? n.content_ar : n.content_en,
    image: n.image,
    date: n.date,
  }));

  return (
    <>
      <PageTitle
        title={lang === "en" ? "News & Updates" : "الأخبار والتحديثات"}
        subtitle={
          lang === "en"
            ? "Latest company updates and announcements."
            : "آخر تحديثات وإعلانات الشركة."
        }
      />

      <section className="py-14 bg-gray-50">
        <div className="container mx-auto px-4">
          {items.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center text-gray-500">
              {lang === "en" ? "No news yet." : "لا توجد أخبار حالياً."}
            </div>
          ) : (
            <div className="grid gap-5">
              {items.map((n) => (
                <article key={n.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                  <div className="text-sm text-gray-500 mb-2">
                    {new Date(n.date).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US")}
                  </div>

                  <h2 className="text-xl font-bold text-navy mb-3">{n.title}</h2>

                  {n.image ? (
                    <div className="mb-4">
                      {/* لو عندك next/image استخدمه، هنا بسيط */}
                      <img
                        src={n.image}
                        alt={n.title}
                        className="w-full max-h-[360px] object-cover rounded-2xl border border-gray-100"
                      />
                    </div>
                  ) : null}

                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {n.content}
                  </p>

                  {/* اختياري: رابط تفاصيل لو هتعمل صفحة تفاصيل */}
                  {/* <Link href={`/${lang}/news/${n.id}`} className="text-navy font-medium mt-4 inline-block">
                    {lang === "en" ? "Read more" : "اقرأ المزيد"}
                  </Link> */}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
