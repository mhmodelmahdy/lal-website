"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, X, Newspaper } from "lucide-react";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.45 } }
};

// default sample news
const defaultNews = [
    {
        id: "1",
        title: { ar: "شركة لال توسّع عملياتها في الأسواق الإقليمية", en: "Lal Expands Operations in Regional Markets" },
        body: {
            ar: "أعلنت شركة لال للأنشطة المتعددة عن خطط توسعية جديدة تشمل فتح فروع ومكاتب تمثيلية في عدد من الدول العربية والأفريقية، ضمن استراتيجيتها لتعزيز حضورها العالمي وزيادة حجم صادراتها الزراعية.",
            en: "Lal Multi Activities Co. Ltd announced new expansion plans including opening branches and representative offices in several Arab and African countries, as part of its strategy to strengthen its global presence and increase agricultural exports."
        },
        date: "2026-02-01",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop"
    },
    {
        id: "2",
        title: { ar: "اتفاقية شراكة جديدة مع موردين عالميين", en: "New Partnership Agreement with Global Suppliers" },
        body: {
            ar: "وقّعت الشركة اتفاقيات شراكة استراتيجية مع عدد من كبرى الشركات العالمية في مجالات الأجهزة الطبية والمعدات الصناعية، مما يعزز قدرتها على تلبية احتياجات السوق السوداني بمنتجات عالية الجودة.",
            en: "The company signed strategic partnership agreements with several major global companies in the fields of medical devices and industrial equipment, enhancing its ability to meet Sudanese market needs with high-quality products."
        },
        date: "2026-01-15",
        image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop"
    },
    {
        id: "3",
        title: { ar: "مشاركة شركة لال في معرض التجارة الدولية", en: "Lal Participates in International Trade Exhibition" },
        body: {
            ar: "شاركت شركة لال في معرض التجارة الدولية المقام في دبي، حيث عرضت منتجاتها الزراعية السودانية الأصيلة بما فيها الصمغ العربي والسمسم والكركدي أمام مستثمرين ومشترين من مختلف دول العالم.",
            en: "Lal participated in the International Trade Exhibition held in Dubai, showcasing its authentic Sudanese agricultural products including Gum Arabic, Sesame, and Hibiscus to investors and buyers from around the world."
        },
        date: "2026-01-05",
        image: "https://images.unsplash.com/photo-1540575467063-178a50e2fd60?w=800&auto=format&fit=crop"
    }
];

export default function NewsClient({ lang }) {
    const [news, setNews] = useState([]);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const t = (ar, en) => (lang === "ar" ? ar : en);

    useEffect(() => {
        try {
            const stored = localStorage.getItem("lal_news");
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setNews(parsed);
                    return;
                }
            }
        } catch (e) { /* ignore */ }
        setNews(defaultNews);
    }, []);

    return (
        <div className="mx-auto max-w-6xl px-4 py-10">
            {news.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white border border-gray-100 rounded-2xl p-12 text-center"
                >
                    <Newspaper size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">
                        {t("لا توجد أخبار حالياً", "No news available at the moment")}
                    </p>
                </motion.div>
            ) : (
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                >
                    {news.map((article) => (
                        <motion.article
                            key={article.id}
                            variants={itemVariants}
                            whileHover={{ y: -8 }}
                            onClick={() => setSelectedArticle(article)}
                            className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group"
                        >
                            {/* Image */}
                            {article.image && (
                                <div className="h-48 relative overflow-hidden">
                                    <img
                                        src={article.image}
                                        alt={article.title[lang]}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                    <div className="absolute bottom-3 left-3 right-3">
                                        <span className="inline-flex items-center gap-1.5 text-white/90 text-xs bg-black/30 px-2.5 py-1 rounded-full backdrop-blur-sm">
                                            <Calendar size={12} />
                                            {article.date}
                                        </span>
                                    </div>
                                </div>
                            )}

                            <div className="p-5">
                                <h3 className="text-lg font-bold text-navy-dark mb-2 group-hover:text-gold transition-colors line-clamp-2">
                                    {article.title[lang]}
                                </h3>
                                <p className="text-text-muted text-sm leading-7 line-clamp-3">
                                    {article.body[lang]}
                                </p>
                                <span className="mt-4 inline-block text-navy font-semibold text-sm group-hover:text-gold transition-colors">
                                    {t("اقرأ المزيد ←", "Read more →")}
                                </span>
                            </div>
                        </motion.article>
                    ))}
                </motion.div>
            )}

            {/* Article Modal */}
            <AnimatePresence>
                {selectedArticle && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedArticle(null)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed inset-4 md:inset-x-auto md:inset-y-8 md:max-w-3xl md:mx-auto bg-white rounded-2xl shadow-2xl z-50 overflow-y-auto"
                        >
                            {/* Close button */}
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setSelectedArticle(null)}
                                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white transition"
                            >
                                <X size={20} />
                            </motion.button>

                            {selectedArticle.image && (
                                <div className="h-64 relative">
                                    <img
                                        src={selectedArticle.image}
                                        alt={selectedArticle.title[lang]}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                </div>
                            )}

                            <div className="p-6 md:p-8">
                                <div className="flex items-center gap-2 text-text-muted text-sm mb-3">
                                    <Calendar size={14} />
                                    <span>{selectedArticle.date}</span>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold text-navy-dark mb-5">
                                    {selectedArticle.title[lang]}
                                </h2>
                                <p className="text-gray-600 leading-8 text-[15px] whitespace-pre-line">
                                    {selectedArticle.body[lang]}
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
