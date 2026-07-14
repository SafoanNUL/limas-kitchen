"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { BUNDLES, ALLERGEN_NAMES, money } from "@/lib/menu";
import Reveal from "./Reveal";

export default function Bundles() {
  const { t, lang, add, displayUnit, friends } = useStore();
  const [flashKey, setFlashKey] = useState<string | null>(null);

  return (
    <section className="section" id="bundles">
      <div className="wrap">
        <Reveal>
          <p className="kicker">{t("bundles_kicker")}</p>
          <h2 className="display section-title">{t("bundles_title")}</h2>
          <p className="section-note">{t("bundles_note")}</p>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-3 mt-12">
          {BUNDLES.map((b, i) => {
            const pub = Math.round(b.price * 1.2);
            return (
              <Reveal key={b.key} delay={i * 0.1}>
                <article className="bundle h-full">
                  <span className="bundle-serves">{lang === "bn" ? b.serves_bn : b.serves_en}</span>
                  <h3 className="bundle-name" style={{ margin: "0.9rem 0 0" }}>
                    {lang === "bn" ? b.name_bn : b.name_en}
                  </h3>
                  <div className="bundle-sub" lang={lang === "bn" ? "en" : "bn"}>
                    {lang === "bn" ? b.name_en : b.name_bn}
                  </div>
                  <div className="bundle-inc-label">{t("includes")}</div>
                  <p className="bundle-inc" style={{ margin: "0.3rem 0 0" }}>
                    {lang === "bn" ? b.contents_bn : b.contents_en}
                  </p>
                  <div className="dish-meta">
                    {b.allergens.map((a) => (
                      <span key={a} className="allergen">
                        {ALLERGEN_NAMES[a] ? ALLERGEN_NAMES[a][lang] : a}
                      </span>
                    ))}
                  </div>
                  <div className="bundle-foot">
                    <span className="bundle-price">
                      {friends && <del>{money(pub)}</del>}
                      {money(displayUnit(b.price))}
                    </span>
                    <button
                      className="btn btn-sm"
                      onClick={() => {
                        add(b.key, "bundle", null);
                        setFlashKey(b.key);
                        setTimeout(() => setFlashKey(null), 1300);
                      }}
                    >
                      {flashKey === b.key ? `${t("added")} ✓` : t("add")}
                    </button>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
