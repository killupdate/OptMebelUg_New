"use client";

// import React, { useMemo } from "react";
import HeroUtilityBar from "@/components/HeroUtilityBar";
import { ButtonLink } from "@/components/Button";
import HeroRSlider from "@/components/HeroRSlider";
import type { Copy } from "@/lib/copy/ru";
import { resolveCtaHref } from "@/lib/cta"; // ✅ Импорт функции

type Props = { copy: Copy };

export default function Hero({ copy }: Props) {
  const slides = copy.hero.slides;

  const slideImages = copy.hero.images?.length ? copy.hero.images : ["/images/1.webp"];
  const activeBg = slideImages[0];

  // Мобайл-раскладка заголовка из строк copy
  const title2 = copy.hero.titleLine2?.trim() ?? "";
  const title2Words = title2.split(/\s+/).filter(Boolean);
  const title2a = title2Words.slice(0, 2).join(" "); // напр. "корпусной мебели"
  const title2b = title2Words.slice(2).join(" "); // напр. "под ключ"

  return (
    <section
      data-hero
      data-observe="hero"
      data-inview="false"
      className="relative isolate h-[100svh] overflow-hidden"
    >
      {/* BG */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-center bg-cover transition-opacity duration-700"
          style={{
            backgroundImage: `url(${activeBg})`,
            filter: "blur(28px) saturate(1.15)",
            transform: "scale(1.08)",
            opacity: 0.1,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/35 dark:from-black/45 dark:to-black/55" />
        <div className="absolute inset-0 opacity-[0.10] mix-blend-overlay heroGrain" />
      </div>

      {/* BODY = всё пространство под хедером */}
      <div
        className="relative z-20 h-full"
        style={{
          paddingTop: "var(--header-h)",
        }}
      >
        <div className="w-full h-[calc(100svh-var(--header-h))] px-4 sm:px-6 md:mx-auto md:max-w-5xl">
          <div className="grid h-full grid-cols-1 gap-8 py-12 sm:py-10 lg:grid-cols-2 lg:items-stretch lg:py-8">

            {/* LEFT */}
            <div className="min-h-0 lg:flex lg:items-center">
              {/* На мобиле делаем колонку на всю высоту, чтобы низ (CTA) прижать вниз */}
              <div className="min-h-0 w-full flex h-full flex-col">
                {/* TOP */}
                <div>
                  <h1 className="font-extrabold uppercase text-zinc-950 dark:text-white leading-[0.92] tracking-tight">
                    <span
                      data-reveal
                      data-reveal-delay="1"
                      className="block text-[clamp(34px,9vw,56px)] sm:text-[clamp(28px,3.2vw,56px)]"
                    >
                      {copy.hero.titleLine1}
                    </span>

                    {/* Mobile: превращаем вторую строку в 2 строки */}
                    <span
                      data-reveal
                      data-reveal-delay="2"
                      className="block sm:hidden text-[clamp(34px,9vw,56px)]"
                    >
                      {title2a || title2}
                    </span>
                    {title2b ? (
                      <span
                        data-reveal
                        data-reveal-delay="2"
                        className="block sm:hidden text-[clamp(34px,9vw,56px)]"
                      >
                        {title2b}
                      </span>
                    ) : null}

                    {/* Sm+ оставляем как было: одной строкой */}
                    <span
                      data-reveal
                      data-reveal-delay="2"
                      className="hidden sm:block text-[clamp(28px,3.2vw,56px)]"
                    >
                      {copy.hero.titleLine2}
                    </span>
                  </h1>

                  <p
                    data-reveal
                    data-reveal-delay="2"
                    className="subhead mt-6 text-zinc-950/80 dark:text-white/85 uppercase tracking-[0.04em] text-lg sm:text-xl sm:max-w-[48rem]"
                  >
                    <span className="block">{copy.hero.subtitleLine1}</span>
                    <span className="block">{copy.hero.subtitleLine2}</span>
                  </p>
                </div>

                {/* BOTTOM (прижать вниз) */}
                <div className="mt-auto pt-8 lg:mt-6 lg:pt-2">

                  {/* Кнопки: теперь ОБЕ работают через resolveCtaHref */}
                  <div
                    data-reveal="up"
                    data-reveal-delay="3"
                    className="flex flex-col gap-4 lg:gap-3"
                  >
                    {/* Кнопка 1 */}
                    <ButtonLink
                      href={resolveCtaHref(copy, copy.cta?.heroPrimary)}
                      variant="accentOutline"
                      size="md"
                      className="uppercase tracking-[0.10em] w-full justify-center lg:w-auto lg:self-start"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {copy.hero.ctaPrimary}
                    </ButtonLink>

                    {/* Кнопка 2 (Исправлено) */}
                    {/* <ButtonLink */}
                      {/* href={resolveCtaHref(copy, copy.cta?.heroSecondary)} */}
                      {/* variant="soft" */}
                      {/* size="md" */}
                      {/* className="uppercase tracking-[0.10em] w-full justify-center lg:w-auto lg:self-start" */}
                    {/* > */}
                      {/* {copy.hero.ctaSecondary} */}
                    {/* </ButtonLink> */}
                  </div>

                  <div data-reveal="up" data-reveal-delay="4" className="mt-6 lg:mt-4 flex flex-wrap gap-2">
                    {copy.hero.trust.map((t) => (
                      <span
                        key={t}
                        className="rounded-xl border px-3 py-1 text-[11px] font-normal uppercase tracking-[0.08em] backdrop-blur border-zinc-900/10 bg-white/50 text-zinc-950/55 dark:border-white/10 dark:bg-black/10 dark:text-white/55"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Бар на мобиле скрыт как и было (md:block) */}
                  <div className="relative z-20 mt-8 hidden md:block">
                    <HeroUtilityBar copy={copy} />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <aside className="hidden lg:flex lg:min-h-0 lg:items-stretch">
              <div className="min-h-0 h-full w-full">
                <HeroRSlider
                  slides={slides}
                  images={slideImages}
                  dotsAlign="left"
                  slideMs={8000}
                  fadeMs={900}
                />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
