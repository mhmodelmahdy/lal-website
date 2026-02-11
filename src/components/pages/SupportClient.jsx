"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronDown, HelpCircle, Send, CheckCircle, Phone, Mail, MessageCircle
} from "lucide-react";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};
const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
};

const faqData = {
    ar: [
        { q: "ما هي مجالات عمل شركة لال؟", a: "تعمل شركة لال في مجالات التصدير والاستيراد والتجارة العامة والتوريدات العمومية، بالإضافة إلى خدمات التشغيل الطبي وغير الطبي للقطاعين العام والخاص." },
        { q: "كيف يمكنني التواصل مع الشركة؟", a: "يمكنكم التواصل عبر الأرقام: 00249123704221 أو 00971522212735، أو عبر صفحة تواصل معنا على الموقع." },
        { q: "ما هي المنتجات الزراعية التي تصدرها الشركة؟", a: "تصدر الشركة الصمغ العربي (طلح وهشاب ولبان)، الكركدي، الفول السوداني، حب البطيخ، السمسم، الأمباز، والعدسية." },
        { q: "هل تقدم الشركة خدمات الاستيراد لحساب الغير؟", a: "نعم، تقدم الشركة خدمات متكاملة تشمل اختيار الموردين العالميين والتعاقد والشحن والتخليص الجمركي والنقل والتخزين والتوزيع." },
        { q: "ما هي الموانئ التي تتعامل معها الشركة؟", a: "تتعامل الشركة مع ميناء الدار البيضاء (المغرب)، جبل علي (الإمارات)، ميرسين (تركيا)، شنغهاي (الصين)، مومباي (الهند)، وجدة (السعودية)." },
        { q: "كيف أصبح شريكاً أو مورداً للشركة؟", a: "يمكنكم زيارة بوابة الشركاء أو بوابة الموردين على موقعنا وتعبئة نموذج الطلب، أو التواصل مع قسم تطوير الأعمال مباشرة." },
    ],
    en: [
        { q: "What are Lal's business areas?", a: "Lal operates in export, import, general trading, and general supplies, in addition to medical and non-medical operation services for public and private sectors." },
        { q: "How can I contact the company?", a: "You can reach us at: 00249123704221 or 00971522212735, or through the Contact Us page on our website." },
        { q: "What agricultural products does the company export?", a: "The company exports Gum Arabic (Talha, Hashab, and Luban), Hibiscus, Peanuts, Watermelon Seeds, Sesame Seeds, Cottonseed Cake (Ambaz), and Lentils." },
        { q: "Does the company offer import services on behalf of third parties?", a: "Yes, we offer comprehensive services including supplier selection, contracting, shipping, customs clearance, transportation, storage, and distribution." },
        { q: "Which ports does the company deal with?", a: "We deal with Casablanca (Morocco), Jebel Ali (UAE), Mersin (Turkey), Shanghai (China), Mumbai (India), and Jeddah (Saudi Arabia)." },
        { q: "How can I become a partner or supplier?", a: "You can visit the Partners Portal or Suppliers Portal on our website and fill out the application form, or contact the Business Development department directly." },
    ]
};

function FAQItem({ question, answer, isOpen, onToggle }) {
    return (
        <motion.div
            variants={itemVariants}
            className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-5 text-left"
            >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <HelpCircle size={20} className="text-gold shrink-0" />
                    <span className="font-semibold text-navy-dark">{question}</span>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-400 shrink-0 ml-3"
                >
                    <ChevronDown size={20} />
                </motion.div>
            </button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-5 pt-0">
                            <div className="p-4 bg-gray-50 rounded-xl text-gray-600 leading-7 text-sm border-l-3 border-gold">
                                {answer}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default function SupportClient({ lang }) {
    const t = (ar, en) => (lang === "ar" ? ar : en);
    const faqs = faqData[lang] || faqData.ar;
    const [openIndex, setOpenIndex] = useState(0);
    const [ticketSent, setTicketSent] = useState(false);
    const [ticket, setTicket] = useState({ name: "", email: "", issue: "" });

    const handleTicket = (e) => {
        e.preventDefault();
        setTicketSent(true);
        setTimeout(() => setTicketSent(false), 4000);
        setTicket({ name: "", email: "", issue: "" });
    };

    return (
        <div className="mx-auto max-w-6xl px-4 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* FAQ */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="lg:col-span-3 space-y-3"
                >
                    <h2 className="text-2xl font-bold text-navy-dark mb-5 flex items-center gap-2">
                        <HelpCircle size={24} className="text-gold" />
                        {t("الأسئلة الشائعة", "Frequently Asked Questions")}
                    </h2>
                    {faqs.map((faq, i) => (
                        <FAQItem
                            key={i}
                            question={faq.q}
                            answer={faq.a}
                            isOpen={openIndex === i}
                            onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
                        />
                    ))}
                </motion.div>

                {/* Sidebar */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="lg:col-span-2 space-y-5"
                >
                    {/* Quick Contact */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-gradient-to-br from-navy-dark to-navy rounded-2xl p-6 text-white"
                    >
                        <h3 className="font-bold text-lg mb-4">
                            {t("تواصل سريع", "Quick Contact")}
                        </h3>
                        <div className="space-y-3">
                            <motion.a
                                whileHover={{ x: lang === "ar" ? -4 : 4 }}
                                href="tel:00249123704221"
                                className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                <Phone size={16} className="text-gold" />
                                <span dir="ltr" className="text-sm">00249123704221</span>
                            </motion.a>
                            <motion.a
                                whileHover={{ x: lang === "ar" ? -4 : 4 }}
                                href="tel:00971522212735"
                                className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                <Phone size={16} className="text-gold" />
                                <span dir="ltr" className="text-sm">00971522212735</span>
                            </motion.a>
                            <motion.a
                                whileHover={{ x: lang === "ar" ? -4 : 4 }}
                                href="mailto:info@lalcompany.com"
                                className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                <Mail size={16} className="text-gold" />
                                <span className="text-sm">info@lalcompany.com</span>
                            </motion.a>
                        </div>
                    </motion.div>

                    
                </motion.div>
            </div>
        </div>
    );
}
