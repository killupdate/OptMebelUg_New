"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { A11y } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper/types";

import type { Copy } from "@/lib/copy/ru";
import { resolveCtaHref } from "@/lib/cta";

import "swiper/css";

type Props = { copy: Copy };

function Eyebrow({ children }: { children: string }) {
  return (
    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">
      {children}
    </div>
  );
}

function ArrowIcon({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
      {dir === "left" ? (
        <path
          d="M14.5 5.5 8 12l6.5 6.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M9.5 5.5 16 12l-6.5 6.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

type Slide = {
  src: string;
  alt: string;
  title: string;
  text: string;
};

type Category = {
  title: string;
  hint: string;
  prefix: string;
  // Вариант B: можно явно задать items в copy/override
  items?: Slide[];
};

type PortfolioModel = {
  eyebrow: string;
  title: string;
  categories: Category[];
  // старое поле, оставляем для fallback текстов
  slides: Slide[];
  cta: { title: string; button: string };
  images: {
    basePath: string;
    defaultExt: string;
    // Вариант B: ext по каждому слоту prefix-01..06
    extBySlot?: Record<string, Record<string, string>>;
    // Вариант B: дефолтное кол-во файлов по шаблону prefix-01..N.ext
    defaultCount?: number;
  };
};

function TrendCarousel({
  title,
  hint,
  slides,
  index,
}: {
  title: string;
  hint: string;
  slides: Slide[];
  index: number;
}) {
  const swiperRef = useRef<SwiperType | null>(null);

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const syncNavState = (s: SwiperType) => {
    setCanPrev(!s.isBeginning);
    setCanNext(!s.isEnd);
  };

  const delay = String((index % 3) + 1); // 1..3 волна

  return (
    <section data-reveal="up" data-reveal-delay={delay}>
      <div className="lg:pl-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
          <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-zinc-950 dark:text-white">
            {title}
          </h3>

          <div className="text-base leading-relaxed text-black/70 dark:text-white/70">{hint}</div>
        </div>
      </div>

      <div className="relative mt-5 overflow-visible">
        <div className="swiper-clip">
          <Swiper
            modules={[A11y]}
            onSwiper={(s) => {
              swiperRef.current = s;
              syncNavState(s);
            }}
            onSlideChange={syncNavState}
            onResize={syncNavState}
            slidesPerView={1}
            spaceBetween={14}
            watchOverflow
            grabCursor
            touchStartPreventDefault={false}
            centeredSlides={false}
            autoHeight={false}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 16 },
              1024: { slidesPerView: 3, spaceBetween: 20 },
            }}
          >
            {slides.map((s, idx) => (
              <SwiperSlide key={`${s.src}-${idx}`} className="flex !h-auto">
                <article
                  className={[
                    "flex w-full flex-col overflow-hidden",
                    "ui-card border border-black/10 bg-white shadow-sm",
                    "dark:border-white/15 dark:bg-white/5 dark:shadow-none",
                  ].join(" ")}
                  style={{ borderRadius: "var(--radius-card)" }}
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={s.src}
                      alt={s.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <div className="truncate text-base font-semibold tracking-tight text-zinc-950 dark:text-white">
                      {s.title}
                    </div>

                    <div
                      className="mt-1 text-base leading-relaxed text-black/70 dark:text-white/70"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        height: "3em",
                      }}
                    >
                      {s.text}
                    </div>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* MOBILE arrows UNDER carousel */}
        <div className="mt-4 flex items-center justify-center gap-3 sm:hidden">
          <button
            type="button"
            aria-label="Предыдущий слайд"
            onClick={() => swiperRef.current?.slidePrev()}
            disabled={!canPrev}
            className={[
              "grid h-11 w-11 place-items-center rounded-full",
              "border border-black/10 bg-white/85 text-black/70 shadow-sm backdrop-blur",
              "hover:bg-white hover:text-black/90",
              "disabled:pointer-events-none disabled:opacity-25",
              "dark:border-white/15 dark:bg-black/25 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white",
            ].join(" ")}
          >
            <ArrowIcon dir="left" />
          </button>

          <button
            type="button"
            aria-label="Следующий слайд"
            onClick={() => swiperRef.current?.slideNext()}
            disabled={!canNext}
            className={[
              "grid h-11 w-11 place-items-center rounded-full",
              "border border-black/10 bg-white/85 text-black/70 shadow-sm backdrop-blur",
              "hover:bg-white hover:text-black/90",
              "disabled:pointer-events-none disabled:opacity-25",
              "dark:border-white/15 dark:bg-black/25 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white",
            ].join(" ")}
          >
            <ArrowIcon dir="right" />
          </button>
        </div>

        {/* TABLET + DESKTOP arrows OUTSIDE carousel */}
        <div className="pointer-events-none hidden sm:block">
          <button
            type="button"
            aria-label="Предыдущий слайд"
            onClick={() => swiperRef.current?.slidePrev()}
            disabled={!canPrev}
            className={[
              "pointer-events-auto",
              "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[110%]",
              "z-10 grid h-11 w-11 place-items-center rounded-full",
              "border border-black/10 bg-white/80 text-black/70 shadow-sm backdrop-blur",
              "hover:bg-white hover:text-black/90",
              "disabled:pointer-events-none disabled:opacity-25",
              "dark:border-white/15 dark:bg-black/25 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white",
            ].join(" ")}
          >
            <ArrowIcon dir="left" />
          </button>

          <button
            type="button"
            aria-label="Следующий слайд"
            onClick={() => swiperRef.current?.slideNext()}
            disabled={!canNext}
            className={[
              "pointer-events-auto",
              "absolute right-0 top-1/2 -translate-y-1/2 translate-x-[110%]",
              "z-10 grid h-11 w-11 place-items-center rounded-full",
              "border border-black/10 bg-white/80 text-black/70 shadow-sm backdrop-blur",
              "hover:bg-white hover:text-black/90",
              "disabled:pointer-events-none disabled:opacity-25",
              "dark:border-white/15 dark:bg-black/25 dark:text-white/80 dark:hover:bg-white/10 dark:hover:text-white",
            ].join(" ")}
          >
            <ArrowIcon dir="right" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default function Portfolio({ copy }: Props) {
  const pf = copy.portfolio as unknown as PortfolioModel;

  // берём до 6 "текстовых шаблонов" из старого массива slides
  const textSlides = useMemo(() => pf.slides?.slice(0, 6) ?? [], [pf.slides]);

  const sliders = useMemo(() => {
    const { basePath, defaultExt, extBySlot, defaultCount } = pf.images ?? {
      basePath: "/images/portfolio",
      defaultExt: "webp",
    };

    const fallbackCount = defaultCount ?? 6;

    return (pf.categories ?? []).map((c) => {
      // 1) если items явно задан — используем его (вариант B)
      if (Array.isArray(c.items) && c.items.length > 0) {
        return {
          title: c.title,
          hint: c.hint,
          slides: c.items,
        };
      }

      // 2) иначе — fallback: prefix-01..06 и тексты по кругу из textSlides
      const slides: Slide[] = Array.from({ length: fallbackCount }, (_, i) => {
        const n = String(i + 1).padStart(2, "0"); // "01".."06"
        const ext = extBySlot?.[c.prefix]?.[n] ?? defaultExt;

        const t = textSlides[i % Math.max(1, textSlides.length)] ?? {
          src: "",
          alt: "",
          title: "",
          text: "",
        };

        return {
          ...t,
          src: `${basePath}/${c.prefix}-${n}.${ext}`,
          alt: `${c.title} — пример ${i + 1}`,
        };
      });

      return { title: c.title, hint: c.hint, slides };
    });
  }, [pf.categories, pf.images, textSlides]);

  return (
    <section
      id="portfolio"
      className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20"
      data-observe
      data-reveal-mode="items"
    >
      <div data-reveal="up">
        <Eyebrow>{pf.eyebrow}</Eyebrow>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{pf.title}</h2>
      </div>

      <div className="mt-8 space-y-10 sm:space-y-12 lg:space-y-14">
        {sliders.map((s, i) => (
          <TrendCarousel key={s.title} title={s.title} hint={s.hint} slides={s.slides} index={i} />
        ))}
      </div>

      <div
        className="mt-14 ui-card border border-black/10 bg-[#ddd6cc]/30 p-6 shadow-none dark:border-white/15 dark:bg-[#2d2f31]/50 dark:shadow-none sm:p-8"
        style={{ borderRadius: "var(--radius-card)" }}
        data-reveal="up"
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xl sm:text-2xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
            {pf.cta.title}
          </div>

          <a
            href={resolveCtaHref(copy, copy.cta.portfolio)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 w-full items-center justify-center ui-btn bg-[color:var(--accent)] px-6 text-base font-semibold text-black transition hover:opacity-95 sm:w-auto"
          >
            {pf.cta.button}
          </a>
        </div>
      </div>
    </section>
  );
}
