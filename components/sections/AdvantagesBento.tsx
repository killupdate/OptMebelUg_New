"use client";

import React from "react";
import type { Copy } from "@/lib/copy/ru";

type Props = { copy: Copy };


function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-base font-semibold uppercase tracking-[0.12em] text-black/50 dark:text-white/60">
      {children}
    </div>
  );
}

type Advantage = {
  title: string;
  subtitle: string;
  image: string;
  variant: "big-left" | "stack-top" | "stack-bottom" | "bottom-left" | "bottom-right";
  lightText?: boolean;
};

function Tile({ item, index }: { item: Advantage; index: number }) {
  const textClass = item.lightText ? "text-white" : "text-zinc-950 dark:text-white";
  const subClass = item.lightText ? "text-white/80" : "text-black/70 dark:text-white/70";

  const spanClass =
    item.variant === "big-left"
      ? "lg:col-span-7 lg:row-span-2"
      : item.variant === "stack-top"
        ? "lg:col-span-5 lg:row-span-1"
        : item.variant === "stack-bottom"
          ? "lg:col-span-5 lg:row-span-1"
          : item.variant === "bottom-left"
            ? "lg:col-span-6 lg:row-span-1"
            : "lg:col-span-6 lg:row-span-1";

  const delay = (index % 3) + 1; // 1..3 мягкая “лесенка”

  return (
    <article
      className={[
        "ui-card relative overflow-hidden",
        "border border-black/10 dark:border-white/15",
        "bg-white dark:bg-white/5",
        "min-h-[220px] sm:min-h-[240px]",
        spanClass,
      ].join(" ")}
      style={{ borderRadius: "var(--radius-card)" }}
      data-reveal="up"
      data-reveal-delay={String(delay)}
    >
      <div className="absolute inset-0">
        <img src={item.image} alt="" className="h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-black/35 dark:bg-black/45" />
        <div className="absolute inset-0 heroGrain opacity-20" aria-hidden="true" />
      </div>

      <div className="relative z-10 flex h-full flex-col px-6 pb-6 pt-5 sm:px-7 sm:pb-7 sm:pt-6">
        <div className="space-y-2">
          <h3
            className={[
              "subhead font-extrabold tracking-[0.02em] leading-[1.05]",
              textClass,
              "text-2xl sm:text-3xl",
            ].join(" ")}
          >
            {item.title}
          </h3>
          <p className={["text-base leading-[1.35] tracking-[0.02em]", subClass].join(" ")}>
            {item.subtitle}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function AdvantagesBento({ copy }: Props) {
  const items: readonly Advantage[] = copy.advantagesBento.items;


  return (
    <section
      className="mx-auto -mt-2 max-w-6xl px-4 py-2 sm:px-6 sm:py-2"
      data-observe
      data-reveal-mode="items"
    >
      <div className="pl-10" data-reveal="up">
        <Eyebrow>
          {copy.advantagesBento.eyebrowPrefix}{" "}
          <span className="normal-case font-semibold tracking-tight text-[1.3em] text-zinc-950 dark:text-white">
            {copy.brand.name}
          </span>
        </Eyebrow>
      </div>

      <div className="mt-6">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-12 lg:auto-rows-[240px]">
          {items.map((it, idx) => (
            <Tile key={it.title} item={it} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
