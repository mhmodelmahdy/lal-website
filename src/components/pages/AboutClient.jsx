"use client";

import { motion } from "framer-motion";
import {
    Eye, Target, Award, Cog, CheckCircle, Shield, Heart, Sparkles
} from "lucide-react";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.45 } }
};

function Section({ icon: Icon, title, children, color = "navy" }) {
    const borderColor = color === "gold" ? "border-l-gold" : "border-l-navy";
    const iconBg = color === "gold" ? "bg-gold/10 text-gold-dark" : "bg-navy/10 text-navy";
    return (
        <motion.section
            variants={itemVariants}
            whileHover={{ y: -3 }}
            className={`bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border-l-4 ${borderColor}`}
        >
            <div className="flex items-center gap-3 mb-5">
                <div className={`p-2.5 rounded-xl ${iconBg}`}>
                    <Icon size={22} />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-navy-dark">{title}</h2>
            </div>
            {children}
        </motion.section>
    );
}

function ListItem({ text }) {
    return (
        <motion.li
            whileHover={{ x: 4 }}
            className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/80 border border-gray-100 hover:bg-navy/5 hover:border-navy/20 transition-all cursor-default"
        >
            <CheckCircle size={18} className="text-gold shrink-0 mt-0.5" />
            <span className="text-gray-700 leading-7">{text}</span>
        </motion.li>
    );
}

export default function AboutClient({ lang, about, company }) {
    const t = (ar, en) => (lang === "ar" ? ar : en);

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="mx-auto max-w-6xl px-4 py-10 grid gap-5"
        >
            {/* Company full about */}
            <Section icon={Sparkles} title={t("نبذة عن الشركة", "About the Company")} color="gold">
                <p className="text-gray-600 leading-8 text-[15px]">
                    {t(
                        "تُعد شركة لال للأنشطة المتعددة المحدودة واحدة من الشركات الوطنية الرائدة في مجالات التصدير والاستيراد والتجارة العامة والتوريدات العمومية، إلى جانب خدمات التشغيل الطبي وغير الطبي للقطاعين العام والخاص. تعمل الشركة ضمن بيئة متكاملة تهدف إلى تقديم خدمات وأعمال وفق أعلى معايير الجودة والتميز في السوقين السوداني والعالمي، مستفيدة من مكانتها المتقدمة في قطاع الرعاية الصحية عبر رخصة الاستيراد العامة والوكالات الطبية المعتمدة لديها، إضافة إلى نشاطها المتنامي في القطاعات الزراعية والصناعية والغذائية واللوجستية.",
                        "Lal Multi Activities Co. Ltd is one of the leading national companies in the fields of export, import, general trading, and general supplies, in addition to medical and non-medical operation services for both the public and private sectors. The company operates within an integrated business environment aimed at delivering services and projects in accordance with the highest standards of quality and excellence in the Sudanese and global markets. It benefits from its advanced position in the healthcare sector through general import licenses and accredited medical agencies, in addition to its growing activities in the agricultural, industrial, food, and logistics sectors."
                    )}
                </p>
            </Section>

            {/* Vision */}
            <Section icon={Eye} title={t("رؤيتنا", "Our Vision")}>
                <p className="text-gray-600 leading-8">{about.vision[lang]}</p>
            </Section>

            {/* Mission */}
            <Section icon={Target} title={t("رسالتنا", "Our Mission")} color="gold">
                <p className="text-gray-600 leading-8">{about.mission[lang]}</p>
            </Section>

            {/* Objectives */}
            <Section icon={Award} title={t("أهدافنا", "Our Objectives")}>
                <h3 className="font-bold text-navy mb-3 text-lg">{t("أهداف عامة", "General Objectives")}</h3>
                <ul className="grid gap-2 md:grid-cols-2 mb-6">
                    {about.objectives.general[lang].map((x) => (
                        <ListItem key={x} text={x} />
                    ))}
                </ul>

                <h3 className="font-bold text-gold-dark mb-3 text-lg">{t("أهداف خاصة", "Specific Objectives")}</h3>
                <ul className="grid gap-2 md:grid-cols-2">
                    {about.objectives.specific[lang].map((x) => (
                        <ListItem key={x} text={x} />
                    ))}
                </ul>
            </Section>

            {/* Values */}
            <Section icon={Heart} title={t("قيمنا", "Our Values")} color="gold">
                <ul className="grid gap-2 md:grid-cols-2">
                    {about.values[lang].map((x) => (
                        <ListItem key={x} text={x} />
                    ))}
                </ul>
            </Section>

            {/* Strategy */}
            <Section icon={Cog} title={t("استراتيجية العمل", "Work Strategy")}>
                <ul className="grid gap-2">
                    {about.strategy[lang].map((x) => (
                        <ListItem key={x} text={x} />
                    ))}
                </ul>
            </Section>
        </motion.div>
    );
}
