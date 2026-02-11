"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [lang, setLang] = useState("ar");

  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const parts = window.location.pathname.split("/");
    if (parts[1] === "en") setLang("en");
  }, []);

  const t = (ar, en) => (lang === "ar" ? ar : en);

  // لو مسجّل بالفعل
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/me", { cache: "no-store" });
      if (res.ok) router.replace(`/${lang}/admin/dashboard`);
    })();
  }, [lang, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user, password: pass }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Invalid");

      router.push(`/${lang}/admin/dashboard`);
    } catch {
      setError(t("اسم المستخدم أو كلمة المرور غير صحيحة", "Invalid username or password"));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-navy-dark to-navy p-6 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }} className="mx-auto w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-3">
              <Shield size={32} className="text-gold" />
            </motion.div>
            <h1 className="text-xl font-bold text-white">{t("لوحة التحكم", "Admin Dashboard")}</h1>
            <p className="text-white/60 text-sm mt-1">{t("تسجيل دخول الإدارة", "Administrator Login")}</p>
          </div>

          <form onSubmit={handleLogin} className="p-6 space-y-4">
            {error && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm text-center">
                {error}
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("اسم المستخدم", "Username")}</label>
              <input
                type="text"
                required
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-navy focus:ring-2 focus:ring-navy/10 outline-none transition text-sm"
                placeholder={t("أدخل اسم المستخدم", "Enter username")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("كلمة المرور", "Password")}</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-navy focus:ring-2 focus:ring-navy/10 outline-none transition text-sm"
                  placeholder={t("أدخل كلمة المرور", "Enter password")}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-4 bg-gradient-to-r from-navy to-navy-dark text-white font-bold rounded-xl hover:shadow-lg transition-shadow flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
              ) : (
                <>
                  <Lock size={18} />
                  {t("تسجيل الدخول", "Log In")}
                </>
              )}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
