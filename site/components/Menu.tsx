"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { MENU, ALLERGEN_NAMES, money, type CategoryKey, type Item } from "@/lib/menu";
import { bnNum } from "@/lib/i18n";
import Reveal from "./Reveal";

const CATS: CategoryKey[] = ["noodles", "biryani", "rice", "curries", "sides", "sweets", "preorder"];
const SPICES = ["mild", "medium", "hot"] as const;

function DishRow({ item }: { item: Item }) {
  const { t, lang, add, displayUnit, friends } = useStore();
  const [size, setSize] = useState(item.variants[0].size);
  const [spice, setSpice] = useState<string | null>(item.spice ? "medium" : null);
  const [flash, setFlash] = useState(false);

  const variant = item.variants.find((v) => v.size === size) ?? item.variants[0];
  const real = variant.price;
  const pub = Math.round(real * 1.2);

  const primary = lang === "bn" ? item.name_bn : item.name_en;
  const secondary = lang === "bn" ? item.name_en : item.name_bn;

  const onAdd = () => {
    add(item.key, size, spice);
    setFlash(true);
    setTimeout(() => setFlash(false), 1300);
  };

  return (
    <div className="dish">
      <div>
        <div className="dish-name">{primary}</div>
        <div className="dish-sub" lang={lang === "bn" ? "en" : "bn"}>{secondary}</div>
        {item.note_en && (
          <div className="dish-note">{lang === "bn" ? item.note_bn : item.note_en}</div>
        )}
        <div className="dish-meta">
          <span className="label">
            {item.allergens.length ? t("contains") : t("no_allergens")}
          </span>
          {item.allergens.map((a) => (
            <span key={a} className="allergen">
              {ALLERGEN_NAMES[a] ? ALLERGEN_NAMES[a][lang] : a}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-end gap-3 max-[680px]:items-start">
        <div className="dish-price">
          {friends && <del>{money(pub * 1)}</del>}
          {money(displayUnit(real))}
        </div>
        <div className="dish-controls" role="group" aria-label={primary}>
          {item.variants.length > 1 &&
            item.variants.map((v) => (
              <button
                key={v.size}
                className="chip chip-sm"
                aria-pressed={size === v.size}
                onClick={() => setSize(v.size)}
              >
                {lang === "bn" ? v.label_bn : v.label_en}
              </button>
            ))}
          {item.variants.length === 1 && (
            <span className="dish-sub">{lang === "bn" ? item.variants[0].label_bn : item.variants[0].label_en}</span>
          )}
        </div>
        {item.spice && (
          <div className="dish-controls" role="group" aria-label={t("cat_curries_sub")}>
            {SPICES.map((s) => (
              <button
                key={s}
                className="chip chip-sm"
                aria-pressed={spice === s}
                onClick={() => setSpice(s)}
              >
                {t(`spice_${s}`)}
              </button>
            ))}
          </div>
        )}
        <button className="btn btn-sm" onClick={onAdd} style={flash ? { filter: "saturate(0.4) brightness(1.1)" } : undefined}>
          {flash ? `${t("added")} ✓` : t("add")}
        </button>
      </div>
    </div>
  );
}

export default function Menu() {
  const { t, lang } = useStore();

  return (
    <section className="section" id="menu" style={{ paddingBottom: "2rem" }}>
      <div className="wrap">
        <Reveal>
          <p className="kicker">{t("menu_kicker")}</p>
          <h2 className="display section-title">{t("menu_title")}</h2>
          <p className="section-note">{t("menu_note")}</p>
        </Reveal>

        <nav className="cat-nav mt-10" aria-label={t("nav_menu")}>
          {CATS.map((c) => (
            <a key={c} href={`#cat-${c}`} className="chip" style={{ textDecoration: "none" }}>
              {t(`cat_${c}`)}
            </a>
          ))}
        </nav>

        {CATS.map((cat, ci) => {
          const items = MENU.filter((m) => m.category === cat);
          if (!items.length) return null;
          const sub = t(`cat_${cat}_sub`);
          const idx = String(ci + 1).padStart(2, "0");
          return (
            <div key={cat} id={`cat-${cat}`}>
              <Reveal>
                <div className="cat-head">
                  <span className="cat-index" aria-hidden>
                    {lang === "bn" ? bnNum(idx) : idx}
                  </span>
                  <h3 className="display cat-name" style={{ margin: 0 }}>{t(`cat_${cat}`)}</h3>
                  {sub && <span className="cat-sub">{sub}</span>}
                </div>
              </Reveal>
              <div>
                {items.map((item) => (
                  <DishRow key={`${item.key}-${lang}`} item={item} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
