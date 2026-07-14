"use client";
import { useStore } from "@/lib/store";
import { bnNum } from "@/lib/i18n";
import Reveal from "./Reveal";

export default function How() {
  const { t, lang } = useStore();
  const steps = [
    { title: t("how_1t"), body: t("how_1b") },
    { title: t("how_2t"), body: t("how_2b") },
    { title: t("how_3t"), body: t("how_3b") },
    { title: t("how_4t"), body: t("how_4b") },
  ];
  return (
    <section className="section" id="how">
      <div className="wrap">
        <Reveal>
          <p className="kicker">{t("how_kicker")}</p>
          <h2 className="display section-title">{t("how_title")}</h2>
        </Reveal>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 mt-12">
          {steps.map((s, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="how-step">
                <div className="how-num" aria-hidden>
                  {lang === "bn" ? bnNum(i + 1) : String(i + 1).padStart(2, "0")}
                </div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
