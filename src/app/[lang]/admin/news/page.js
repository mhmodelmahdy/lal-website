"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, Newspaper } from "lucide-react";

export default function NewsClient({ lang }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const t = (ar, en) => (lang === "ar" ? ar : en);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = () => {
    const stored = localStorage.getItem("lal_news");
    if (stored) {
      const newsData = JSON.parse(stored);
      setNews(newsData.sort((a, b) => new Date(b.date) - new Date(a.date)));
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse"
              >
                <div className="h-48 bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-20 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

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
              {t(
                "سننشر التحديثات والأخبار هنا قريباً",
                "We'll post updates and news here soon"
              )}
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
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all"
            >
              {/* Image */}
              {item.image && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={lang === "ar" ? item.titleAr : item.titleEn}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                {/* Date */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <Calendar size={16} />
                  <time>
                    {new Date(item.date).toLocaleDateString(
                      lang === "ar" ? "ar-EG" : "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </time>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-navy mb-3 line-clamp-2">
                  {lang === "ar" ? item.titleAr : item.titleEn}
                </h3>

                {/* Content Preview */}
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {lang === "ar" ? item.contentAr : item.contentEn}
                </p>

                {/* Read More */}
                <motion.button
                  whileHover={{ x: lang === "ar" ? -5 : 5 }}
                  className="flex items-center gap-2 text-navy font-medium hover:text-gold transition-colors"
                >
                  {t("اقرأ المزيد", "Read More")}
                  <ArrowRight
                    size={18}
                    className={lang === "ar" ? "rotate-180" : ""}
                  />
                </motion.button>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Show more button if there are many items */}
        {news.length > 6 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-navy to-navy-dark text-white font-bold rounded-xl hover:shadow-lg transition-shadow"
            >
              {t("عرض المزيد", "Load More")}
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
}