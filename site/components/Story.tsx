"use client";
import { useStore } from "@/lib/store";
import Reveal from "./Reveal";

export default function Story() {
  const { t } = useStore();
  return (
    <section className="section" id="story">
      <div className="wrap grid gap-12 md:grid-cols-[1fr_1.1fr] md:gap-20 items-start">
        <Reveal>
          <p className="kicker">{t("story_kicker")}</p>
          <blockquote className="story-quote mt-6" style={{ margin: 0 }}>
            {t("story_quote")}
          </blockquote>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="md:pt-24">
            <p className="story-body">{t("story_body")}</p>
            <p className="story-sign mt-6">{t("story_signoff")}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
