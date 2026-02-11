"use client";

import { motion } from "framer-motion";
import {
    Globe, Stethoscope, Truck, ShieldCheck, Package, ChevronDown
} from "lucide-react";
import { useState } from "react";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
};
const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

const sectionIcons = {
    export: Globe,
    import: Stethoscope,
    supplies: Truck,
    thirdParty: ShieldCheck
};

const sectionColors = {
    export: { bg: "from-emerald-500 to-teal-600", badge: "bg-emerald-100 text-emerald-700" },
    import: { bg: "from-blue-500 to-indigo-600", badge: "bg-blue-100 text-blue-700" },
    supplies: { bg: "from-amber-500 to-orange-600", badge: "bg-amber-100 text-amber-700" },
    thirdParty: { bg: "from-purple-500 to-violet-600", badge: "bg-purple-100 text-purple-700" }
};

function ServiceBlock({ id, service, lang, idx }) {
    const [expanded, setExpanded] = useState(true);
    const Icon = sectionIcons[id] || Package;
    const colors = sectionColors[id] || sectionColors.export;
    const t = (ar, en) => (lang === "ar" ? ar : en);

    return (
        <motion.section
            id={id}
            variants={itemVariants}
            className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
        >
            {/* Gradient Header */}
            <div
                className={`bg-gradient-to-r ${colors.bg} p-6 cursor-pointer`}
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                            <Icon size={24} className="text-white" />
                        </div>
                        <div>
                            <span className="text-white/70 text-sm font-medium">
                                {t("القسم", "Section")} {idx + 1}
                            </span>
                            <h2 className="text-xl md:text-2xl font-bold text-white">{service.title[lang]}</h2>
                        </div>
                    </div>
                    <motion.div
                        animate={{ rotate: expanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-white/80"
                    >
                        <ChevronDown size={24} />
                    </motion.div>
                </div>
            </div>

            {/* Content */}
            <motion.div
                initial={false}
                animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="overflow-hidden"
            >
                <div className="p-6">
                    <p className="text-gray-600 leading-8 mb-5">{service.intro[lang]}</p>

                    <div className="grid gap-2.5 md:grid-cols-2 lg:grid-cols-3">
                        {service.items.map((item) => (
                            <motion.div
                                key={item.en}
                                whileHover={{ scale: 1.03, y: -2 }}
                                className={`px-4 py-3 rounded-xl border border-gray-100 ${colors.badge} font-medium text-sm flex items-center gap-2 cursor-default`}
                            >
                                <span className="w-2 h-2 rounded-full bg-current opacity-50" />
                                {item[lang]}
                            </motion.div>
                        ))}
                    </div>

                    {/* For whom section (supplies) */}
                    {service.forWhom && (
                        <div className="mt-6 pt-5 border-t border-gray-100">
                            <h3 className="font-bold text-navy mb-3">
                                {t("وذلك لصالح", "Provided to")}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {service.forWhom[lang].map((x) => (
                                    <motion.span
                                        key={x}
                                        whileHover={{ scale: 1.05 }}
                                        className="px-4 py-2 rounded-full bg-navy/10 text-navy text-sm font-medium"
                                    >
                                        {x}
                                    </motion.span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.section>
    );
}

export default function ServicesClient({ lang, services }) {
    const sections = [
        { id: "export", service: services.export },
        { id: "import", service: services.import },
        { id: "supplies", service: services.supplies },
        { id: "thirdParty", service: services.thirdParty }
    ];

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="mx-auto max-w-6xl px-4 py-10 grid gap-5"
        >
            {sections.map((s, idx) => (
                <ServiceBlock
                    key={s.id}
                    id={s.id}
                    service={s.service}
                    lang={lang}
                    idx={idx}
                />
            ))}
        </motion.div>
    );
}
