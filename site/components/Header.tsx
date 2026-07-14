"use client";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { Bag } from "./icons";

export default function Header() {
  const { t, lang, setLang, count, setDrawerOpen } = useStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 10);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className={`header ${scrolled ? "scrolled" : ""}`}>
      <div className="wrap header-inner">
        <a href="#top" className="mr-auto flex flex-col leading-tight no-underline" aria-label={t("brand")}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", fontWeight: 520 }}>
            {t("brand")}
          </span>
          <span className="hidden sm:block" style={{ fontSize: "0.74rem", color: "var(--ink-faint)", letterSpacing: "0.02em" }}>
            {t("brandOther")}
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-7" aria-label="Sections">
          <a className="nav-link" href="#story">{t("nav_story")}</a>
          <a className="nav-link" href="#menu">{t("nav_menu")}</a>
          <a className="nav-link" href="#bundles">{t("nav_bundles")}</a>
          <a className="nav-link" href="#how">{t("nav_how")}</a>
        </nav>

        <div className="lang-switch" role="group" aria-label="Language / ভাষা">
          <button aria-pressed={lang === "en"} onClick={() => setLang("en")}>EN</button>
          <button aria-pressed={lang === "bn"} onClick={() => setLang("bn")} lang="bn">বাং</button>
        </div>

        <button className="cart-pill" onClick={() => setDrawerOpen(true)} aria-label={`${t("yourOrder")} (${count})`}>
          <Bag />
          <span className="hidden sm:inline">{t("nav_order")}</span>
          <span className="cart-count">{count}</span>
        </button>
      </div>
    </header>
  );
}
