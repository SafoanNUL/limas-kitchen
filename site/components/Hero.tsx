"use client";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { MENU } from "@/lib/menu";
import { Pin, Cash, Clock } from "./icons";

const line = {
  hidden: { y: "110%" },
  show: (i: number) => ({
    y: 0,
    transition: { delay: 0.12 + i * 0.09, duration: 0.9, ease: [0.19, 1, 0.22, 1] as const },
  }),
};

function MarqueeBand() {
  const { lang } = useStore();
  const names = MENU.map((m) => (lang === "bn" ? m.name_bn : m.name_en));
  const half = (
    <span>
      {names.map((n, i) => (
        <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "2.6rem" }}>
          {n} <span className="dot" aria-hidden>✦</span>
        </span>
      ))}
    </span>
  );
  return (
    <div className="marquee" aria-hidden>
      <div className="marquee-track">{half}{half}</div>
    </div>
  );
}

export default function Hero() {
  const { t, lang } = useStore();
  const lines = [t("hero_l1"), t("hero_l2"), t("hero_l3"), t("hero_l4")];

  return (
    <section className="hero" id="top">
      {/* rising steam */}
      <div className="wisp" style={{ width: 420, height: 420, left: "58%", top: "45%", animationDelay: "0s" }} />
      <div className="wisp" style={{ width: 320, height: 320, left: "74%", top: "55%", animationDelay: "4.5s" }} />
      <div className="wisp" style={{ width: 360, height: 360, left: "8%", top: "60%", animationDelay: "8s" }} />

      <div className="wrap">
        <motion.p
          className="kicker"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
        >
          {t("hero_kicker")}
        </motion.p>

        <h1 className="display hero-title" key={lang}>
          {lines.map((txt, i) => (
            <span key={i} style={{ display: "block", overflow: "hidden", paddingBottom: "0.16em", marginBottom: "-0.16em" }}>
              <motion.span
                style={{ display: "block" }}
                variants={line}
                custom={i}
                initial="hidden"
                animate="show"
                className={i === 1 || i === 3 ? "italic-accent" : undefined}
              >
                {txt}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          className="hero-body"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
        >
          {t("hero_body")}
        </motion.p>

        <motion.div
          className="flex flex-wrap gap-4 mt-9"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
        >
          <a className="btn" href="#menu">{t("hero_cta")}</a>
          <a className="btn btn-ghost" href="#how">{t("hero_cta2")}</a>
        </motion.div>

        <motion.div
          className="hero-badges"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 1 }}
        >
          <span className="hero-badge"><Pin /> {t("badge_collect")}</span>
          <span className="hero-badge"><Cash /> {t("badge_cash")}</span>
          <span className="hero-badge"><Clock /> {t("badge_lead")}</span>
        </motion.div>
      </div>

      <MarqueeBand />
    </section>
  );
}
