"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Anchor,
  ArrowUp,
} from "lucide-react";

import { company } from "../data/company";

// 1. مكون مخصص لأيقونة تيك توك الأصلية
const TikTokIcon = ({ size = 24, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

export default function Footer({ lang }) {
  const isRTL = lang === "ar";
  const t = (ar, en) => (lang === "ar" ? ar : en);

  const quickLinks = [
    { href: `/${lang}`, label: t("الرئيسية", "Home") },
    { href: `/${lang}/about`, label: t("من نحن", "About") },
    { href: `/${lang}/services`, label: t("المنتجات والخدمات", "Services") },
    { href: `/${lang}/management`, label: t("الهيكل الإداري", "Management") },
    { href: `/${lang}/news`, label: t("الأخبار", "News") },
    { href: `/${lang}/contact`, label: t("تواصل معنا", "Contact") },
    { href: `/${lang}/support`, label: t("الدعم", "Support") },
  ];

  const portalLinks = [
    { href: `/${lang}/portals/clients`, label: t("بوابة العملاء", "Client Portal") },
    { href: `/${lang}/portals/partners`, label: t("بوابة الشركاء", "Partners Portal") },
    { href: `/${lang}/portals/suppliers`, label: t("بوابة الموردين", "Suppliers Portal") },
  ];

  const socials = company.socials || {};

  const socialItems = [
    {
      id: "facebook",
      href: socials.facebook ||
        "https://www.facebook.com/share/18HUjRMven/?mibextid=wwXIfr",
      Icon: Facebook,
    },
    {
      id: "instagram",
      href:
        socials.instagram ||
        "https://www.instagram.com/lalmultiactivities?igsh=amNtajV3eGQxeGZy",
      Icon: Instagram,
    },
    {
      id: "tiktok",
      href:
        socials.tiktok ||
        "https://www.tiktok.com/@lalmuwtdx5h?_r=1&_t=ZS-9424mCaAf8H",
      Icon: TikTokIcon, // استخدام الأيقونة الجديدة هنا
    },
  ].filter((item) => typeof item.href === "string" && item.href.trim() !== "");

  return (
    <footer className="bg-navy-dark text-white relative overflow-hidden">
      {/* تمت إضافة pointer-events-none هنا 
         للتأكد من أن هذه الخلفيات لا تمنع النقر على الروابط
      */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-navy-light/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold text-gold mb-4">
              {company.name[lang]}
            </h3>

            <p className="text-white/70 text-sm leading-7 mb-6">
              {company.aboutShort[lang]}
            </p>

            <div className="flex items-center gap-2">
              {socialItems.map(({ id, href, Icon }) => (
                <motion.a
                  key={id}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold/80 transition-colors cursor-pointer z-20 relative"
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">
              {t("روابط سريعة", "Quick Links")}
            </h3>

            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 text-sm hover:text-gold transition-colors transition-transform transform hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">
              {t("البوابات", "Portals")}
            </h3>

            <ul className="space-y-2">
              {portalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 text-sm hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-lg font-bold text-white mt-6 mb-3 flex items-center gap-2">
              <Anchor size={16} className="text-gold" />
              {t("الموانئ", "Ports")}
            </h3>

            <div className="flex flex-wrap gap-1.5">
              {company.ports.map((p) => (
                <span
                  key={p.en}
                  className="text-[11px] px-2 py-1 rounded-full bg-white/10 text-white/70"
                >
                  {p[lang]}
                </span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">
              {t("تواصل معنا", "Contact Us")}
            </h3>

            <ul className="space-y-3">
              {company.phones.map((ph) => (
                <li key={ph}>
                  <a
                    href={`tel:${ph}`}
                    className="flex items-center gap-2 text-white/70 text-sm hover:text-gold transition-colors"
                  >
                    <Phone size={14} className="text-gold shrink-0" />
                    <span dir="ltr">{ph}</span>
                  </a>
                </li>
              ))}

              {company.email?.[lang] && (
                <li>
                  <a
                    href={`mailto:${company.email[lang]}`}
                    className="flex items-center gap-2 text-white/70 text-sm hover:text-gold transition-colors"
                  >
                    <Mail size={14} className="text-gold shrink-0" />
                    <span dir="ltr">{company.email[lang]}</span>
                  </a>
                </li>
              )}

              <li className="flex items-start gap-2 text-white/70 text-sm">
                <MapPin size={14} className="text-gold shrink-0 mt-0.5" />
                <span>
                  <div>
                    {t("الفرع الرئيسي : بورتسودان", "Main Branch: Port Sudan")}
                  </div>
                  <div>
                    {t(
                      "فروعنا : الخرطوم - مدني - عطبره - الابيض",
                      "Our branches: Khartoum - Madani - Atbara - El Obeid"
                    )}
                  </div>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex items-center justify-between">
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} {company.name[lang]}
          </p>

          <motion.button
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="w-10 h-10 rounded-full bg-gold/20 hover:bg-gold/40 flex items-center justify-center cursor-pointer z-20"
          >
            <ArrowUp size={18} className="text-gold" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}