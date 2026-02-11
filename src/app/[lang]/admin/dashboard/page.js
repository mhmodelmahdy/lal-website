"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Newspaper, MessageSquare, LogOut, TrendingUp, Bell, Package } from "lucide-react";

export default function AdminDashboard({ params }) {
  const router = useRouter();
  const [langState, setLangState] = useState(null);
  const [stats, setStats] = useState({ totalNews: 0, totalMessages: 0, unreadMessages: 0, totalSupplierRequests: 0 });

  useEffect(() => {
    (async () => {
      try {
        const resolvedParams = await params;
        const rawLang = resolvedParams?.lang;
        setLangState(rawLang === "en" ? "en" : "ar");
      } catch {
        const parts = window.location.pathname.split("/");
        setLangState(parts[1] === "en" ? "en" : "ar");
      }
    })();
  }, [params]);

  const lang = langState === "en" ? "en" : "ar";
  const t = (ar, en) => (lang === "ar" ? ar : en);

  useEffect(() => {
    (async () => {
      if (!langState) return;

      try {
        const me = await fetch("/api/admin/me", { cache: "no-store" });
        if (!me.ok) {
          router.replace(`/${lang}/admin`);
          return;
        }

        const statsRes = await fetch("/api/admin/stats", { cache: "no-store" });
        const statsJson = await statsRes.json();
        if (!statsRes.ok) throw new Error(statsJson?.error || "Failed to load stats");

        const data = statsJson?.data || {};
        setStats({
          totalNews: data.totalNews ?? 0,
          totalMessages: data.totalMessages ?? 0,
          unreadMessages: data.unreadMessages ?? 0,
          totalSupplierRequests: data.totalSupplierRequests ?? 0,
        });
      } catch {
        setStats({ totalNews: 0, totalMessages: 0, unreadMessages: 0, totalSupplierRequests: 0 });
      }
    })();
  }, [langState, router]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push(`/${lang}/admin`);
  };

  const cardsRaw = [
    { title: t("إجمالي الأخبار", "Total News"), value: stats.totalNews, icon: Newspaper, color: "from-blue-500 to-blue-600", link: `/${lang}/admin/news` },
    { title: t("إجمالي الرسائل", "Total Messages"), value: stats.totalMessages, icon: MessageSquare, color: "from-green-500 to-green-600", link: `/${lang}/admin/messages` },
    { title: t("رسائل غير مقروءة", "Unread Messages"), value: stats.unreadMessages, icon: Bell, color: "from-orange-500 to-orange-600", link: `/${lang}/admin/messages` },
    { title: t("أخبار آخر أسبوع", "News This Week"), value: stats.recentNews, icon: TrendingUp, color: "from-purple-500 to-purple-600", link: `/${lang}/admin/news` },
  ];

  const cards = [
    ...cardsRaw.slice(0, 3),
    { title: t("إجمالي طلبات الموردين", "Total Supplier Requests"), value: stats.totalSupplierRequests, icon: Package, color: "from-purple-500 to-purple-600", link: `/${lang}/admin/suppliers` },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-navy">{t("لوحة التحكم", "Admin Dashboard")}</h1>
              <p className="text-gray-500 text-sm mt-1">{t("مرحباً بك في لوحة الإدارة", "Welcome to the admin panel")}</p>
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleLogout} className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition">
              <LogOut className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              <span>{t("تسجيل الخروج", "Logout")}</span>
            </motion.button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {cards.map((card, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }} whileHover={{ y: -5 }} onClick={() => router.push(card.link)} className="cursor-pointer">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                    <card.icon className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 text-xs sm:text-sm mb-1">{card.title}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-navy">{card.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-navy mb-6">{t("الإجراءات السريعة", "Quick Actions")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div onClick={() => router.push(`/${lang}/admin/suppliers`)} className="cursor-pointer border border-gray-200 rounded-xl p-4 sm:p-5 hover:border-navy/30 hover:shadow-md transition-all">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <Package className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-navy mb-1">{t("طلبات الموردين", "Supplier Requests")}</h3>
                  <p className="text-gray-500 text-sm">{t("عرض طلبات تسجيل الموردين", "View supplier registration requests")}</p>
                </div>
              </div>
            </div>
            <div onClick={() => router.push(`/${lang}/admin/news`)} className="cursor-pointer border border-gray-200 rounded-xl p-4 sm:p-5 hover:border-navy/30 hover:shadow-md transition-all">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Newspaper className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-navy mb-1">{t("إدارة الأخبار", "Manage News")}</h3>
                  <p className="text-gray-500 text-sm">{t("إضافة وتعديل وحذف الأخبار", "Add, edit and delete news")}</p>
                </div>
              </div>
            </div>

            <div onClick={() => router.push(`/${lang}/admin/messages`)} className="cursor-pointer border border-gray-200 rounded-xl p-4 sm:p-5 hover:border-navy/30 hover:shadow-md transition-all">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-navy mb-1">{t("الرسائل الواردة", "Incoming Messages")}</h3>
                  <p className="text-gray-500 text-sm">{t("عرض رسائل العملاء", "View customer messages")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
