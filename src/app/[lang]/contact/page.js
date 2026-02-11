"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";

export default function ContactClient({ lang, company }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const t = (ar, en) => (lang === "ar" ? ar : en);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate sending delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Save message to localStorage
    const messages = JSON.parse(localStorage.getItem("lal_messages") || "[]");
    const newMessage = {
      id: Date.now().toString(),
      ...formData,
      read: false,
      createdAt: new Date().toISOString(),
    };
    messages.push(newMessage);
    localStorage.setItem("lal_messages", JSON.stringify(messages));

    setLoading(false);
    setSuccess(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({ name: "", email: "", phone: "", message: "" });
      setSuccess(false);
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: t("العنوان", "Address"),
      value: company.address[lang],
      link: company.mapLink,
    },
    {
      icon: Phone,
      title: t("الهاتف", "Phone"),
      value: company.phone,
      link: `tel:${company.phone}`,
    },
    {
      icon: Mail,
      title: t("البريد الإلكتروني", "Email"),
      value: company.email,
      link: `mailto:${company.email}`,
    },
    {
      icon: Clock,
      title: t("ساعات العمل", "Working Hours"),
      value: company.workingHours[lang],
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-6">
              {contactInfo.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ x: 5 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-navy to-navy-dark flex items-center justify-center flex-shrink-0">
                      <item.icon size={24} className="text-gold" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-navy mb-2">
                        {item.title}
                      </h3>
                      {item.link ? (
                        <a
                          href={item.link}
                          target={item.icon === MapPin ? "_blank" : undefined}
                          rel={item.icon === MapPin ? "noopener noreferrer" : undefined}
                          className="text-gray-600 hover:text-navy transition"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-gray-600">{item.value}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Map */}
            {company.mapLink && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="mt-8 rounded-2xl overflow-hidden shadow-lg border border-gray-200"
              >
                <iframe
                  src={company.mapLink}
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={t("موقعنا على الخريطة", "Our Location")}
                />
              </motion.div>
            )}
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-navy mb-6">
                {t("أرسل لنا رسالة", "Send us a Message")}
              </h2>

              {success ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center"
                  >
                    <CheckCircle size={48} className="text-green-600" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-navy mb-3">
                    {t("تم إرسال رسالتك بنجاح!", "Message Sent Successfully!")}
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
                  {/* Name */}
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

                  {/* Email */}
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
                      placeholder={t("أدخل بريدك الإلكتروني", "Enter your email")}
                    />
                  </div>

                  {/* Phone */}
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
                      placeholder={t("أدخل رقم هاتفك", "Enter your phone number")}
                    />
                  </div>

                  {/* Message */}
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
                      placeholder={t("اكتب رسالتك هنا", "Write your message here")}
                    />
                  </div>

                  {/* Submit Button */}
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
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
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
      </div>
    </section>
  );
}