"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Phone, Mail, MapPin, Send, CheckCircle, Facebook, Linkedin, Youtube, Anchor
} from "lucide-react";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.45 } }
};

export default function ContactClient({ lang, company }) {
    const t = (ar, en) => (lang === "ar" ? ar : en);
    const [sent, setSent] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });

    const handleSubmit = (e) => {
        e.preventDefault();
        setSent(true);
        setTimeout(() => setSent(false), 4000);
        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    };

    const socials = company.socials || {};

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="mx-auto max-w-6xl px-4 py-10"
        >
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Contact Info — Left column */}
                <motion.div variants={itemVariants} className="lg:col-span-2 space-y-5">
                    {/* Phone numbers */}
                    <motion.div
                        whileHover={{ y: -3 }}
                        className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all"
                    >
                        <h3 className="font-bold text-navy-dark text-lg mb-4 flex items-center gap-2">
                            <Phone size={18} className="text-gold" />
                            {t("أرقام الهاتف", "Phone Numbers")}
                        </h3>
                        <div className="space-y-2">
                            {company.phones.map((ph) => (
                                <motion.a
                                    key={ph}
                                    href={`tel:${ph}`}
                                    whileHover={{ x: lang === "ar" ? -4 : 4 }}
                                    className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-50 hover:bg-navy/5 transition-colors text-sm font-medium"
                                >
                                    <Phone size={14} className="text-navy shrink-0" />
                                    <span dir="ltr" style={{ unicodeBidi: "plaintext" }}>{ph}</span>
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Email */}
                    <motion.div
                        whileHover={{ y: -3 }}
                        className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all"
                    >
                        <h3 className="font-bold text-navy-dark text-lg mb-4 flex items-center gap-2">
                            <Mail size={18} className="text-gold" />
                            {t("البريد الإلكتروني", "Email")}
                        </h3>
                        {company.email?.[lang] && (
                            <a
                                href={`mailto:${company.email[lang]}`}
                                className="text-navy hover:text-gold transition-colors text-sm font-medium"
                            >
                                {company.email[lang]}
                            </a>
                        )}
                    </motion.div>

                    {/* Address */}
                    <motion.div
                        whileHover={{ y: -3 }}
                        className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all"
                    >
                        <h3 className="font-bold text-navy-dark text-lg mb-4 flex items-center gap-2">
                            <MapPin size={18} className="text-gold" />
                            {t("العنوان", "Address")}
                        </h3>
                        <p className="text-text-muted text-sm">{t("السودان - الخرطوم", "Sudan - Khartoum")}</p>
                    </motion.div>

                    {/* Social */}
                    <motion.div
                        whileHover={{ y: -3 }}
                        className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all"
                    >
                        <h3 className="font-bold text-navy-dark text-lg mb-4">
                            {t("تابعنا", "Follow Us")}
                        </h3>
                        <div className="flex gap-2">
                            {[
                                { href: socials.facebook || "#", Icon: Facebook },
                                { href: socials.linkedin || "#", Icon: Linkedin },
                                { href: socials.youtube || "#", Icon: Youtube },
                            ].map(({ href, Icon }) => (
                                <motion.a
                                    key={Icon.name}
                                    href={href}
                                    target="_blank"
                                    rel="noreferrer"
                                    whileHover={{ scale: 1.15, y: -3 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="w-11 h-11 rounded-xl bg-navy/10 text-navy flex items-center justify-center hover:bg-gold hover:text-white transition-colors"
                                >
                                    <Icon size={18} />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Ports */}
                    <motion.div
                        whileHover={{ y: -3 }}
                        className="bg-gradient-to-br from-navy-dark to-navy rounded-2xl p-6 text-white shadow-sm hover:shadow-lg transition-all"
                    >
                        <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                            <Anchor size={18} className="text-gold" />
                            {t("الموانئ الدولية", "International Ports")}
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                            {company.ports.map((p) => (
                                <span key={p.en} className="text-[11px] px-2.5 py-1 rounded-full bg-white/10 text-white/80">
                                    {p[lang]}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>

                {/* Contact Form — Right column */}
                <motion.div variants={itemVariants} className="lg:col-span-3">
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm">
                        <h2 className="text-2xl font-bold text-navy-dark mb-6">
                            {t("أرسل رسالة", "Send a Message")}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        {t("الاسم", "Name")} *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-navy focus:ring-2 focus:ring-navy/10 outline-none transition text-sm"
                                        placeholder={t("اسمك الكامل", "Your full name")}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        {t("البريد", "Email")} *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-navy focus:ring-2 focus:ring-navy/10 outline-none transition text-sm"
                                        placeholder={t("بريدك الإلكتروني", "Your email")}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        {t("الهاتف", "Phone")}
                                    </label>
                                    <input
                                        type="tel"
                                        value={form.phone}
                                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-navy focus:ring-2 focus:ring-navy/10 outline-none transition text-sm"
                                        placeholder={t("رقم الهاتف", "Phone number")}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        {t("الموضوع", "Subject")} *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={form.subject}
                                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-navy focus:ring-2 focus:ring-navy/10 outline-none transition text-sm"
                                        placeholder={t("موضوع الرسالة", "Message subject")}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    {t("الرسالة", "Message")} *
                                </label>
                                <textarea
                                    required
                                    rows={5}
                                    value={form.message}
                                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-navy focus:ring-2 focus:ring-navy/10 outline-none transition text-sm resize-none"
                                    placeholder={t("اكتب رسالتك هنا...", "Write your message here...")}
                                />
                            </div>

                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full px-6 py-4 bg-gradient-to-r from-navy to-navy-dark text-white font-bold rounded-xl hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
                            >
                                {sent ? (
                                    <>
                                        <CheckCircle size={18} />
                                        {t("تم الإرسال بنجاح!", "Sent Successfully!")}
                                    </>
                                ) : (
                                    <>
                                        <Send size={18} />
                                        {t("إرسال الرسالة", "Send Message")}
                                    </>
                                )}
                            </motion.button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
