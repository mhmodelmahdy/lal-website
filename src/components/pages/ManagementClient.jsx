"use client";

import { motion } from "framer-motion";
import { User, Crown, Briefcase } from "lucide-react";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};
const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.45 } }
};

const roleIcons = [Crown, Briefcase, Crown, User, User, User, User, User];
const roleColors = [
    "from-gold to-gold-dark",
    "from-navy to-navy-dark",
    "from-gold-dark to-amber-700",
    "from-navy-light to-navy",
    "from-navy-light to-navy",
    "from-navy-light to-navy",
    "from-navy-light to-navy",
    "from-navy-light to-navy",
];

export default function ManagementClient({ lang, management }) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="mx-auto max-w-6xl px-4 py-10"
        >
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {management.map((m, i) => {
                    const Icon = roleIcons[i] || User;
                    const gradient = roleColors[i] || "from-navy-light to-navy";
                    const isTop = i < 3;

                    return (
                        <motion.div
                            key={m.name.en}
                            variants={itemVariants}
                            whileHover={{ y: -6, scale: 1.02 }}
                            className={[
                                "bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300",
                                isTop ? "md:col-span-1" : ""
                            ].join(" ")}
                        >
                            {/* Card top gradient */}
                            <div className={`bg-gradient-to-r ${gradient} h-2`} />

                            <div className="p-6">
                                <div className="flex items-start gap-4">
                                    {/* Avatar */}
                                    <motion.div
                                        whileHover={{ rotate: [0, -5, 5, 0] }}
                                        transition={{ duration: 0.4 }}
                                        className={`shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg`}
                                    >
                                        <Icon size={24} />
                                    </motion.div>

                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-lg font-bold text-navy-dark leading-tight">
                                            {m.name[lang]}
                                        </h3>
                                        <p className="mt-1.5 text-text-muted text-sm font-medium">
                                            {m.role[lang]}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}
