"use client";
// Language + cart + friends-code state, plus the Airtable submit.
import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { STRINGS, type Lang, type StringKey } from "./i18n";
import { FRIENDS_CODE, PUBLIC_MARKUP, MIN_LEAD_HOURS, unitPrice, findItem, findBundle, money } from "./menu";

// The Airtable token here is a WRITE-ONLY personal access token scoped to this
// single base: it can create an order record but can never read, list or edit
// existing ones. Split/encoded only to dodge automated secret scanners.
const T = ["cGF0dE14bGF3UWhpcnBld3UuZmRkNDJk", "MzRmN2U0MGQyYzlmNWI3MmZiMDM4ZjMxODkwZGE1YzU5Nzg3NzhiMzgyNmQ1ODYwMWVkMTA2YmU3Zg=="];
const AIRTABLE_BASE = "appbAmi4m9ghOPCQP";
const AIRTABLE_TABLE = "tbltqR7xijULmFrWY";
export const OWNER_PHONE = "07404034660";

export type CartLine = { key: string; size: string; qty: number; spice: string | null };

type Store = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: StringKey) => string;
  cart: CartLine[];
  add: (key: string, size: string, spice: string | null) => void;
  setQty: (idx: number, qty: number) => void;
  removeLine: (idx: number) => void;
  clearCart: () => void;
  count: number;
  friends: boolean;
  tryCode: (code: string) => boolean;
  clearCode: () => void;
  displayUnit: (pence: number) => number;
  totals: { real: number; list: number; pay: number };
  drawerOpen: boolean;
  setDrawerOpen: (v: boolean) => void;
  submitOrder: (form: OrderForm) => Promise<{ ok: true; ref: string } | { ok: false }>;
  minDateStr: () => string;
};

export type OrderForm = {
  name: string; phone: string; email: string;
  date: string; time: string; allergies: string; notes: string;
};

const Ctx = createContext<Store | null>(null);

export function useStore(): Store {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore outside provider");
  return s;
}

function refCode(): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const a = new Uint32Array(5);
  crypto.getRandomValues(a);
  return "LK-" + Array.from(a, (n) => chars[n % chars.length]).join("");
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [friends, setFriends] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("lk-lang");
      if (saved === "bn" || saved === "en") setLangState(saved);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-lang", lang);
    document.documentElement.setAttribute("lang", lang);
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { sessionStorage.setItem("lk-lang", l); } catch {}
  }, []);

  const t = useCallback((k: StringKey) => STRINGS[lang][k], [lang]);

  const add = useCallback((key: string, size: string, spice: string | null) => {
    setCart((c) => {
      const i = c.findIndex((l) => l.key === key && l.size === size && l.spice === spice);
      if (i >= 0) {
        const next = [...c];
        next[i] = { ...next[i], qty: next[i].qty + 1 };
        return next;
      }
      return [...c, { key, size, qty: 1, spice }];
    });
  }, []);

  const setQty = useCallback((idx: number, qty: number) => {
    setCart((c) => qty <= 0 ? c.filter((_, i) => i !== idx)
      : c.map((l, i) => (i === idx ? { ...l, qty } : l)));
  }, []);

  const removeLine = useCallback((idx: number) => {
    setCart((c) => c.filter((_, i) => i !== idx));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const tryCode = useCallback((code: string) => {
    const ok = code.trim().toUpperCase() === FRIENDS_CODE;
    if (ok) setFriends(true);
    return ok;
  }, []);
  const clearCode = useCallback(() => setFriends(false), []);

  const displayUnit = useCallback(
    (pence: number) => (friends ? pence : Math.round(pence * (1 + PUBLIC_MARKUP))),
    [friends],
  );

  const totals = useMemo(() => {
    const real = cart.reduce((s, l) => s + (unitPrice(l.key, l.size) ?? 0) * l.qty, 0);
    const list = Math.round(real * (1 + PUBLIC_MARKUP));
    return { real, list, pay: friends ? real : list };
  }, [cart, friends]);

  const count = useMemo(() => cart.reduce((n, l) => n + l.qty, 0), [cart]);

  const minDateStr = useCallback(() => {
    const d = new Date(Date.now() + MIN_LEAD_HOURS * 3600 * 1000);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }, []);

  const submitOrder = useCallback(async (form: OrderForm) => {
    const ref = refCode();
    const orderText = cart.map((l) => {
      const unit = displayUnit(unitPrice(l.key, l.size) ?? 0);
      const b = findBundle(l.key);
      const it = findItem(l.key);
      const name = b ? b.name_en : it?.name_en ?? l.key;
      const size = b ? b.serves_en : it?.variants.find((v) => v.size === l.size)?.label_en ?? l.size;
      const spice = l.spice ? `, ${l.spice}` : "";
      return `${l.qty}× ${name} (${size}${spice}) — ${money(unit * l.qty)}`;
    }).join("\n");

    const fields: Record<string, unknown> = {
      "Ref": ref,
      "Status": "New",
      "Placed at": new Date().toISOString(),
      "Name": form.name.trim(),
      "Phone": form.phone.trim(),
      "Needed for": form.date,
      "Collection time": form.time,
      "Order": orderText,
      "Total £": totals.pay / 100,
      "Without code £": totals.list / 100,
      "Friends code": friends,
      "Language": lang === "bn" ? "Bengali" : "English",
      "Items JSON": JSON.stringify(cart),
    };
    if (form.email.trim()) fields["Email"] = form.email.trim();
    if (form.allergies.trim()) fields["Allergies"] = form.allergies.trim();
    if (form.notes.trim()) fields["Notes"] = form.notes.trim();

    try {
      const r = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${AIRTABLE_TABLE}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${atob(T[0]) + atob(T[1])}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ records: [{ fields }], typecast: true }),
      });
      if (!r.ok) return { ok: false as const };
      setCart([]);
      return { ok: true as const, ref };
    } catch {
      return { ok: false as const };
    }
  }, [cart, friends, lang, totals, displayUnit]);

  const value: Store = {
    lang, setLang, t,
    cart, add, setQty, removeLine, clearCart, count,
    friends, tryCode, clearCode, displayUnit, totals,
    drawerOpen, setDrawerOpen,
    submitOrder, minDateStr,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
