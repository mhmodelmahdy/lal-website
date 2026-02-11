"use client";

import { motion } from "framer-motion";
import { Calendar, ArrowRight, Newspaper } from "lucide-react";

export default function NewsClient({ lang, initialNews = [] }) {
  const news = Array.isArray(initialNews) ? initialNews : [];
  const t = (ar, en) => (lang === "ar" ? ar : en);

  if (news.length === 0) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center"
          >
            <Newspaper size={64} className="text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-navy mb-3">
              {t("لا توجد أخبار حالياً", "No News Available")}
            </h3>
            <p className="text-gray-500">
              {t("سننشر التحديثات والأخبار هنا قريباً", "We'll post updates and news here soon")}
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item, idx) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.06 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all"
            >
              {item.image && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={lang === "ar" ? item.title_ar : item.title_en}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
              )}

              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <Calendar size={16} />
                  <time>
                    {new Date(item.date).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>

                <h3 className="text-xl font-bold text-navy mb-3 line-clamp-2">
                  {lang === "ar" ? item.title_ar : item.title_en}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {lang === "ar" ? item.content_ar : item.content_en}
                </p>

                <motion.button
                  whileHover={{ x: lang === "ar" ? -5 : 5 }}
                  className="flex items-center gap-2 text-navy font-medium hover:text-gold transition-colors"
                  type="button"
                >
                  {t("اقرأ المزيد", "Read More")}
                  <ArrowRight size={18} className={lang === "ar" ? "rotate-180" : ""} />
                </motion.button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
