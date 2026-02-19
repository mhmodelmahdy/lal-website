"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Save, Search, RefreshCw } from "lucide-react";

const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

export default function AdminNewsPage() {
  const router = useRouter();
  const [lang, setLang] = useState("ar");
  const t = (ar, en) => (lang === "ar" ? ar : en);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [size] = useState(20);

  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 });

  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState("create"); // create | edit
  const [busy, setBusy] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  const emptyForm = {
    id: null,
    title_ar: "",
    title_en: "",
    content_ar: "",
    content_en: "",
    image: "",
    date: "",
    is_published: true,
  };

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const parts = window.location.pathname.split("/");
    if (parts[1] === "en") setLang("en");
    else setLang("ar");
  }, []);

  async function ensureAdmin() {
    const res = await fetch("/api/admin/me", { cache: "no-store" });
    if (!res.ok) {
      router.replace(`/${lang}/admin`);
      return false;
    }
    return true;
  }

  async function load() {
    setLoading(true);
    setError("");
    try {
      const ok = await ensureAdmin();
      if (!ok) return;

      const qs = new URLSearchParams({
        page: String(page),
        size: String(size),
      });
      if (q.trim()) qs.set("q", q.trim());

      const res = await fetch(`/api/admin/news?${qs.toString()}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed");

      const data = json?.data || {};
      setItems(Array.isArray(data.items) ? data.items : []);
      setMeta({ total: data.total ?? 0, totalPages: data.totalPages ?? 1 });
    } catch {
      setError(t("حصلت مشكلة أثناء تحميل الأخبار.", "Failed to load news."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!lang) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, page]);

  const stats = useMemo(() => {
    const published = items.filter((x) => x.is_published).length;
    const hidden = items.filter((x) => !x.is_published).length;
    return { published, hidden };
  }, [items]);

  function openCreate() {
    setMode("create");
    setForm({ ...emptyForm, date: new Date().toISOString().slice(0, 10), is_published: true });
    setSelectedImageFile(null);
    setModalOpen(true);
  }

  function openEdit(item) {
    setMode("edit");
    setForm({
      id: item.id,
      title_ar: item.title_ar || "",
      title_en: item.title_en || "",
      content_ar: item.content_ar || "",
      content_en: item.content_en || "",
      image: item.image || "",
      date: item.date ? String(item.date).slice(0, 10) : new Date().toISOString().slice(0, 10),
      is_published: !!item.is_published,
    });
    setSelectedImageFile(null);
    setModalOpen(true);
  }

  async function uploadImage(file) {
    if (!file) return form.image || "";

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      throw new Error(t("نوع الصورة غير مدعوم.", "Unsupported image type."));
    }
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      throw new Error(
        t(`حجم الصورة يجب ألا يزيد عن ${MAX_IMAGE_SIZE_MB}MB.`, `Image size must be <= ${MAX_IMAGE_SIZE_MB}MB.`)
      );
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.set("file", file);

      const res = await fetch("/api/admin/news/upload", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Upload failed");
      return String(json?.data?.url || "").trim();
    } finally {
      setUploadingImage(false);
    }
  }

  async function save() {
    setBusy(true);
    try {
      const uploadedImageUrl = selectedImageFile ? await uploadImage(selectedImageFile) : form.image;
      const payload = {
        ...form,
        image: uploadedImageUrl || "",
        date: form.date ? new Date(form.date).toISOString() : new Date().toISOString(),
      };

      const res = await fetch("/api/admin/news", {
        method: mode === "create" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed");

      setModalOpen(false);
      setSelectedImageFile(null);
      await load();
    } catch (e) {
      const fallbackMessage = t("فشل حفظ الخبر. تأكد من إدخال كل الحقول.", "Failed to save. Please fill all fields.");
      alert(String(e?.message || fallbackMessage));
    } finally {
      setBusy(false);
    }
  }

  async function togglePublish(item) {
    try {
      const res = await fetch("/api/admin/news", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, is_published: !item.is_published }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed");

      setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, is_published: !x.is_published } : x)));
    } catch {
      alert(t("فشل تغيير حالة النشر.", "Failed to toggle publish."));
    }
  }

  async function remove(id) {
    const ok = confirm(t("متأكد إنك عايز تحذف الخبر؟", "Are you sure you want to delete this news?"));
    if (!ok) return;

    try {
      const res = await fetch(`/api/admin/news?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Failed");
      await load();
    } catch {
      alert(t("فشل حذف الخبر.", "Failed to delete news."));
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-navy">{t("إدارة الأخبار", "News Management")}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {t("تحكم في الأخبار اللي بتظهر للناس", "Control which news appear to the public")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => load()}
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 inline-flex items-center gap-2"
            >
              <RefreshCw size={16} />
              {t("تحديث", "Refresh")}
            </button>

            <button
              onClick={openCreate}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-navy to-navy-dark text-white font-bold inline-flex items-center gap-2"
            >
              <Plus size={18} />
              {t("إضافة خبر", "Add News")}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t("بحث...", "Search...")}
                className="pl-9 pr-3 py-2 rounded-xl border border-gray-200 focus:border-navy focus:ring-2 focus:ring-navy/10 outline-none"
              />
            </div>
            <button
              onClick={() => {
                setPage(1);
                load();
              }}
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200"
            >
              {t("بحث", "Search")}
            </button>
          </div>

          <div className="text-sm text-gray-600">
            {t("منشور", "Published")}: <b>{stats.published}</b> — {t("مخفي", "Hidden")}: <b>{stats.hidden}</b> — {t("الإجمالي", "Total")}: <b>{meta.total}</b>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center text-gray-500">
            {t("جاري التحميل...", "Loading...")}
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-10 text-center">
            <p className="text-red-600 font-medium">{t("خطأ", "Error")}</p>
            <p className="text-gray-600 mt-2">{error}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center text-gray-500">
            {t("لا توجد أخبار", "No news")}
          </div>
        ) : (
          <>
            <div className="grid gap-4">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="min-w-[260px] flex-1">
                      <div className="text-sm text-gray-500 mb-1">{new Date(item.date).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US")}</div>
                      <div className="text-lg font-bold text-navy">{lang === "ar" ? item.title_ar : item.title_en}</div>
                      <div className="text-gray-600 mt-2 line-clamp-2">{lang === "ar" ? item.content_ar : item.content_en}</div>
                      {item.image && <div className="text-xs text-gray-400 mt-2">image: {item.image}</div>}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => togglePublish(item)}
                        className={`px-4 py-2 rounded-xl inline-flex items-center gap-2 ${
                          item.is_published ? "bg-green-50 text-green-700 hover:bg-green-100" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {item.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
                        {item.is_published ? t("منشور", "Published") : t("مخفي", "Hidden")}
                      </button>

                      <button
                        onClick={() => openEdit(item)}
                        className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 inline-flex items-center gap-2"
                      >
                        <Pencil size={16} />
                        {t("تعديل", "Edit")}
                      </button>

                      <button
                        onClick={() => remove(item.id)}
                        className="px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 inline-flex items-center gap-2"
                      >
                        <Trash2 size={16} />
                        {t("حذف", "Delete")}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                {t("صفحة", "Page")} {page} / {meta.totalPages}
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page <= 1}
                >
                  {t("السابق", "Prev")}
                </button>
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
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ y: 30, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div className="text-lg font-bold text-navy">
                  {mode === "create" ? t("إضافة خبر", "Add News") : t("تعديل خبر", "Edit News")}
                </div>
                <button onClick={() => setModalOpen(false)} className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 grid md:grid-cols-2 gap-4">
                <input
                  value={form.title_ar}
                  onChange={(e) => setForm((f) => ({ ...f, title_ar: e.target.value }))}
                  className="px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-navy focus:ring-2 focus:ring-navy/10"
                  placeholder="العنوان (AR)"
                />
                <input
                  value={form.title_en}
                  onChange={(e) => setForm((f) => ({ ...f, title_en: e.target.value }))}
                  className="px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-navy focus:ring-2 focus:ring-navy/10"
                  placeholder="Title (EN)"
                />

                <textarea
                  value={form.content_ar}
                  onChange={(e) => setForm((f) => ({ ...f, content_ar: e.target.value }))}
                  rows={6}
                  className="px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 resize-none"
                  placeholder="المحتوى (AR)"
                />
                <textarea
                  value={form.content_en}
                  onChange={(e) => setForm((f) => ({ ...f, content_en: e.target.value }))}
                  rows={6}
                  className="px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-navy focus:ring-2 focus:ring-navy/10 resize-none"
                  placeholder="Content (EN)"
                />

                <div className="md:col-span-2 rounded-xl border border-gray-200 p-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">{t("الصورة", "Image")}</div>
                  <input
                    type="file"
                    accept={ALLOWED_IMAGE_TYPES.join(",")}
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setSelectedImageFile(file);
                    }}
                    className="block w-full text-sm text-gray-700 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-200"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {t(`الأنواع المسموحة: JPG, PNG, WEBP, GIF, AVIF - أقصى حجم ${MAX_IMAGE_SIZE_MB}MB`, `Allowed: JPG, PNG, WEBP, GIF, AVIF - Max ${MAX_IMAGE_SIZE_MB}MB`)}
                  </p>

                  {selectedImageFile && (
                    <div className="text-xs text-blue-700 mt-2">
                      {t("ملف جديد:", "New file:")} {selectedImageFile.name}
                    </div>
                  )}

                  {form.image && (
                    <div className="mt-2 flex items-center gap-3 flex-wrap">
                      <a
                        href={form.image}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-gray-600 underline break-all"
                      >
                        {t("الصورة الحالية", "Current image")}
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          setForm((f) => ({ ...f, image: "" }));
                          setSelectedImageFile(null);
                        }}
                        className="text-xs px-2 py-1 rounded-md bg-red-50 text-red-700 hover:bg-red-100"
                      >
                        {t("إزالة الصورة", "Remove image")}
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    className="px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-navy focus:ring-2 focus:ring-navy/10"
                  />
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={form.is_published}
                      onChange={(e) => setForm((f) => ({ ...f, is_published: e.target.checked }))}
                    />
                    {t("منشور", "Published")}
                  </label>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200"
                >
                  {t("إلغاء", "Cancel")}
                </button>

                <button
                  onClick={save}
                  disabled={busy || uploadingImage}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-navy to-navy-dark text-white font-bold inline-flex items-center gap-2 disabled:opacity-50"
                >
                  <Save size={16} />
                  {uploadingImage ? t("جارٍ رفع الصورة...", "Uploading image...") : t("حفظ", "Save")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
