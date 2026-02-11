"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  MailOpen,
  Trash2,
  Calendar,
  Phone,
  MessageSquare,
  X,
  CheckCircle,
  RefreshCw,
} from "lucide-react";

export default function AdminMessagesPage() {
  const router = useRouter();

  const [lang, setLang] = useState("ar");
  const t = (ar, en) => (lang === "ar" ? ar : en);

  const [filter, setFilter] = useState("all"); // all | unread | read
  const [page, setPage] = useState(1);
  const [size] = useState(20);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });

  const [selected, setSelected] = useState(null);
  const [busyId, setBusyId] = useState(null);

  // detect lang from URL
  useEffect(() => {
    const parts = window.location.pathname.split("/");
    if (parts[1] === "en") setLang("en");
    else setLang("ar");
  }, []);

  async function ensureAdmin() {
    const res = await fetch("/api/admin/me", { cache: "no-store" });
    if (!res.ok) {
      router.replace(`/${lang}/admin`); // login page
      return false;
    }
    return true;
  }

  async function loadMessages({ nextPage = page, nextFilter = filter } = {}) {
    setLoading(true);
    setError("");

    try {
      const ok = await ensureAdmin();
      if (!ok) return;

      const qs = new URLSearchParams({
        page: String(nextPage),
        size: String(size),
        filter: nextFilter,
      });

      const res = await fetch(`/api/admin/messages?${qs.toString()}`, { cache: "no-store" });
      const json = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          router.replace(`/${lang}/admin`);
          return;
        }
        throw new Error(json?.error || "Failed to load");
      }

      const data = json?.data || {};
      setItems(Array.isArray(data.items) ? data.items : []);
      setMeta({
        total: data.total ?? 0,
        totalPages: data.totalPages ?? 1,
      });
    } catch (e) {
      setError(t("حصلت مشكلة أثناء تحميل الرسائل.", "Failed to load messages."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // لما lang يتحدد
    if (!lang) return;
    loadMessages({ nextPage: 1, nextFilter: filter });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  // reload when page/filter changes
  useEffect(() => {
    if (!lang) return;
    loadMessages({ nextPage: page, nextFilter: filter });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filter]);

  const stats = useMemo(() => {
    // لو API عندك مش بيرجع counts منفصلة، هنستنتج اللي نقدر عليه من اللي ظاهر في الصفحة
    const unread = items.filter((m) => !m.is_read).length;
    const read = items.filter((m) => m.is_read).length;
    return { unread, read, total: meta.total };
  }, [items, meta.total]);

  async function toggleRead(msg) {
    setBusyId(msg.id);
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: msg.id, is_read: !msg.is_read }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed");

      // update locally
      setItems((prev) => prev.map((m) => (m.id === msg.id ? { ...m, is_read: !m.is_read } : m)));
      if (selected?.id === msg.id) setSelected((s) => ({ ...s, is_read: !s.is_read }));
    } catch {
      alert(t("فشل تعديل حالة الرسالة.", "Failed to update message status."));
    } finally {
      setBusyId(null);
    }
  }

  async function deleteMsg(id) {
    const ok = confirm(t("هل أنت متأكد من حذف هذه الرسالة؟", "Are you sure you want to delete this message?"));
    if (!ok) return;

    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/messages?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed");

      setSelected((s) => (s?.id === id ? null : s));
      // reload current page (to keep pagination right)
      await loadMessages({ nextPage: page, nextFilter: filter });
    } catch {
      alert(t("فشل حذف الرسالة.", "Failed to delete message."));
    } finally {
      setBusyId(null);
    }
  }

  function openMsg(msg) {
    setSelected(msg);
    // لو مش مقروءة خليها مقروءة تلقائيًا
    if (!msg.is_read) toggleRead(msg);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push(`/${lang}/admin/dashboard`)}
                className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                title={t("رجوع", "Back")}
              >
                <ArrowLeft size={20} />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold text-navy">{t("الرسائل الواردة", "Incoming Messages")}</h1>
                <p className="text-gray-500 text-sm mt-1">{t("عرض وإدارة رسائل العملاء", "View and manage customer messages")}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => loadMessages({ nextPage: page, nextFilter: filter })}
                className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center gap-2"
              >
                <RefreshCw size={16} />
                {t("تحديث", "Refresh")}
              </motion.button>

              <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                {[
                  { key: "all", label: t("الكل", "All"), hint: stats.total },
                  { key: "unread", label: t("غير مقروءة", "Unread"), hint: stats.unread },
                  { key: "read", label: t("مقروءة", "Read"), hint: stats.read },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => {
                      setPage(1);
                      setFilter(tab.key);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      filter === tab.key ? "bg-white text-navy shadow-sm" : "text-gray-600 hover:text-navy"
                    }`}
                  >
                    {tab.label} ({tab.hint})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center text-gray-500">
            {t("جاري التحميل...", "Loading...")}
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-10 text-center">
            <p className="text-red-600 font-medium mb-2">{t("خطأ", "Error")}</p>
            <p className="text-gray-600">{error}</p>
          </div>
        ) : items.length === 0 ? (
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
          <>
            <div className="grid grid-cols-1 gap-4">
              {items.map((msg, idx) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  onClick={() => openMsg(msg)}
                  className={`bg-white rounded-2xl shadow-sm border hover:shadow-md transition cursor-pointer ${
                    msg.is_read ? "border-gray-100" : "border-blue-200 bg-blue-50/30"
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-start gap-3 flex-1">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            msg.is_read ? "bg-gray-100 text-gray-600" : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {msg.is_read ? <MailOpen size={22} /> : <Mail size={22} />}
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
                              {new Date(msg.created_at).toLocaleString(lang === "ar" ? "ar-EG" : "en-US")}
                            </span>
                          </div>

                          <p className="text-gray-600 line-clamp-2">{msg.message}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRead(msg);
                          }}
                          disabled={busyId === msg.id}
                          className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm disabled:opacity-50"
                          title={t("تغيير حالة القراءة", "Toggle read")}
                        >
                          {msg.is_read ? t("اجعلها غير مقروءة", "Mark unread") : t("تحديد كمقروءة", "Mark read")}
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteMsg(msg.id);
                          }}
                          disabled={busyId === msg.id}
                          className="w-10 h-10 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center disabled:opacity-50"
                          title={t("حذف", "Delete")}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    {!msg.is_read && (
                      <div className="inline-flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        <CheckCircle size={16} />
                        {t("رسالة جديدة", "New message")}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                {t("الإجمالي", "Total")}: {meta.total}
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page <= 1}
                >
                  {t("السابق", "Prev")}
                </button>
                <div className="px-3 py-2 text-sm text-gray-700">
                  {t("صفحة", "Page")} {page} / {meta.totalPages}
                </div>
                <button
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                  onClick={() => setPage((p) => Math.min(p + 1, meta.totalPages))}
                  disabled={page >= meta.totalPages}
                >
                  {t("التالي", "Next")}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ y: 30, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-100 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-navy">{selected.name}</h3>
                  <div className="text-sm text-gray-500 mt-1 flex flex-wrap gap-3">
                    <span className="inline-flex items-center gap-1">
                      <Mail size={14} /> {selected.email}
                    </span>
                    {selected.phone && (
                      <span className="inline-flex items-center gap-1">
                        <Phone size={14} /> {selected.phone}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={14} /> {new Date(selected.created_at).toLocaleString(lang === "ar" ? "ar-EG" : "en-US")}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelected(null)}
                  className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                  title={t("إغلاق", "Close")}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6">
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {selected.message}
                </div>

                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-500 inline-flex items-center gap-2">
                    <span className="inline-flex items-center gap-1">
                      {selected.is_read ? <MailOpen size={16} /> : <Mail size={16} />}
                      {selected.is_read ? t("مقروءة", "Read") : t("غير مقروءة", "Unread")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleRead(selected)}
                      disabled={busyId === selected.id}
                      className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                    >
                      {selected.is_read ? t("اجعلها غير مقروءة", "Mark unread") : t("تحديد كمقروءة", "Mark read")}
                    </button>

                    <button
                      onClick={() => deleteMsg(selected.id)}
                      disabled={busyId === selected.id}
                      className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 disabled:opacity-50 inline-flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      {t("حذف", "Delete")}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
