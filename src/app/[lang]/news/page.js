import PageTitle from "../../../components/PageTitle";
import Image from "next/image";

export default async function NewsPage({ params }) {
  const { lang: rawLang } = await params;
  const lang = rawLang === "en" ? "en" : "ar";

  const { pool } = await import("@/lib/db");

  const res = await pool.query(
    `select id, title_ar, title_en, content_ar, content_en, image, date
      from public.news
      where is_published = true
      order by date desc, id desc`
  );

  const itemsRaw = res.rows || [];

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
        {/* جعلنا الحاوية max-w-4xl لتكون القراءة مريحة في المنتصف وليست عريضة جداً */}
        <div className="container mx-auto px-4 max-w-4xl">
          {items.length === 0 ? (
            <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center text-gray-500">
              {lang === "en" ? "No news yet." : "لا توجد أخبار حالياً."}
            </div>
          ) : (
            <div className="flex flex-col gap-10">
              {items.map((n) => (
                <article
                  key={n.id}
                  className="bg-white border border-gray-100 rounded-3xl shadow-sm p-6 md:p-8 overflow-hidden"
                >
                  {/* العنوان والتاريخ */}
                  <div className="mb-6">
                    <div className="text-sm text-gray-500 mb-2 font-medium">
                      {new Date(n.date).toLocaleDateString(
                        lang === "ar" ? "ar-EG" : "en-US",
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }
                      )}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-navy leading-tight">
                      {n.title}
                    </h2>
                  </div>

                  {/* الصورة: تظهر بالكامل وبأبعادها الحقيقية */}
                  {n.image && (
                    <div className="mb-8 w-full">
                      <Image
                        src={n.image}
                        alt={n.title}
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-full h-auto rounded-xl border border-gray-100"
                        priority={items.indexOf(n) === 0} // تحميل الصورة الأولى بسرعة
                      />
                    </div>
                  )}

                  {/* المحتوى: يظهر بالكامل مع الحفاظ على التنسيق والأسطر */}
                  <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {n.content}
                  </div>
                  
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}