"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Globe,
  Truck,
  ShieldCheck,
  Stethoscope,
  Anchor
} from "lucide-react";

function getByPath(obj, path) {
  return path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);
}

export default function HomeClient({ lang, messages }) {
  const isRTL = lang === "ar";
  const arrow = isRTL ? <ArrowLeft size={18} /> : <ArrowRight size={18} />;

  // safe translator
  const t = (key) => getByPath(messages, key) ?? key;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { y: 16, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.45 } }
  };

  const services = [
    {
      key: "export",
      icon: Globe,
      img: "https://images.unsplash.com/photo-1625246333195-09d9b436446d?q=80&w=1200&auto=format&fit=crop"
    },
    {
      key: "import",
      icon: Stethoscope,
      img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop"
    },
    {
      key: "supplies",
      icon: Truck,
      img: "https://images.unsplash.com/photo-1532634922-8fe0b757fb13?q=80&w=1200&auto=format&fit=crop"
    },
    {
      key: "thirdparty",
      icon: ShieldCheck,
      img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop"
    }
  ];

  const ports = t("ports.list");
  const portsList = Array.isArray(ports) ? ports : [];

  return (
    <main className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* HERO */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1494412651409-ae1e0954332e?auto=format&fit=crop&w=2070&q=80"
            alt="Lal Global Trade"
            fill
            className="object-cover"
            priority
          />
          <div
            className={[
              "absolute inset-0",
              isRTL
                ? "bg-gradient-to-l from-blue-900/90 via-blue-900/70 to-transparent"
                : "bg-gradient-to-r from-blue-900/90 via-blue-900/70 to-transparent"
            ].join(" ")}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16">
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              {t("hero.title")}
            </h1>

            <p className="mt-5 text-lg md:text-xl text-gray-200 leading-relaxed max-w-2xl">
              {t("hero.subtitle")}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href={`/${lang}/services`}
                className="inline-flex items-center gap-2 px-7 py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition shadow-lg hover:shadow-amber-500/30"
              >
                {t("hero.cta_primary")} {arrow}
              </Link>

              <Link
                href={`/${lang}/contact`}
                className="inline-flex items-center px-7 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white font-bold rounded-xl hover:bg-white/20 transition"
              >
                {t("hero.cta_secondary")}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ABOUT SUMMARY */}
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
              className="relative h-[420px] rounded-2xl overflow-hidden shadow-2xl"
            >
              <Image
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1600&q=80"
                alt="About"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />

              <div
                className={[
                  "absolute bottom-6 bg-blue-900 text-white p-4 rounded-xl shadow-lg",
                  isRTL ? "left-6" : "right-6"
                ].join(" ")}
              >
                <p className="font-bold text-2xl">+10</p>
                <p className="text-sm text-gray-300">{t("stats.years")}</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="text-amber-600 font-bold tracking-wider uppercase text-sm">
                Lal Multi Activities
              </div>

              <h2 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
                {t("about.title")}
              </h2>

              <p className="mt-5 text-gray-600 leading-relaxed text-lg">
                {t("about.description")}
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 text-blue-800 rounded-full">
                    <ShieldCheck size={22} />
                  </div>
                  <span className="font-semibold text-gray-800">
                    {t("about.badge1")}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 text-blue-800 rounded-full">
                    <Globe size={22} />
                  </div>
                  <span className="font-semibold text-gray-800">
                    {t("about.badge2")}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-bold text-blue-900">
              {t("services.title")}
            </h2>
            <div className="mt-4 h-1 w-24 bg-amber-500 mx-auto rounded-full" />
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
                  whileHover={{ y: -8 }}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 flex flex-col"
                >
                  <div className="h-48 relative overflow-hidden">
                    <Image
                      src={s.img}
                      alt={t(`services.${s.key}_title`)}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-blue-900/35 group-hover:bg-blue-900/20 transition-colors" />
                    <div
                      className={[
                        "absolute bottom-4 bg-white/90 p-3 rounded-full text-blue-900 shadow-md",
                        isRTL ? "left-4" : "right-4"
                      ].join(" ")}
                    >
                      <Icon size={34} />
                    </div>
                  </div>

                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold text-blue-900 mb-3">
                      {t(`services.${s.key}_title`)}
                    </h3>

                    <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
                      {t(`services.${s.key}_desc`)}
                    </p>

                    <Link
                      href={`/${lang}/services#${s.key}`}
                      className="text-blue-700 font-semibold text-sm inline-flex items-center gap-2 hover:underline mt-auto"
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

      {/* VISION / MISSION + PORTS */}
      <section className="py-20 bg-blue-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 40 : -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.55 }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-bold text-amber-400">
                {t("vision.title")}
              </h2>

              <div className="space-y-4">
                <div
                  className={[
                    "p-6 bg-white/5 rounded-xl backdrop-blur-sm",
                    isRTL ? "border-r-4 border-amber-500" : "border-l-4 border-amber-500"
                  ].join(" ")}
                >
                  <h3 className="text-xl font-bold mb-2">{t("vision.vision_label")}</h3>
                  <p className="text-gray-200 leading-7">{t("vision.vision_text")}</p>
                </div>

                <div
                  className={[
                    "p-6 bg-white/5 rounded-xl backdrop-blur-sm",
                    isRTL ? "border-r-4 border-blue-400" : "border-l-4 border-blue-400"
                  ].join(" ")}
                >
                  <h3 className="text-xl font-bold mb-2">{t("vision.mission_label")}</h3>
                  <p className="text-gray-200 leading-7">{t("vision.mission_text")}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.55 }}
              className="bg-white/10 rounded-3xl p-8 backdrop-blur-md border border-white/10"
            >
              <div className="flex items-center gap-3 mb-5">
                <Anchor className="text-amber-400" size={30} />
                <h3 className="text-2xl font-bold">{t("ports.title")}</h3>
              </div>

              <p className="text-gray-300 mb-6 leading-7">{t("ports.desc")}</p>

              <div className="grid grid-cols-2 gap-4">
                {portsList.map((port) => (
                  <div
                    key={port}
                    className="flex items-center gap-2 text-sm font-medium text-white/90 border-b border-white/10 pb-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    {port}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-amber-500">
        <div className="mx-auto max-w-7xl px-4 text-center">
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

            <Link
              href={`/${lang}/contact`}
              className="mt-8 inline-flex items-center justify-center px-10 py-4 bg-blue-900 text-white font-bold rounded-full hover:bg-blue-800 transition shadow-xl hover:shadow-2xl"
            >
              {t("cta.button")}
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
