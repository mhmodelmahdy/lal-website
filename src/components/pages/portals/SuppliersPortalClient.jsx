"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Package, FileText, CheckCircle, Send, ClipboardList } from "lucide-react";

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.45 } } };

export default function SuppliersPortalClient({ lang }) {
    const t = (ar, en) => (lang === "ar" ? ar : en);
    const [sent, setSent] = useState(false);
    const [form, setForm] = useState({ company: "", contact: "", email: "", products: "", message: "" });

    const handleSubmit = (e) => {
        e.preventDefault();
        setSent(true);
        setTimeout(() => setSent(false), 4000);
        setForm({ company: "", contact: "", email: "", products: "", message: "" });
    };

    const requirements = [
        t("شهادة تسجيل الشركة سارية المفعول", "Valid company registration certificate"),
        t("قائمة بالمنتجات أو الخدمات المقدمة", "List of products or services offered"),
        t("خبرة لا تقل عن سنتين في المجال", "Minimum 2 years experience in the field"),
        t("الالتزام بمعايير الجودة والسلامة", "Commitment to quality and safety standards"),
        t("القدرة على التوريد في المواعيد المحددة", "Ability to deliver on time"),
    ];

    return (
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="mx-auto max-w-6xl px-4 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Requirements */}
                <motion.div variants={itemVariants} className="lg:col-span-2 space-y-5">
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <ClipboardList size={22} className="text-gold" />
                            <h3 className="text-lg font-bold text-navy-dark">{t("متطلبات التسجيل", "Registration Requirements")}</h3>
                        </div>
                        <ul className="space-y-2">
                            {requirements.map((r) => (
                                <motion.li key={r} whileHover={{ x: lang === "ar" ? -4 : 4 }}
                                    className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm text-gray-700">
                                    <CheckCircle size={16} className="text-gold shrink-0 mt-0.5" />
                                    <span className="leading-6">{r}</span>
                                </motion.li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-gradient-to-br from-navy-dark to-navy rounded-2xl p-6 text-white">
                        <div className="flex items-center gap-3 mb-3">
                            <Package size={22} className="text-gold" />
                            <h3 className="font-bold text-lg">{t("مجالات التوريد", "Supply Areas")}</h3>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {[
                                t("الأجهزة الطبية", "Medical Equipment"),
                                t("المعدات الصناعية", "Industrial Equipment"),
                                t("المواد الزراعية", "Agricultural Materials"),
                                t("المواد الغذائية", "Food Products"),
                                t("قطع الغيار", "Spare Parts"),
                            ].map((s) => (
                                <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-white/80">{s}</span>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Registration Form */}
                <motion.div variants={itemVariants} className="lg:col-span-3">
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <FileText size={22} className="text-gold" />
                            <h2 className="text-2xl font-bold text-navy-dark">{t("نموذج تسجيل مورد", "Supplier Registration Form")}</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-navy focus:ring-2 focus:ring-navy/10 outline-none transition text-sm"
                                    placeholder={t("اسم الشركة", "Company Name")} />
                                <input type="text" required value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-navy focus:ring-2 focus:ring-navy/10 outline-none transition text-sm"
                                    placeholder={t("اسم المسؤول", "Contact Person")} />
                            </div>
                            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-navy focus:ring-2 focus:ring-navy/10 outline-none transition text-sm"
                                placeholder={t("البريد الإلكتروني", "Email")} />
                            <input type="text" required value={form.products} onChange={(e) => setForm({ ...form, products: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-navy focus:ring-2 focus:ring-navy/10 outline-none transition text-sm"
                                placeholder={t("المنتجات / الخدمات المقدمة", "Products / Services Offered")} />
                            <textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-navy focus:ring-2 focus:ring-navy/10 outline-none transition text-sm resize-none"
                                placeholder={t("ملاحظات إضافية...", "Additional notes...")} />
                            <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                className="w-full px-6 py-4 bg-gradient-to-r from-navy to-navy-dark text-white font-bold rounded-xl hover:shadow-lg transition-shadow flex items-center justify-center gap-2">
                                {sent ? <><CheckCircle size={18} />{t("تم التسجيل!", "Registered!")}</> : <><Send size={18} />{t("تسجيل", "Register")}</>}
                            </motion.button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
