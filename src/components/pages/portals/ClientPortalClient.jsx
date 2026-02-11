"use client";

import { motion } from "framer-motion";
import { Package, Truck, FileText, Phone, Mail, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.45 } }
};

export default function ClientPortalClient({ lang }) {
    const t = (ar, en) => (lang === "ar" ? ar : en);
    const arrow = lang === "ar" ? <ArrowLeft size={16} /> : <ArrowRight size={16} />;

    const features = [
        { icon: Package, title: t("استعراض المنتجات", "Browse Products"), desc: t("تصفح كامل المنتجات والخدمات المتاحة", "Browse all available products and services"), color: "from-blue-500 to-indigo-600" },
        { icon: Truck, title: t("تتبع الطلبات", "Track Orders"), desc: t("تتبع حالة طلباتك وشحناتك في الوقت الفعلي", "Track your orders and shipments in real-time"), color: "from-emerald-500 to-teal-600" },
        { icon: FileText, title: t("الفواتير والمستندات", "Invoices & Documents"), desc: t("الوصول إلى فواتيرك ومستنداتك التجارية", "Access your invoices and business documents"), color: "from-amber-500 to-orange-600" },
    ];

    return (
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="mx-auto max-w-6xl px-4 py-10">
            <div className="grid gap-5 md:grid-cols-3 mb-8">
                {features.map((f) => {
                    const Icon = f.icon;
                    return (
                        <motion.div key={f.title} variants={itemVariants} whileHover={{ y: -6 }}
                            className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all group">
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                                <Icon size={24} />
                            </div>
                            <h3 className="font-bold text-navy-dark text-lg mb-2">{f.title}</h3>
                            <p className="text-text-muted text-sm leading-7">{f.desc}</p>
                        </motion.div>
                    );
                })}
            </div>

            <motion.div variants={itemVariants} className="bg-gradient-to-br from-navy-dark to-navy rounded-2xl p-8 text-white text-center">
                <h3 className="text-2xl font-bold mb-3">{t("هل تحتاج مساعدة؟", "Need Help?")}</h3>
                <p className="text-white/70 mb-6">{t("تواصل مع فريق خدمة العملاء لدينا", "Contact our customer service team")}</p>
                <div className="flex flex-wrap justify-center gap-3">
                    <motion.a whileHover={{ scale: 1.05 }} href="tel:00249123704221" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 rounded-xl hover:bg-white/20 transition text-sm">
                        <Phone size={16} /> 00249123704221
                    </motion.a>
                    <motion.div whileHover={{ scale: 1.05 }}>
                        <Link href={`/${lang}/contact`} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold rounded-xl hover:bg-gold-dark transition text-sm font-semibold">
                            {t("صفحة التواصل", "Contact Page")} {arrow}
                        </Link>
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    );
}
