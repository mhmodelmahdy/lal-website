"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";
import PageTitle from "@/components/PageTitle"; // عدّل المسار حسب مشروعك

export default function ContactPage() {
  const [lang, setLang] = useState("ar");

  useEffect(() => {
    const parts = window.location.pathname.split("/");
    setLang(parts?.[1] === "en" ? "en" : "ar");
  }, []);

  const t = (ar, en) => (lang === "ar" ? ar : en);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/${lang}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Failed");

      setSuccess(true);
      setFormData({ name: "", email: "", phone: "", message: "" });

      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError(
        t(
          "حصلت مشكلة أثناء الإرسال. جرّب تاني.",
          "Something went wrong. Please try again."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageTitle
        title={t("تواصل معنا", "Contact Us")}
        subtitle={t("يسعدنا استقبال رسالتك", "We'd love to hear from you")}
      />

      <section className="py-14 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-navy mb-6">
                {t("أرسل لنا رسالة", "Send us a Message")}
              </h2>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm text-center">
                  {error}
                </div>
              )}

              {success ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-10"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.15, type: "spring" }}
                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center"
                  >
                    <CheckCircle size={48} className="text-green-600" />
                  </motion.div>

                  <h3 className="text-2xl font-bold text-navy mb-3">
                    {t(
                      "تم إرسال رسالتك بنجاح!",
                      "Message Sent Successfully!"
                    )}
                  </h3>
                  <p className="text-gray-600">
                    {t(
                      "شكراً لتواصلك معنا. سنرد عليك في أقرب وقت.",
                      "Thank you for contacting us. We'll get back to you soon."
                    )}
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("الاسم", "Name")} *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-navy focus:ring-2 focus:ring-navy/10 outline-none transition"
                      placeholder={t("أدخل اسمك", "Enter your name")}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("البريد الإلكتروني", "Email")} *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-navy focus:ring-2 focus:ring-navy/10 outline-none transition"
                      placeholder={t(
                        "أدخل بريدك الإلكتروني",
                        "Enter your email"
                      )}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("رقم الهاتف", "Phone")}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-navy focus:ring-2 focus:ring-navy/10 outline-none transition"
                      placeholder={t(
                        "أدخل رقم هاتفك",
                        "Enter your phone number"
                      )}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("الرسالة", "Message")} *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-navy focus:ring-2 focus:ring-navy/10 outline-none transition resize-none"
                      placeholder={t(
                        "اكتب رسالتك هنا",
                        "Write your message here"
                      )}
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    className="w-full px-8 py-4 bg-gradient-to-r from-navy to-navy-dark text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                          ease: "linear",
                        }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      <>
                        <Send size={20} />
                        {t("إرسال الرسالة", "Send Message")}
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
