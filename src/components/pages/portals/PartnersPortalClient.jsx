"use client";

import { motion } from "framer-motion";
import { Handshake, Globe, TrendingUp, Shield, CheckCircle } from "lucide-react";

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.45 } } };

export default function PartnersPortalClient({ lang }) {
    const t = (ar, en) => (lang === "ar" ? ar : en);

    const benefits = [
        t("الوصول إلى شبكة واسعة من الموردين والمستوردين", "Access to a wide network of suppliers and importers"),
        t("دعم لوجستي متكامل من الشحن وحتى التوصيل", "Comprehensive logistics support from shipping to delivery"),
        t("أسعار تنافسية وشروط تعاقد مرنة", "Competitive prices and flexible contract terms"),
        t("خبرة واسعة في الأسواق السودانية والعالمية", "Extensive experience in Sudanese and global markets"),
        t("التزام بأعلى معايير الجودة والاحترافية", "Commitment to the highest quality and professionalism standards"),
        t("فريق متخصص لدعم الشركاء على مدار الساعة", "Dedicated team to support partners around the clock"),
    ];

    const areas = [
        { icon: Globe, title: t("التجارة الدولية", "International Trade"), color: "from-blue-500 to-indigo-600" },
        { icon: TrendingUp, title: t("تطوير الأعمال", "Business Development"), color: "from-emerald-500 to-teal-600" },
        { icon: Shield, title: t("التوريدات العمومية", "General Supplies"), color: "from-amber-500 to-orange-600" },
    ];

    return (
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="mx-auto max-w-6xl px-4 py-10">
            {/* Partnership Areas */}
            <div className="grid gap-5 md:grid-cols-3 mb-8">
                {areas.map((a) => {
                    const Icon = a.icon;
                    return (
                        <motion.div key={a.title} variants={itemVariants} whileHover={{ y: -6 }}
                            className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all group">
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${a.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                                <Icon size={24} />
                            </div>
                            <h3 className="font-bold text-navy-dark text-lg">{a.title}</h3>
                        </motion.div>
                    );
                })}
            </div>

            {/* Benefits */}
            <motion.div variants={itemVariants} className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                    <Handshake size={24} className="text-gold" />
                    <h2 className="text-2xl font-bold text-navy-dark">{t("مزايا الشراكة", "Partnership Benefits")}</h2>
                </div>
                <div className="grid gap-2.5 md:grid-cols-2">
                    {benefits.map((b) => (
                        <motion.div key={b} whileHover={{ x: lang === "ar" ? -4 : 4 }}
                            className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-navy/5 transition-colors">
                            <CheckCircle size={18} className="text-gold shrink-0 mt-0.5" />
                            <span className="text-gray-700 text-sm leading-7">{b}</span>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}
