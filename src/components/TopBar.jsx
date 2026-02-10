"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Mail, Phone, Facebook, Linkedin, Youtube } from "lucide-react";
import { company } from "../data/company";

export default function TopBar({ lang, reserveSide = "right" }) {
  const isRTL = lang === "ar";
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date().toLocaleTimeString(isRTL ? "ar-EG" : "en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });
      setTime(now);
    };
    update();
    const i = setInterval(update, 60000);
    return () => clearInterval(i);
  }, [isRTL]);

  const email = company.email?.[lang] || "";
  const phone = company.phones?.[0] || "";
  const socials = company.socials || {};

  // مساحة محجوزة عشان اللوجو ما يركبش على المحتوى
  const sidePadding =
    reserveSide === "right"
      ? "pr-[220px] md:pr-[240px]"
      : "pl-[220px] md:pl-[240px]";

  // في العربي نخلي المحتوى يبدأ من اليمين (start) لكن مع مساحة اللوجو
  // في الإنجليزي نخلي المحتوى يمين (end) برضه زي الصورة
  const justify = "justify-start";

  return (
    <motion.div
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.28 }}
      className="bg-white"
    >
      <div className={`mx-auto max-w-7xl px-4 h-10 flex items-center ${justify} ${sidePadding} gap-6 text-[13px] text-gray-700`}>
        {/* Social */}
        <div className="flex items-center gap-3">
          <a href={socials.youtube || "#"} target="_blank" rel="noreferrer" aria-label="YouTube" className="p-1 hover:text-gray-900 transition">
            <Youtube size={16} />
          </a>
          <a href={socials.linkedin || "#"} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="p-1 hover:text-gray-900 transition">
            <Linkedin size={16} />
          </a>
          <a href={socials.facebook || "#"} target="_blank" rel="noreferrer" aria-label="Facebook" className="p-1 hover:text-gray-900 transition">
            <Facebook size={16} />
          </a>
        </div>

        {/* Phone */}
        {phone ? (
          <a href={`tel:${phone}`} className="hidden md:flex items-center gap-2 hover:text-gray-900 transition">
            <Phone size={16} className="text-gray-500" />
            <span dir="ltr" className="text-left" style={{ unicodeBidi: "plaintext" }}>
              {phone}
            </span>
          </a>
        ) : null}

        {/* Email */}
        {email ? (
          <a href={`mailto:${email}`} className="hidden sm:flex items-center gap-2 hover:text-gray-900 transition">
            <Mail size={16} className="text-gray-500" />
            <span dir="ltr" style={{ unicodeBidi: "plaintext" }}>{email}</span>
          </a>
        ) : null}

        {/* Time */}
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-gray-500" />
          <span>
            {isRTL ? "توقيت السودان" : "Sudan Time"} : {time}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
