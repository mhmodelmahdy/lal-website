"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight, ArrowLeft, Globe, Truck, ShieldCheck,
  Stethoscope, Anchor, Users, Award, TrendingUp
} from "lucide-react";
import { company } from "../../data/company";

function getByPath(obj, path) {
  return path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);
}

export default function HomeClient({ lang, messages }) {
  const isRTL = lang === "ar";
  const arrow = isRTL ? <ArrowLeft size={18} /> : <ArrowRight size={18} />;
  const t = (key) => getByPath(messages, key) ?? key;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  const services = [
    { key: "export", icon: Globe, img: "https://images.unsplash.com/photo-1625246333195-09d9b436446d?q=80&w=1200&auto=format&fit=crop" },
    { key: "import", icon: Stethoscope, img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop" },
    { key: "supplies", icon: Truck, img: "https://images.unsplash.com/photo-1532634922-8fe0b757fb13?q=80&w=1200&auto=format&fit=crop" },
    { key: "thirdparty", icon: ShieldCheck, img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop" }
  ];

  const stats = [
    { num: "200+", label: t("stats.clients"), icon: Users },
    { num: "150+", label: t("stats.projects"), icon: Award },
    { num: "10+", label: t("stats.years"), icon: TrendingUp },
  ];

  return (
    <main className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* ═══════ HERO ═══════ */}
      <section className="relative bg-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className={[
              "absolute -top-28 w-96 h-96 bg-gold/15 rounded-full blur-3xl",
              isRTL ? "-right-24" : "-left-24"
            ].join(" ")}
          />
          <div
            className={[
              "absolute -bottom-40 w-[34rem] h-[34rem] bg-navy/10 rounded-full blur-3xl",
              isRTL ? "-left-24" : "-right-24"
            ].join(" ")}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pt-10 pb-14">
          <div
            className={[
              "flex flex-col lg:items-center gap-10 lg:gap-14",
              isRTL ? "lg:flex-row-reverse" : "lg:flex-row"
            ].join(" ")}
          >
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.75, ease: "easeOut" }}
              className={["flex-1", isRTL ? "text-right" : "text-left"].join(" ")}
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="inline-flex items-center px-4 py-1.5 rounded-full bg-navy/5 text-navy text-sm font-semibold mb-5 border border-navy/15"
              >
                {company.name?.[lang] ?? company.name?.en ?? "Lal Multi Activities Co."}
              </motion.div>

              <h1 className="text-4xl md:text-6xl font-bold text-navy-dark leading-tight">
                {t("hero.title")}
              </h1>

              <p className="mt-5 text-lg md:text-xl text-text-muted leading-relaxed max-w-2xl">
                {t("hero.subtitle")}
              </p>

              <div className={["mt-8 flex flex-wrap gap-4", isRTL ? "justify-end" : "justify-start"].join(" ")}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href={`/${lang}/services`}
                    className="inline-flex items-center gap-2 px-7 py-4 bg-navy hover:bg-navy-dark text-white font-bold rounded-xl transition shadow-lg hover:shadow-navy/20"
                  >
                    {t("hero.cta_primary")} {arrow}
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href={`/${lang}/contact`}
                    className="inline-flex items-center px-7 py-4 bg-white border border-navy/20 text-navy font-bold rounded-xl hover:bg-navy/5 transition"
                  >
                    {t("hero.cta_secondary")}
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.75, ease: "easeOut" }}
              className="flex-1 w-full"
            >
              <div className="relative w-full max-w-xl mx-auto lg:mx-0 aspect-[16/9] rounded-3xl overflow-hidden border border-gray-100 shadow-2xl bg-gradient-to-br from-white to-gray-50">
                <Image
                  src="/logo-wide.png"
                  alt={isRTL ? "صورة تعبر عن الخدمات" : "Services illustration"}
                  fill
                  sizes="(min-width: 1024px) 520px, 100vw"
                  className="object-contain p-10 sm:p-14"
                  priority
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(212,168,67,0.16),transparent_55%),radial-gradient(circle_at_80%_30%,rgba(30,58,95,0.10),transparent_55%)]" />
              </div>
            </motion.div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-120px" }}
            variants={containerVariants}
            className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl"
          >
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label}
                  variants={itemVariants}
                  className="bg-white rounded-2xl p-5 text-center border border-gray-100 shadow-sm"
                >
                  <Icon size={22} className="mx-auto text-gold mb-2" />
                  <p className="text-2xl font-bold text-navy-dark">{s.num}</p>
                  <p className="text-sm text-text-muted">{s.label}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {false && (
      <section className="hidden">
        <div className="absolute inset-0">
          
          <div className={[
            "absolute inset-0",
            isRTL
              ? "bg-gradient-to-l from-navy-dark/95 via-navy/80 to-transparent"
              : "bg-gradient-to-r from-navy-dark/95 via-navy/80 to-transparent"
          ].join(" ")} />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16">
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-block px-4 py-1.5 rounded-full bg-gold/20 text-gold text-sm font-semibold mb-6 border border-gold/30"
            >
              {isRTL ? "شركة لال للأنشطة المتعددة" : "Lal Multi Activities Co."}
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              {t("hero.title")}
            </h1>

            <p className="mt-5 text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl">
              {t("hero.subtitle")}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href={`/${lang}/services`}
                  className="inline-flex items-center gap-2 px-7 py-4 bg-gold hover:bg-gold-dark text-white font-bold rounded-xl transition shadow-lg hover:shadow-gold/30"
                >
                  {t("hero.cta_primary")} {arrow}
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href={`/${lang}/contact`}
                  className="inline-flex items-center px-7 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white font-bold rounded-xl hover:bg-white/20 transition"
                >
                  {t("hero.cta_secondary")}
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="mt-16 grid grid-cols-3 gap-4 max-w-xl"
          >
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.label}
                  variants={itemVariants}
                  className="glass rounded-xl p-4 text-center"
                >
                  <Icon size={22} className="mx-auto text-gold mb-2" />
                  <p className="text-2xl font-bold text-white">{s.num}</p>
                  <p className="text-sm text-gray-300">{s.label}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>


      )}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          >
            <motion.div
              variants={itemVariants}
              className="relative h-[420px] rounded-2xl overflow-hidden shadow-2xl group"
            >
              <Image
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1600&q=80"
                alt="About"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className={[
                "absolute bottom-6 bg-navy text-white p-4 rounded-xl shadow-lg",
                isRTL ? "left-6" : "right-6"
              ].join(" ")}>
                <p className="font-bold text-2xl">+10</p>
                <p className="text-sm text-gray-300">{t("stats.years")}</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="text-gold font-bold tracking-wider uppercase text-sm">
                Lal Multi Activities
              </div>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold text-navy-dark">
                {t("about.title")}
              </h2>
              <p className="mt-5 text-text-muted leading-relaxed text-lg">
                {t("about.description")}
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <motion.div whileHover={{ x: isRTL ? -5 : 5 }} className="flex items-center gap-3">
                  <div className="p-3 bg-navy/10 text-navy rounded-full">
                    <ShieldCheck size={22} />
                  </div>
                  <span className="font-semibold text-gray-800">{t("about.badge1")}</span>
                </motion.div>
                <motion.div whileHover={{ x: isRTL ? -5 : 5 }} className="flex items-center gap-3">
                  <div className="p-3 bg-navy/10 text-navy rounded-full">
                    <Globe size={22} />
                  </div>
                  <span className="font-semibold text-gray-800">{t("about.badge2")}</span>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ SERVICES ═══════ */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-bold text-navy-dark">
              {t("services.title")}
            </h2>
            <div className="mt-4 h-1 w-24 bg-gold mx-auto rounded-full" />
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.key}
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 flex flex-col card-hover"
                >
                  <div className="h-48 relative overflow-hidden">
                    <Image
                      src={s.img}
                      alt={t(`services.${s.key}_title`)}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-navy-dark/40 group-hover:bg-navy-dark/20 transition-colors duration-500" />
                    <div className={[
                      "absolute bottom-4 bg-white/90 p-3 rounded-full text-navy shadow-md group-hover:bg-gold group-hover:text-white transition-colors duration-300",
                      isRTL ? "left-4" : "right-4"
                    ].join(" ")}>
                      <Icon size={28} />
                    </div>
                  </div>

                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-lg font-bold text-navy-dark mb-3 group-hover:text-gold transition-colors">
                      {t(`services.${s.key}_title`)}
                    </h3>
                    <p className="text-text-muted text-sm leading-relaxed mb-4 flex-grow">
                      {t(`services.${s.key}_desc`)}
                    </p>
                    <Link
                      href={`/${lang}/services#${s.key}`}
                      className="text-navy font-semibold text-sm inline-flex items-center gap-2 hover:text-gold hover:gap-3 transition-all mt-auto"
                    >
                      {t("services.read_more")} {arrow}
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ═══════ VISION / MISSION + PORTS ═══════ */}
      <section className="py-20 bg-navy-dark text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-navy-light/15 rounded-full blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 40 : -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.55 }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-bold text-gold">
                {t("vision.title")}
              </h2>
              <div className="space-y-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={[
                    "p-6 glass rounded-xl",
                    isRTL ? "border-r-4 border-gold" : "border-l-4 border-gold"
                  ].join(" ")}
                >
                  <h3 className="text-xl font-bold mb-2 text-gold-light">{t("vision.vision_label")}</h3>
                  <p className="text-gray-200 leading-7">{t("vision.vision_text")}</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={[
                    "p-6 glass rounded-xl",
                    isRTL ? "border-r-4 border-blue-400" : "border-l-4 border-blue-400"
                  ].join(" ")}
                >
                  <h3 className="text-xl font-bold mb-2 text-blue-300">{t("vision.mission_label")}</h3>
                  <p className="text-gray-200 leading-7">{t("vision.mission_text")}</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Ports — using company.ports data */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.55 }}
              className="glass rounded-3xl p-8 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-5">
                <Anchor className="text-gold" size={30} />
                <h3 className="text-2xl font-bold">{t("ports.title")}</h3>
              </div>
              <p className="text-gray-300 mb-6 leading-7">{t("ports.desc")}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {company.ports.map((port) => (
                  <motion.div
                    key={port.en}
                    whileHover={{ x: isRTL ? -6 : 6, backgroundColor: "rgba(255,255,255,0.08)" }}
                    className="flex items-center gap-2 text-sm font-medium text-white/90 border-b border-white/10 pb-3 rounded-lg px-2 py-1 transition-colors"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-gold shrink-0" />
                    {port[lang]}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="py-16 bg-gradient-to-r from-gold-dark via-gold to-gold-light relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M20 20h20v20H20zM0 0h20v20H0z\'/%3E%3C/g%3E%3C/svg%3E')]" />
        <div className="mx-auto max-w-7xl px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              {t("cta.title")}
            </h2>
            <p className="mt-4 text-white/90 text-lg max-w-2xl mx-auto leading-7">
              {t("cta.subtitle")}
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="inline-block">
              <Link
                href={`/${lang}/contact`}
                className="mt-8 inline-flex items-center justify-center px-10 py-4 bg-navy-dark text-white font-bold rounded-full hover:bg-navy transition shadow-xl hover:shadow-2xl"
              >
                {t("cta.button")}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
