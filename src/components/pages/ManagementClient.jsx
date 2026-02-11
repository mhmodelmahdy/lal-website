"use client";

import { motion } from "framer-motion";
import { Crown, Users, TrendingUp, Settings, DollarSign, FileText, ShoppingCart, Briefcase } from "lucide-react";
import Image from "next/image";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const cardVariants = {
    hidden: { x: -60, opacity: 0 },
    visible: { 
        x: 0, 
        opacity: 1, 
        transition: { duration: 0.6, ease: "easeOut" } 
    }
};

// البيانات الكاملة للإدارة - 8 أشخاص
const managementData = [
    {
        name: {
            ar: "محمد هاشم العالم حسين",
            en: "Muhammad Hashim Al-Alam Hussein"
        },
        role: {
            ar: "المدير العام",
            en: "General Manager"
        },
        bio: {
            ar: "يقود رؤية الشركة الاستراتيجية ويشرف على جميع العمليات التنفيذية. يضع الخطط طويلة المدى ويوجه الشركة نحو تحقيق أهدافها في التميز والنمو المستدام.",
            en: "Leads the company's strategic vision and oversees all executive operations. Sets long-term plans and guides the company towards achieving its goals in excellence and sustainable growth."
        },
        image: "Muhammad Hashim Al-Alam Hussein.jpeg",
        icon: Crown
    },
    {
        name: {
            ar: "عمر الحسين الزبير عبدالقادر",
            en: "Omar Al-Hussein Al-Zubair Abdul Qadir"
        },
        role: {
            ar: "مدير قسم المشتريات",
            en: "Procurement Manager"
        },
        bio: {
            ar: "يدير عمليات الشراء والتوريد ويضمن الحصول على أفضل المواد الخام بأنسب الأسعار. يبني علاقات استراتيجية مع الموردين ويحسن كفاءة سلسلة التوريد.",
            en: "Manages purchasing and supply operations, ensuring the acquisition of the best raw materials at optimal prices. Builds strategic relationships with suppliers and enhances supply chain efficiency."
        },
        image: "Omar Al-Hussein Al-Zubair Abdul Qadir.jpeg",
        icon: ShoppingCart
    },
    {
        name: {
            ar: "خالد أحمد الزاكي حسين",
            en: "Khaled Ahmed Al-Zaki Hussein"
        },
        role: {
            ar: "سكرتير مجلس الإدارة",
            en: "Board Secretary"
        },
        bio: {
            ar: "ينظم اجتماعات مجلس الإدارة ويدير المراسلات الرسمية والوثائق القانونية. يضمن الامتثال للوائح الحوكمة ويحفظ السجلات والمحاضر بدقة واحترافية.",
            en: "Organizes board meetings and manages official correspondence and legal documents. Ensures compliance with governance regulations and maintains records and minutes with accuracy and professionalism."
        },
        image: "Khaled Ahmed Al-Zaki Hussein.jpeg",
        icon: FileText
    },
    {
        name: {
            ar: "هيثم محمد إبراهيم محمد",
            en: "Haitham Mohamed Ibrahim Mohamed"
        },
        role: {
            ar: "مدير العمليات المالية",
            en: "Financial Operations Manager"
        },
        bio: {
            ar: "يشرف على التخطيط المالي والميزانيات والتقارير المحاسبية. يدير التدفقات النقدية ويحلل الأداء المالي لضمان الاستقرار والنمو المالي للشركة.",
            en: "Oversees financial planning, budgets, and accounting reports. Manages cash flows and analyzes financial performance to ensure the company's financial stability and growth."
        },
        image: "Haitham Mohamed Ibrahim Mohamed.jpeg",
        icon: DollarSign
    },
    {
        name: {
            ar: "دفع الله محمد بركة",
            en: "Dafaa Allah Muhamad Birakah"
        },
        role: {
            ar: "مدير العمليات - COO",
            en: "Chief Operating Officer - COO"
        },
        bio: {
            ar: "يدير العمليات التشغيلية اليومية ويحسن الكفاءة الإنتاجية. يشرف على خطوط الإنتاج والعمليات اللوجستية ويضمن سير العمل بسلاسة وفعالية.",
            en: "Manages daily operational activities and improves production efficiency. Supervises production lines and logistics operations, ensuring smooth and effective workflow."
        },
        image: "dafae allah muhamad birakah.jpeg",
        icon: Settings
    },
    {
        name: {
            ar: "منزول جمال موسى أحمد",
            en: "Manzoul Jamal Musa Ahmed"
        },
        role: {
            ar: "مسؤول تطوير الأعمال",
            en: "Business Development Officer"
        },
        bio: {
            ar: "يبحث عن فرص النمو الجديدة ويطور استراتيجيات التوسع والشراكات. يحلل الأسواق المحتملة ويقود مبادرات الابتكار لتعزيز مكانة الشركة التنافسية.",
            en: "Identifies new growth opportunities and develops expansion strategies and partnerships. Analyzes potential markets and leads innovation initiatives to enhance the company's competitive position."
        },
        image: "Manzoul Jamal Musa Ahmed.jpeg",
        icon: TrendingUp
    },
    {
        name: {
            ar: "مطر عوض ماهل سعد",
            en: "Matar Awad Mahl Saad"
        },
        role: {
            ar: "مدير العلاقات العامة",
            en: "Public Relations Manager"
        },
        bio: {
            ar: "يدير صورة الشركة الإعلامية ويبني علاقات إيجابية مع المجتمع والشركاء. ينظم الفعاليات والمؤتمرات ويتواصل مع وسائل الإعلام لتعزيز سمعة الشركة.",
            en: "Manages the company's media image and builds positive relationships with the community and partners. Organizes events and conferences and communicates with media to enhance the company's reputation."
        },
        image: "Matar Awad Mahl Saad.jpeg",
        icon: Users
    }
];

export default function ManagementClient({ lang }) {
    return (
        <section className="py-16 px-4 bg-gray-50">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="mx-auto max-w-6xl space-y-8"
            >
                {managementData.map((member, index) => (
                    <ManagementCard 
                        key={member.name.en} 
                        member={member} 
                        lang={lang}
                        index={index}
                    />
                ))}
            </motion.div>
        </section>
    );
}

function ManagementCard({ member, lang, index }) {
    const Icon = member.icon;
    const isRTL = lang === 'ar';

    return (
        <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ duration: 0.3 }}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border border-gray-200"
        >
            {/* شريط علوي رفيع */}
            <div className="h-1 bg-gradient-to-r from-navy via-navy-light to-navy" />

            <div className={`flex flex-col md:flex-row ${isRTL ? 'md:flex-row-reverse' : ''} items-center gap-8 p-8`}>
                
                {/* قسم الصورة */}
                <div className="flex-shrink-0">
                    <div className="relative">
                        {/* الصورة الشخصية */}
                        <div className="relative w-48 h-48 rounded-2xl overflow-hidden shadow-xl border-4 border-gray-100 group-hover:border-navy-light transition-all duration-300">
                            <Image
                                src={`/images/${member.image}`}
                                alt={member.name[lang]}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                priority={index < 3}
                            />
                        </div>
                        
                        {/* أيقونة الدور */}
                        <motion.div
                            whileHover={{ rotate: 15 }}
                            transition={{ duration: 0.3 }}
                            className={`absolute -bottom-4 ${isRTL ? '-left-4' : '-right-4'} w-16 h-16 rounded-xl bg-navy flex items-center justify-center text-white shadow-xl border-4 border-white`}
                        >
                            <Icon size={28} strokeWidth={2} />
                        </motion.div>
                    </div>
                </div>

                {/* قسم المعلومات */}
                <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {/* الاسم */}
                    <h3 className="text-3xl font-bold text-navy-dark mb-3 leading-tight">
                        {member.name[lang]}
                    </h3>
                    
                    {/* المنصب */}
                    <div className="inline-block mb-5">
                        <div className="px-5 py-2 rounded-lg bg-navy text-white">
                            <p className="text-lg font-semibold">
                                {member.role[lang]}
                            </p>
                        </div>
                    </div>

                    {/* النبذة */}
                    <div className="relative">
                        <div className={`absolute top-0 ${isRTL ? 'right-0' : 'left-0'} w-1 h-full bg-navy rounded-full`} />
                        <p className={`text-gray-700 leading-relaxed text-lg ${isRTL ? 'pr-5' : 'pl-5'}`}>
                            {member.bio[lang]}
                        </p>
                    </div>
                </div>
            </div>

            {/* تأثير هوفر خفيف */}
            <div className="absolute inset-0 bg-navy opacity-0 group-hover:opacity-[0.02] transition-opacity duration-500 pointer-events-none" />
        </motion.div>
    );
}