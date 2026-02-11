"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Handshake, Package, Shield } from "lucide-react";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
};
const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
};

export default function PortalsClient({ lang }) {
    const t = (ar, en) => (lang === "ar" ? ar : en);

    const portals = [
        {
            id: "clients",
            icon: Users,
            title: t("بوابة العملاء", "Client Portal"),
            desc: t(
                "تتبع طلباتك، استعرض المنتجات، وتواصل مع فريق خدمة العملاء.",
                "Track your orders, browse products, and communicate with our customer service team."
            ),
            color: "from-blue-500 to-indigo-600",
            href: `/${lang}/portals/clients`
        },
        {
            id: "partners",
            icon: Handshake,
            title: t("بوابة الشركاء", "Partners Portal"),
            desc: t(
                "اكتشف فرص الشراكة والتعاون مع شركة لال للأنشطة المتعددة.",
                "Discover partnership and collaboration opportunities with Lal Multi Activities."
            ),
            color: "from-emerald-500 to-teal-600",
            href: `/${lang}/portals/partners`
        },
        {
            id: "suppliers",
            icon: Package,
            title: t("بوابة الموردين", "Suppliers Portal"),
            desc: t(
                "سجّل كمورد، قدّم عروضك، واطلع على متطلبات التوريد.",
                "Register as a supplier, submit your offers, and view supply requirements."
            ),
            color: "from-amber-500 to-orange-600",
            href: `/${lang}/portals/suppliers`
        },
        {
            id: "admin",
            icon: Shield,
            title: t("بوابة الإدارة", "Admin Portal"),
            desc: t(
                "لوحة تحكم مدير الموقع لإدارة المحتوى والأخبار والمنتجات.",
                "Site admin dashboard for managing content, news, and products."
            ),
            color: "from-purple-500 to-violet-600",
            href: `/${lang}/admin`
        },
    ];

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="mx-auto max-w-6xl px-4 py-10"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {portals.map((portal) => {
                    const Icon = portal.icon;
                    return (
                        <motion.div key={portal.id} variants={itemVariants}>
                            <Link href={portal.href}>
                                <motion.div
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 group cursor-pointer h-full"
                                >
                                    {/* Gradient top */}
                                    <div className={`bg-gradient-to-r ${portal.color} h-2 group-hover:h-3 transition-all duration-300`} />

                                    <div className="p-6 md:p-8">
                                        <div className="flex items-start gap-4">
                                            <motion.div
                                                whileHover={{ rotate: [0, -10, 10, 0] }}
                                                className={`shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${portal.color} flex items-center justify-center text-white shadow-lg`}
                                            >
                                                <Icon size={28} />
                                            </motion.div>

                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-xl font-bold text-navy-dark group-hover:text-gold transition-colors">
                                                    {portal.title}
                                                </h3>
                                                <p className="mt-2 text-text-muted leading-7 text-sm">
                                                    {portal.desc}
                                                </p>
                                                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-navy group-hover:text-gold transition-colors">
                                                    {t("دخول البوابة ←", "Enter Portal →")}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}
