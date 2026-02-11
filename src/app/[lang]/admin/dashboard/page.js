"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Newspaper,
  MessageSquare,
  LogOut,
  TrendingUp,
  Users,
  Bell,
  BarChart3,
} from "lucide-react";

export default function AdminDashboard({ params }) {
  const router = useRouter();
  const [lang, setLang] = useState("ar");
  const [stats, setStats] = useState({
    totalNews: 0,
    totalMessages: 0,
    unreadMessages: 0,
    recentActivity: 0,
  });

  useEffect(() => {
    const parts = window.location.pathname.split("/");
    if (parts[1] === "en") setLang("en");
  }, []);

  const t = (ar, en) => (lang === "ar" ? ar : en);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("lal_admin") !== "true") {
      router.replace(`/${lang}/admin/login`);
      return;
    }

    // Load statistics
    const news = JSON.parse(localStorage.getItem("lal_news") || "[]");
    const messages = JSON.parse(localStorage.getItem("lal_messages") || "[]");
    const unread = messages.filter((m) => !m.read).length;

    setStats({
      totalNews: news.length,
      totalMessages: messages.length,
      unreadMessages: unread,
      recentActivity: news.filter(
        (n) =>
          new Date(n.createdAt) >
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length,
    });
  }, [lang, router]);

  const handleLogout = () => {
    sessionStorage.removeItem("lal_admin");
    router.push(`/${lang}/admin/login`);
  };

  const cards = [
    {
      title: t("إجمالي الأخبار", "Total News"),
      value: stats.totalNews,
      icon: Newspaper,
      color: "from-blue-500 to-blue-600",
      link: `/${lang}/admin/news`,
    },
    {
      title: t("إجمالي الرسائل", "Total Messages"),
      value: stats.totalMessages,
      icon: MessageSquare,
      color: "from-green-500 to-green-600",
      link: `/${lang}/admin/messages`,
    },
    {
      title: t("رسائل غير مقروءة", "Unread Messages"),
      value: stats.unreadMessages,
      icon: Bell,
      color: "from-orange-500 to-orange-600",
      link: `/${lang}/admin/messages`,
    },
    {
      title: t("نشاط هذا الأسبوع", "This Week's Activity"),
      value: stats.recentActivity,
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
      link: `/${lang}/admin/news`,
    },
  ];

  const quickActions = [
    {
      title: t("إدارة الأخبار", "Manage News"),
      desc: t("إضافة وتعديل وحذف الأخبار", "Add, edit and delete news"),
      icon: Newspaper,
      link: `/${lang}/admin/news`,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: t("الرسائل الواردة", "Incoming Messages"),
      desc: t("عرض رسائل العملاء", "View customer messages"),
      icon: MessageSquare,
      link: `/${lang}/admin/messages`,
      color: "bg-green-50 text-green-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-navy">
                {t("لوحة التحكم", "Admin Dashboard")}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {t("مرحباً بك في لوحة الإدارة", "Welcome to the admin panel")}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition"
            >
              <LogOut size={18} />
              <span>{t("تسجيل الخروج", "Logout")}</span>
            </motion.button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              onClick={() => router.push(card.link)}
              className="cursor-pointer"
            >
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}
                  >
                    <card.icon size={24} className="text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">{card.title}</p>
                  <p className="text-3xl font-bold text-navy">{card.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-navy mb-6">
            {t("الإجراءات السريعة", "Quick Actions")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => router.push(action.link)}
                className="cursor-pointer"
              >
                <div className="border border-gray-200 rounded-xl p-5 hover:border-navy/30 hover:shadow-md transition-all">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center flex-shrink-0`}>
                      <action.icon size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-navy mb-1">{action.title}</h3>
                      <p className="text-gray-500 text-sm">{action.desc}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}