"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { SummaryLines, FriendsBox, Totals } from "./OrderSection";
import { X } from "./icons";

export default function CartDrawer() {
  const { t, drawerOpen, setDrawerOpen } = useStore();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setDrawerOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setDrawerOpen]);

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          <motion.div
            className="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDrawerOpen(false)}
          />
          <motion.aside
            className="drawer"
            initial={{ x: "104%" }}
            animate={{ x: 0 }}
            exit={{ x: "104%" }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label={t("yourOrder")}
          >
            <div className="drawer-head">
              <h3>{t("yourOrder")}</h3>
              <button onClick={() => setDrawerOpen(false)} aria-label="Close" style={{ color: "var(--ink-dim)" }}>
                <X />
              </button>
            </div>
            <hr className="stitch" style={{ marginInline: "1.5rem" }} />
            <div className="drawer-body">
              <SummaryLines />
            </div>
            <FriendsBox />
            <Totals />
            <div className="drawer-foot">
              <a className="btn w-full" href="#order" onClick={() => setDrawerOpen(false)}>
                {t("submit")} →
              </a>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
