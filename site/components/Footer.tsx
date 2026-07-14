"use client";
import { useStore, OWNER_PHONE } from "@/lib/store";
import { Pin, Cash, Clock, Leaf, Phone } from "./icons";

export default function Footer() {
  const { t } = useStore();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="wrap" style={{ paddingBlock: "clamp(3.5rem, 8vh, 6rem)" }}>
        <div className="footer-brand display">
          {t("brand")}
          <br />
          <span className="alt">{t("brandOther")}</span>
        </div>
        <p style={{ color: "var(--ink-dim)", maxWidth: "38ch", marginTop: "1.4rem" }}>{t("foot_tag")}</p>

        <div className="grid gap-12 md:grid-cols-[1.3fr_auto] mt-14 items-end">
          <div>
            <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "1.15rem", marginBottom: "1.1rem" }}>
              {t("foot_details")}
            </h3>
            <ul className="footer-list">
              <li><Pin /> {t("foot_collect")}</li>
              <li><Cash /> {t("foot_pay")}</li>
              <li><Clock /> {t("foot_lead")}</li>
              <li><Leaf /> {t("foot_allergen")}</li>
              <li><Phone /> {t("foot_confirm")}</li>
            </ul>
          </div>
          <div className="flex flex-col gap-2 md:items-end">
            <span className="kicker">{t("foot_call")}</span>
            <a className="footer-phone" href={`tel:${OWNER_PHONE}`}>07404 034660</a>
          </div>
        </div>

        <hr className="stitch" style={{ marginTop: "3.5rem" }} />
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem", paddingTop: "1.2rem", color: "var(--ink-faint)", fontSize: "0.85rem" }}>
          <span>{t("brand")} · Welling</span>
          <span>© {year}</span>
        </div>
      </div>
    </footer>
  );
}
