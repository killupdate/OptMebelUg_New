"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import HeroRSlider from "@/components/HeroRSlider";
import type { Copy } from "@/lib/copy/ru";
import { resolveCtaHref } from "@/lib/cta";


type Props = { copy: Copy };


function Eyebrow({ children }: { children: string }) {
  return (
    <div className="text-sm font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">
      {children}
    </div>
  );
}

function IconChevronDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" {...props}>
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function About({ copy }: Props) {
  const faqItems = copy.faq.items;
  const aboutImages = copy.about.images;
  const [excNoticeOpen, setExcNoticeOpen] = useState(false);
  useEffect(() => {
  if (!excNoticeOpen) return;
  const t = window.setTimeout(() => setExcNoticeOpen(false), 10_000);
  return () => window.clearTimeout(t);
}, [excNoticeOpen]);

 const baseExcHref = resolveCtaHref(copy, copy.cta?.aboutExcursion);
  const msg = (copy.about.ctaPanel.tgMessage ?? "").trim();

  // Telegram prefill работает нормально только для https://t.me/USERNAME (не для https://t.me/+invite)
  const excursionHref =
    msg && /^https:\/\/t\.me\/(?!\+)/.test(baseExcHref)
      ? `${baseExcHref}?text=${encodeURIComponent(msg)}`
      : baseExcHref;


  const [open, setOpen] = useState(false);

  const innerRef = useRef<HTMLDivElement | null>(null);
  const [maxH, setMaxH] = useState<number>(0);

  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;

    const measure = () => setMaxH(Math.ceil(el.scrollHeight));

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);

    return () => ro.disconnect();
  }, [faqItems.length]);

  const aboutSliderViewport =
    "overflow-hidden rounded-[var(--radius-card)] h-[32vh] min-h-[260px] max-h-[420px] sm:h-[34vh] sm:min-h-[280px] sm:max-h-[460px] lg:h-[44vh] lg:min-h-[380px] lg:max-h-[580px] xl:h-[60vh] xl:h-[66vh] xl:min-h-[360px] xl:max-h-[720px]";

  return (
    <section
      className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20"
      data-observe
      data-reveal-mode="items"
    >
      {/* header */}
      <div className="pl-10" data-reveal="up">
        <h2 className="subhead font-extrabold uppercase tracking-[0.09em] leading-snug text-zinc-950 dark:text-white text-2xl sm:text-3xl">
          {copy.about.eyebrow}
        </h2>
      </div>

      <div className="mt-8">
        {/* MOBILE */}
        <div className="grid grid-cols-1 gap-6 lg:hidden">
          <div data-reveal="up">
            <HeroRSlider
              slides={copy.hero.slides}
              images={aboutImages}
              dots="bottom"
              className="w-full"
              viewportClassName={aboutSliderViewport}
            />
          </div>

          <div
            className="py-4 space-y-4 text-base tracking-[0.02em] text-black/70 dark:text-white/70"
            data-reveal="up"
          >
            {copy.about.top.paragraphs.map((p, i) => (
              <p key={`m-top-p-${i}`}>{p}</p>
            ))}

            <ul className="list-disc pl-5 space-y-2">
              {copy.about.top.listAfterTraderHeader.map((it, i) => (
                <li key={`m-top-li-${i}`}>{it}</li>
              ))}
            </ul>

            {copy.about.top.tailParagraphs.map((p, i) => (
              <p key={`m-top-tail-${i}`}>{p}</p>
            ))}

            <div className="text-center pt-2">
              <div className="inline-flex flex-col items-center gap-2">
                <Eyebrow>{copy.about.bottom.kicker}</Eyebrow>
                <div className="text-base tracking-[0.02em] text-black/70 dark:text-white/70">
                  {copy.about.bottom.lead}
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-2">
              {copy.about.bottom.columns.map((col, i) => (
                <div key={`m-col-${i}`} className="space-y-3">
                  <div className="pl-5 font-semibold text-zinc-950 dark:text-white">{col.title}</div>
                  <ul className="list-disc pl-5 space-y-2">
                    {col.items.map((it, j) => (
                      <li key={`m-col-${i}-li-${j}`}>{it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <p>
              <span className="font-semibold text-[color:var(--accent)]/80">
                {copy.about.closingAccent}
              </span>
            </p>
          </div>
        </div>

        {/* DESKTOP */}
        <div className="hidden lg:block">
          <div className="space-y-10">
            {/* TOP ROW */}
            <div className="grid grid-cols-2 gap-12 items-start">
              <div data-reveal="up">
                <HeroRSlider
                  slides={copy.hero.slides}
                  images={aboutImages}
                  dotsAlign="right"
                  className="w-full"
                  viewportClassName={aboutSliderViewport}
                />
              </div>

              <div
                className="py-2 space-y-4 text-base tracking-[0.02em] text-black/70 dark:text-white/70"
                data-reveal="up"
              >
                {copy.about.top.paragraphs.slice(0, 2).map((p, i) => (
                  <p key={`d-top-p-${i}`}>{p}</p>
                ))}
              </div>
            </div>

            {/* FULL WIDTH */}
            <div
              className="ui-card border border-black/10 bg-white/60 p-6 text-base tracking-[0.02em] text-black/70 shadow-sm dark:border-white/15 dark:bg-white/[0.03] dark:text-white/70 dark:shadow-none lg:px-10"
              data-reveal="up"
            >
              <h3 className="text-lg font-semibold leading-snug text-zinc-950 dark:text-white">
                {copy.about.top.paragraphs[2]}
              </h3>

              <p className="mt-4 font-medium text-zinc-950/90 dark:text-white/90">
                {copy.about.top.paragraphs[3]}
              </p>

              <ul className="mt-4 list-disc pl-5 space-y-2">
                {copy.about.top.listAfterTraderHeader.map((it, i) => (
                  <li key={`d-moved-li-${i}`}>{it}</li>
                ))}
              </ul>

              {copy.about.top.tailParagraphs[0] ? (
                <p className="mt-4">{copy.about.top.tailParagraphs[0]}</p>
              ) : null}

              <p className="mt-4">
                <span className="font-semibold text-[color:var(--accent)]/80">
                  {copy.about.closingAccent}
                </span>
              </p>
            </div>

            {/* BOTTOM */}
            <div
              className="py-4 space-y-6 text-base tracking-[0.02em] text-black/70 dark:text-white/70 lg:px-10"
              data-reveal="up"
            >
              <div className="text-center">
                <div className="inline-flex flex-col items-center gap-2">
                  <Eyebrow>{copy.about.bottom.kicker}</Eyebrow>
                  <div className="text-base tracking-[0.02em] text-black/70 dark:text-white/70">
                    {copy.about.bottom.lead}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 md:gap-8">
                {copy.about.bottom.columns.map((col, idx) => (
                  <div
                    key={`d-col-${idx}`}
                    className={[
                      "space-y-3",
                      "md:px-6",
                      idx === 0 ? "md:pl-0" : "",
                      idx === 2 ? "md:pr-0" : "",
                      idx > 0 ? "md:border-l md:border-black/10 md:dark:border-white/15" : "",
                    ].join(" ")}
                  >
                    <div className="pl-5 font-semibold text-zinc-950 dark:text-white">{col.title}</div>
                    <ul className="list-disc pl-5 space-y-2">
{col.items.map((it: string, j: number) => (
  <li key={`d-col-${idx}-li-${j}`}>{it}</li>
))}

                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA PANEL */}
<div
  className="mt-10 ui-card rounded-[var(--radius-card)] border border-black/10 bg-[#ddd6cc]/30 p-6 text-sm text-black/70 dark:border-white/15 dark:bg-[#2d2f31]/50 dark:text-white/70 sm:p-8"
  data-reveal="up"
>

        <div className="text-lg sm:text-xl font-semibold tracking-[0.02em] leading-snug text-zinc-950 dark:text-white whitespace-pre-line">
          {copy.about.ctaPanel.text}
        </div>

<div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-start sm:gap-4">
  {copy.about.ctaPanel.mode === "telegram" ? (
    <a
      href={excursionHref}
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-11 items-center justify-center ui-btn bg-[color:var(--accent)] px-6 text-sm font-semibold text-black transition hover:opacity-95"
    >
      {copy.about.ctaPanel.button}
    </a>
  ) : (
    <button
      type="button"
      onClick={() => setExcNoticeOpen((v) => !v)}
      className="inline-flex h-11 items-center justify-center ui-btn bg-[color:var(--accent)] px-6 text-sm font-semibold text-black transition hover:opacity-95"
    >
      {copy.about.ctaPanel.button}
    </button>
  )}

  {/* DESKTOP: notice справа */}
  {copy.about.ctaPanel.mode === "paused" && excNoticeOpen ? (
    <div className="hidden sm:block text-sm text-black/70 dark:text-white/70">
      {copy.about.ctaPanel.pausedNotice}
    </div>
  ) : null}
</div>

{/* MOBILE: notice под кнопкой */}
{copy.about.ctaPanel.mode === "paused" && excNoticeOpen ? (
  <div className="mt-3 sm:hidden text-sm text-black/70 dark:text-white/70">
    {copy.about.ctaPanel.pausedNotice}
  </div>
) : null}
</div>


      {/* FAQ toggle row */}
      <div className="mt-6" data-reveal="up">
        <div className="flex items-center gap-3 text-base font-semibold tracking-[0.04em] text-[color:var(--accent)]/80">
          <span className="whitespace-nowrap">{copy.about.faqToggle.label}</span>

          <span
            aria-hidden="true"
            className="min-w-0 flex-1 opacity-70 dark:opacity-60 h-px bg-[repeating-linear-gradient(to_right,currentColor_0_4px,transparent_6px_12px)]"
            // style={{
            //   height: 1,
            //   backgroundImage:
            //     "repeating-linear-gradient(to right, currentColor 0 4px, transparent 6px 12px)",
            // }}
          />

          <button
            type="button"
            aria-expanded={open}
            aria-label={copy.about.faqToggle.aria}
            onClick={() => setOpen((v) => !v)}
            className={[
              "group inline-flex h-9 w-9 items-center justify-center rounded-full border transition",
              "border-[color:var(--accent)]/70 text-[color:var(--accent)]",
              "bg-transparent hover:bg-[color:var(--accent)] hover:border-[color:var(--accent)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]/40",
            ].join(" ")}
          >
            <IconChevronDown
              className={[
                "h-5 w-5 transition-transform duration-300 text-current group-hover:text-white",
                open ? "rotate-180" : "rotate-0",
              ].join(" ")}
            />
          </button>
        </div>
      </div>

      {/* FAQ content (анимируется как блок, когда он реально появляется) */}
      <div data-reveal="up">
<div className="overflow-hidden transition-[max-height,opacity] duration-500 ease-out aboutCollapse"
  data-open={open ? "true" : "false"}
  style={{ ["--about-max-h" as any]: `${maxH}px` }}
>

          <div ref={innerRef} className="pt-4">
            <div className="ui-card border border-[color:var(--accent)]/30 bg-[#ddd6cc]/10 p-5 text-base text-black/70 tracking-[0.04em] dark:bg-[#2d2f31]/20 dark:text-white/70">
<ul className="space-y-4">
  {faqItems.map((it: { q: string; a: string }, i: number) => (
    <li key={`${it.q}-${i}`} className="space-y-1">
      <div className="font-semibold text-zinc-950 dark:text-white">{it.q}</div>
      <div className="leading-relaxed">{it.a}</div>
    </li>
  ))}
</ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
