"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  MailOpen,
  Trash2,
  Calendar,
  User,
  Phone,
  MessageSquare,
  X,
  CheckCircle,
  Clock,
} from "lucide-react";

export default function AdminMessagesPage({ params }) {
  const router = useRouter();
  const [lang, setLang] = useState("ar");
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState("all"); // all, unread, read

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
    loadMessages();
  }, [lang, router]);

  const loadMessages = () => {
    const stored = localStorage.getItem("lal_messages");
    if (stored) {
      const msgs = JSON.parse(stored);
      setMessages(msgs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    }
  };

  const saveMessages = (messagesArray) => {
    localStorage.setItem("lal_messages", JSON.stringify(messagesArray));
    setMessages(messagesArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  };

  const handleMarkAsRead = (id) => {
    const updated = messages.map((msg) =>
      msg.id === id ? { ...msg, read: true } : msg
    );
    saveMessages(updated);
    if (selectedMessage?.id === id) {
      setSelectedMessage({ ...selectedMessage, read: true });
    }
  };

  const handleDelete = (id) => {
    if (confirm(t("هل أنت متأكد من حذف هذه الرسالة؟", "Are you sure you want to delete this message?"))) {
      saveMessages(messages.filter((msg) => msg.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    }
  };

  const handleViewMessage = (msg) => {
    setSelectedMessage(msg);
    if (!msg.read) {
      handleMarkAsRead(msg.id);
    }
  };

  const filteredMessages = messages.filter((msg) => {
    if (filter === "unread") return !msg.read;
    if (filter === "read") return msg.read;
    return true;
  });

  const stats = {
    total: messages.length,
    unread: messages.filter((m) => !m.read).length,
    read: messages.filter((m) => m.read).length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push(`/${lang}/admin/dashboard`)}
                className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
              >
                <ArrowLeft size={20} />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold text-navy">
                  {t("الرسائل الواردة", "Incoming Messages")}
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  {t("عرض وإدارة رسائل العملاء", "View and manage customer messages")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                {[
                  { key: "all", label: t("الكل", "All"), count: stats.total },
                  { key: "unread", label: t("غير مقروءة", "Unread"), count: stats.unread },
                  { key: "read", label: t("مقروءة", "Read"), count: stats.read },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      filter === tab.key
                        ? "bg-white text-navy shadow-sm"
                        : "text-gray-600 hover:text-navy"
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {filteredMessages.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <MessageSquare size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {filter === "unread"
                ? t("لا توجد رسائل غير مقروءة", "No unread messages")
                : filter === "read"
                ? t("لا توجد رسائل مقروءة", "No read messages")
                : t("لا توجد رسائل", "No messages yet")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredMessages.map((msg, idx) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => handleViewMessage(msg)}
                className={`bg-white rounded-2xl shadow-sm border hover:shadow-md transition cursor-pointer ${
                  msg.read ? "border-gray-100" : "border-blue-200 bg-blue-50/30"
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          msg.read ? "bg-gray-100 text-gray-600" : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {msg.read ? <MailOpen size={24} /> : <Mail size={24} />}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-navy mb-1">{msg.name}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-2">
                          <span className="flex items-center gap-1">
                            <Mail size={14} />
                            {msg.email}
                          </span>
                          {msg.phone && (
                            <span className="flex items-center gap-1">
                              <Phone size={14} />
                              {msg.phone}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(msg.createdAt).toLocaleDateString(
                              lang === "ar" ? "ar-EG" : "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2">{msg.message}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!msg.read && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(msg.id);
                          }}
                          className="w-9 h-9 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 flex items-center justify-center transition"
                          title={t("تمييز كمقروءة", "Mark as read")}
                        >
                          <CheckCircle size={16} />
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(msg.id);
                        }}
                        className="w-9 h-9 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition"
                        title={t("حذف", "Delete")}
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      <AnimatePresence>
        {selectedMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={(e) => e.target === e.currentTarget && setSelectedMessage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-navy">
                  {t("تفاصيل الرسالة", "Message Details")}
                </h2>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Sender Info */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <User size={18} className="text-gray-500" />
                    <span className="font-medium text-navy">{selectedMessage.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={18} className="text-gray-500" />
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>
                  {selectedMessage.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={18} className="text-gray-500" />
                      <a
                        href={`tel:${selectedMessage.phone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {selectedMessage.phone}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-gray-500" />
                    <span className="text-gray-600 text-sm">
                      {new Date(selectedMessage.createdAt).toLocaleDateString(
                        lang === "ar" ? "ar-EG" : "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                  </div>
                </div>

                {/* Message Content */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    {t("الرسالة", "Message")}
                  </h3>
                  <div className="bg-white border border-gray-200 rounded-xl p-4">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  {!selectedMessage.read && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        handleMarkAsRead(selectedMessage.id);
                        setSelectedMessage(null);
                      }}
                      className="flex-1 px-6 py-3 bg-green-50 text-green-600 font-medium rounded-xl hover:bg-green-100 transition flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={18} />
                      {t("تمييز كمقروءة", "Mark as Read")}
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      handleDelete(selectedMessage.id);
                      setSelectedMessage(null);
                    }}
                    className="flex-1 px-6 py-3 bg-red-50 text-red-600 font-medium rounded-xl hover:bg-red-100 transition flex items-center justify-center gap-2"
                  >
                    <Trash2 size={18} />
                    {t("حذف الرسالة", "Delete Message")}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}