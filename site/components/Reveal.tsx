"use client";
// Scroll-into-view reveal wrapper (whileInView keeps it framer-native).
import { motion } from "framer-motion";
import type { ReactNode } from "react";

export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay, duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
    >
      {children}
    </motion.div>
  );
}
