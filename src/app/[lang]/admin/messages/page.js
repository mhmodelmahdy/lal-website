"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  const [size, setSize] = useState(10);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });

  const [selected, setSelected] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const parts = window.location.pathname.split("/");
    if (parts[1] === "en") setLang("en");
    else setLang("ar");
  }, []);

  async function loadMessages({ nextPage = page, nextFilter = filter } = {}) {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setError("");

    try {
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

      if (requestId !== requestIdRef.current) return;

      const data = json?.data || {};
      setItems(Array.isArray(data.items) ? data.items : []);
      setMeta({
        total: data.total ?? 0,
        totalPages: data.totalPages ?? 1,
      });
    } catch (e) {
      setError(t("حصلت مشكلة أثناء تحميل الرسائل.", "Failed to load messages."));
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    if (!lang) return;
    loadMessages({ nextPage: page, nextFilter: filter });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, page, filter, size]);

  const stats = useMemo(() => {
    const unread = items.filter((m) => !m.is_read).length;
    const read = items.filter((m) => m.is_read).length;
    return { unread, read, total: meta.total };
  }, [items, meta.total]);

  const pageNumbers = useMemo(() => {
    const totalPages = Math.max(1, meta.totalPages || 1);
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + 4);
    const adjustedStart = Math.max(1, end - 4);
    return Array.from({ length: end - adjustedStart + 1 }, (_, idx) => adjustedStart + idx);
  }, [meta.totalPages, page]);

  const fromItem = meta.total === 0 ? 0 : (page - 1) * size + 1;
  const toItem = Math.min(page * size, meta.total);

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
      await loadMessages({ nextPage: page, nextFilter: filter });
    } catch {
      alert(t("فشل حذف الرسالة.", "Failed to delete message."));
    } finally {
      setBusyId(null);
    }
  }

  function openMsg(msg) {
    setSelected(msg);
    if (!msg.is_read) toggleRead(msg);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Title Section */}
            <div className="flex items-center gap-3 md:gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push(`/${lang}/admin/dashboard`)}
                className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition shrink-0"
                title={t("رجوع", "Back")}
              >
                <ArrowLeft size={20} />
              </motion.button>
              <div className="min-w-0"> {/* min-w-0 لمنع خروج النص عن الشاشة */}
                <h1 className="text-xl md:text-2xl font-bold text-navy truncate">{t("الرسائل الواردة", "Incoming Messages")}</h1>
                <p className="text-gray-500 text-xs md:text-sm mt-1 truncate">{t("عرض وإدارة رسائل العملاء", "View and manage customer messages")}</p>
              </div>
            </div>

            {/* Actions & Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => loadMessages({ nextPage: page, nextFilter: filter })}
                className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center gap-2 shrink-0 w-full sm:w-auto text-sm md:text-base"
              >
                <RefreshCw size={16} />
                {t("تحديث", "Refresh")}
              </motion.button>

              {/* أزرار الفلترة قابلة للتمرير على الموبايل */}
              <select
                value={size}
                onChange={(e) => {
                  setPage(1);
                  setSize(Number(e.target.value) || 10);
                }}
                className="px-3 py-2 rounded-xl bg-white border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-navy/20"
                aria-label={t("Page size", "Page size")}
              >
                {[10, 20, 50].map((x) => (
                  <option key={x} value={x}>
                    {t("Per page", "Per page")}: {x}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-1 sm:gap-2 bg-gray-100 rounded-xl p-1 overflow-x-auto w-full sm:w-auto hide-scrollbar">
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
                    className={`whitespace-nowrap px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
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

      <div className="container mx-auto px-4 py-6 md:py-8">
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10 text-center text-gray-500">
            {t("جاري التحميل...", "Loading...")}
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8 md:p-10 text-center">
            <p className="text-red-600 font-medium mb-2">{t("خطأ", "Error")}</p>
            <p className="text-gray-600 text-sm md:text-base">{error}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 text-center">
            <MessageSquare size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-base md:text-lg">
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
                  className={`bg-white rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden border ${
                    msg.is_read ? "border-gray-100" : "border-blue-200 bg-blue-50/20"
                  }`}
                >
                  <div className="p-4 sm:p-5 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      
                      {/* معلومات الرسالة */}
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ${
                            msg.is_read ? "bg-gray-100 text-gray-600" : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {msg.is_read ? <MailOpen size={20} /> : <Mail size={20} />}
                        </div>

                        <div className="flex-1 min-w-0"> {/* min-w-0 مهم جداً لعمل truncate داخل flex */}
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h3 className="text-base sm:text-lg font-bold text-navy truncate">{msg.name}</h3>
                            {!msg.is_read && (
                              <div className="shrink-0 flex items-center gap-1 text-[10px] sm:text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full font-medium">
                                <CheckCircle size={12} />
                                {t("جديدة", "New")}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-1 sm:gap-3 text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
                            <span className="flex items-center gap-1.5 truncate max-w-full">
                              <Mail size={14} className="shrink-0" />
                              <span className="truncate">{msg.email}</span>
                            </span>
                            {msg.phone && (
                              <span className="flex items-center gap-1.5 shrink-0">
                                <Phone size={14} />
                                {msg.phone}
                              </span>
                            )}
                            <span className="flex items-center gap-1.5 shrink-0">
                              <Calendar size={14} />
                              {new Date(msg.created_at).toLocaleString(lang === "ar" ? "ar-EG" : "en-US", {
                                dateStyle: "short",
                                timeStyle: "short",
                              })}
                            </span>
                          </div>

                          <p className="text-gray-600 text-sm line-clamp-2 md:line-clamp-1">{msg.message}</p>
                        </div>
                      </div>

                      {/* أزرار الإجراءات - ستكون بالأسفل في الموبايل وبجوار النص في الديسكتوب */}
                      <div className="flex items-center justify-end gap-2 border-t border-gray-100 md:border-0 pt-3 md:pt-0 mt-2 md:mt-0 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRead(msg);
                          }}
                          disabled={busyId === msg.id}
                          className="flex-1 md:flex-none px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs sm:text-sm font-medium disabled:opacity-50 text-center"
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
                          className="w-10 h-10 sm:w-auto sm:px-3 sm:py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 flex items-center justify-center gap-2 disabled:opacity-50 shrink-0"
                          title={t("حذف", "Delete")}
                        >
                          <Trash2 size={16} />
                          <span className="hidden sm:block text-sm font-medium">{t("حذف", "Delete")}</span>
                        </button>
                      </div>

                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-4 mt-8">
              <div className="text-sm text-gray-500 font-medium text-center sm:text-left">
                {t("الإجمالي", "Total")}: {meta.total}
              </div>
              <div className="text-xs text-gray-500 text-center sm:text-left">
                {t("Showing", "Showing")} {fromItem}-{toItem}
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2">
                <button
                  className="px-4 py-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 text-sm font-medium"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page <= 1}
                >
                  {t("السابق", "Prev")}
                </button>
                {pageNumbers.map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    className={`w-10 h-10 rounded-xl border text-sm font-medium transition ${
                      page === pageNumber
                        ? "bg-navy text-white border-navy"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
                <button
                  className="px-4 py-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-50 text-sm font-medium"
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

      {/* Modal / النافذة المنبثقة */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ y: 30, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header ثابت لا يتحرك عند التمرير */}
              <div className="p-4 sm:p-6 border-b border-gray-100 flex items-start justify-between gap-4 shrink-0 bg-white">
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-navy truncate">{selected.name}</h3>
                  <div className="text-xs sm:text-sm text-gray-500 mt-2 flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4">
                    <span className="flex items-center gap-1.5 truncate max-w-full">
                      <Mail size={14} className="shrink-0" />
                      <span className="truncate">{selected.email}</span>
                    </span>
                    {selected.phone && (
                      <span className="flex items-center gap-1.5 shrink-0">
                        <Phone size={14} /> {selected.phone}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setSelected(null)}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center shrink-0 transition"
                  title={t("إغلاق", "Close")}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body قابل للتمرير */}
              <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar">
                
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 bg-gray-50 w-fit px-3 py-1.5 rounded-lg border border-gray-100">
                  <Calendar size={14} />
                  {new Date(selected.created_at).toLocaleString(lang === "ar" ? "ar-EG" : "en-US")}
                </div>

                {/* كسر الكلمات الطويلة بـ break-words لتجنب تشوه التصميم */}
                <div className="bg-blue-50/30 border border-blue-100/50 rounded-2xl p-4 sm:p-5 text-gray-800 whitespace-pre-wrap leading-relaxed text-sm sm:text-base break-words">
                  {selected.message}
                </div>
              </div>

              {/* Modal Footer ثابت في الأسفل */}
              <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm font-medium text-gray-500 flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
                  {selected.is_read ? <MailOpen size={16} /> : <Mail size={16} />}
                  {selected.is_read ? t("مقروءة", "Read") : t("غير مقروءة", "Unread")}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => toggleRead(selected)}
                    disabled={busyId === selected.id}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 text-sm font-medium disabled:opacity-50 transition"
                  >
                    {selected.is_read ? t("غير مقروءة", "Mark unread") : t("مقروءة", "Mark read")}
                  </button>

                  <button
                    onClick={() => {
                      deleteMsg(selected.id);
                      setSelected(null); // غلق المودال بعد الحذف
                    }}
                    disabled={busyId === selected.id}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2 transition shadow-sm shadow-red-200"
                  >
                    <Trash2 size={16} />
                    {t("حذف نهائي", "Delete")}
                  </button>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
