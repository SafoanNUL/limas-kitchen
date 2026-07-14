"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore, type OrderForm } from "@/lib/store";
import { findItem, findBundle, unitPrice, money } from "@/lib/menu";
import { bnNum } from "@/lib/i18n";
import Reveal from "./Reveal";
import { Check } from "./icons";

export function SummaryLines() {
  const { t, lang, cart, setQty, removeLine, displayUnit } = useStore();
  if (!cart.length) {
    return <p style={{ color: "var(--ink-faint)", padding: "1.4rem 0", fontSize: "0.95rem" }}>{t("order_empty")}</p>;
  }
  return (
    <>
      {cart.map((l, i) => {
        const it = findItem(l.key);
        const b = findBundle(l.key);
        const name = b ? (lang === "bn" ? b.name_bn : b.name_en) : it ? (lang === "bn" ? it.name_bn : it.name_en) : l.key;
        const sizeLabel = b
          ? (lang === "bn" ? b.serves_bn : b.serves_en)
          : it?.variants.find((v) => v.size === l.size)?.[lang === "bn" ? "label_bn" : "label_en"] ?? l.size;
        const unit = displayUnit(unitPrice(l.key, l.size) ?? 0);
        return (
          <div className="line-row" key={`${l.key}-${l.size}-${l.spice}`}>
            <div>
              <div className="line-name">{name}</div>
              <div className="line-meta">
                {sizeLabel}
                {l.spice ? ` · ${t(`spice_${l.spice}` as "spice_mild")}` : ""}
              </div>
              <span className="qty">
                <button onClick={() => setQty(i, l.qty - 1)} aria-label="−">−</button>
                <span>{lang === "bn" ? bnNum(l.qty) : l.qty}</span>
                <button onClick={() => setQty(i, l.qty + 1)} aria-label="+">+</button>
              </span>{" "}
              <button className="line-remove" onClick={() => removeLine(i)}>{t("remove")}</button>
            </div>
            <div className="line-price">{money(unit * l.qty)}</div>
          </div>
        );
      })}
    </>
  );
}

export function FriendsBox() {
  const { t, friends, tryCode, clearCode } = useStore();
  const [code, setCode] = useState("");
  const [state, setState] = useState<"idle" | "good" | "bad">("idle");

  const apply = () => {
    if (!code.trim()) return;
    if (tryCode(code)) setState("good");
    else setState("bad");
  };
  const off = () => {
    clearCode();
    setCode("");
    setState("idle");
  };

  return (
    <div className={`friends-box ${friends ? "applied" : ""}`}>
      <p style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--ink-dim)", margin: "0 0 0.5rem" }}>{t("friends_q")}</p>
      <div className="friends-row">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); apply(); } }}
          disabled={friends}
          aria-label={t("friends_q")}
          autoCapitalize="characters"
          autoComplete="off"
        />
        <button className="btn btn-ghost btn-sm" onClick={friends ? off : apply}>
          {friends ? t("friends_off") : t("friends_apply")}
        </button>
      </div>
      {state === "good" && friends && <p className="friends-msg good">✓ {t("friends_applied")}</p>}
      {state === "bad" && !friends && <p className="friends-msg bad">{t("friends_bad")}</p>}
    </div>
  );
}

export function Totals() {
  const { t, friends, totals } = useStore();
  return (
    <>
      <div className="total-row">
        <span style={{ fontWeight: 600 }}>{t("total")}</span>
        <span className="total-amount">
          {friends && totals.list !== totals.pay && <del>{money(totals.list)}</del>}
          {money(totals.pay)}
        </span>
      </div>
      <p className="total-note">{t("total_note")}</p>
    </>
  );
}

export default function OrderSection() {
  const { t, cart, submitOrder, minDateStr, setDrawerOpen } = useStore();
  const [form, setForm] = useState<OrderForm>({
    name: "", phone: "", email: "", date: "", time: "Afternoon", allergies: "", notes: "",
  });
  const [errs, setErrs] = useState<Record<string, boolean>>({});
  const [sending, setSending] = useState(false);
  const [sendErr, setSendErr] = useState(false);
  const [doneRef, setDoneRef] = useState<string | null>(null);

  const set = (k: keyof OrderForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    const next: Record<string, boolean> = {
      name: form.name.trim().length < 2,
      phone: form.phone.replace(/\D/g, "").length < 7,
      date: !form.date || form.date < minDateStr(),
      empty: cart.length === 0,
    };
    setErrs(next);
    setSendErr(false);
    if (Object.values(next).some(Boolean)) return;

    setSending(true);
    const res = await submitOrder(form);
    setSending(false);
    if (res.ok) {
      setDoneRef(res.ref);
      setDrawerOpen(false);
      setForm({ name: "", phone: "", email: "", date: "", time: "Afternoon", allergies: "", notes: "" });
    } else {
      setSendErr(true);
    }
  };

  return (
    <section className="section" id="order">
      <div className="wrap">
        <Reveal>
          <p className="kicker">{t("order_kicker")}</p>
          <h2 className="display section-title">{t("order_title")}</h2>
        </Reveal>

        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 mt-12 items-start">
          <form noValidate onSubmit={(e) => { e.preventDefault(); submit(); }}>
            <div className={`field ${errs.name ? "invalid" : ""}`}>
              <label htmlFor="f-name">{t("f_name")}</label>
              <input id="f-name" autoComplete="name" value={form.name} onChange={set("name")} />
              <p className="field-err">{t("err_name")}</p>
            </div>
            <div className={`field ${errs.phone ? "invalid" : ""}`}>
              <label htmlFor="f-phone">
                {t("f_phone")} <span className="hint">{t("f_phone_hint")}</span>
              </label>
              <input id="f-phone" type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={set("phone")} />
              <p className="field-err">{t("err_phone")}</p>
            </div>
            <div className="field">
              <label htmlFor="f-email">{t("f_email")}</label>
              <input id="f-email" type="email" autoComplete="email" value={form.email} onChange={set("email")} />
            </div>
            <div className="grid sm:grid-cols-2 gap-x-5">
              <div className={`field ${errs.date ? "invalid" : ""}`}>
                <label htmlFor="f-date">
                  {t("f_date")} <span className="hint">{t("f_date_hint")}</span>
                </label>
                <input id="f-date" type="date" min={minDateStr()} value={form.date} onChange={set("date")} />
                <p className="field-err">{t("err_date")}</p>
              </div>
              <div className="field">
                <label htmlFor="f-time">{t("f_time")}</label>
                <select id="f-time" value={form.time} onChange={set("time")}>
                  <option value="Morning">{t("time_morning")}</option>
                  <option value="Afternoon">{t("time_afternoon")}</option>
                  <option value="Evening">{t("time_evening")}</option>
                </select>
              </div>
            </div>
            <div className="field">
              <label htmlFor="f-allergies">
                {t("f_allergies")} <span className="hint">{t("f_allergies_hint")}</span>
              </label>
              <textarea id="f-allergies" placeholder={t("f_allergies_ph")} value={form.allergies} onChange={set("allergies")} />
            </div>
            <div className="field">
              <label htmlFor="f-notes">{t("f_notes")}</label>
              <textarea id="f-notes" placeholder={t("f_notes_ph")} value={form.notes} onChange={set("notes")} />
            </div>
          </form>

          <aside className="summary" aria-live="polite">
            <div className="summary-head">
              <h3>{t("summary")}</h3>
            </div>
            <hr className="stitch" style={{ marginInline: "1.5rem" }} />
            <div className="summary-body">
              <SummaryLines />
            </div>
            <FriendsBox />
            <Totals />
            <div style={{ padding: "1.1rem 1.5rem 1.5rem" }}>
              <button className="btn w-full" disabled={sending} onClick={submit}>
                {sending ? t("submitting") : t("submit")}
              </button>
              {errs.empty && <p className="friends-msg bad" role="alert">{t("err_empty")}</p>}
              {sendErr && <p className="friends-msg bad" role="alert">{t("err_send")}</p>}
            </div>
          </aside>
        </div>
      </div>

      <AnimatePresence>
        {doneRef && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => { if (e.target === e.currentTarget) setDoneRef(null); }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="conf-title"
          >
            <motion.div
              className="modal"
              initial={{ opacity: 0, y: 26, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            >
              <div className="modal-ring"><Check /></div>
              <h3 id="conf-title">{t("conf_title")}</h3>
              <p>{t("conf_body")}</p>
              <div className="modal-ref">
                <span className="label">{t("conf_ref")}</span>
                <span className="code">{doneRef}</span>
              </div>
              <br />
              <button className="btn" onClick={() => setDoneRef(null)}>{t("conf_again")}</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
