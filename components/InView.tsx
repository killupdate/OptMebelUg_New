"use client";

import { useEffect } from "react";

type Props = {
  selector?: string;
  rootMargin?: string;
  threshold?: number | number[];
};

export default function InView({
  selector = "[data-observe]",
  rootMargin = "0px 0px -20% 0px",
  threshold = 0.15,
}: Props) {
  useEffect(() => {
    const scopes = Array.from(document.querySelectorAll<HTMLElement>(selector));
    if (!scopes.length) return;

    // 1) Возвращаем поведение как было: ready/inview на контейнерах
    scopes.forEach((n) => (n.dataset.ready = "false"));

    const raf = requestAnimationFrame(() => {
      scopes.forEach((n) => (n.dataset.ready = "true"));
    });

    const ioScopes = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const el = e.target as HTMLElement;
          el.dataset.inview = e.isIntersecting ? "true" : "false";
        }
      },
      { root: null, rootMargin, threshold }
    );

    scopes.forEach((n) => ioScopes.observe(n));

    // 2) Новое: наблюдаем каждый [data-reveal] внутри этих контейнеров
    const revealTargets = scopes.flatMap((scope) =>
      Array.from(scope.querySelectorAll<HTMLElement>("[data-reveal]"))
    );

    const ioReveal = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const el = e.target as HTMLElement;
          el.dataset.inview = e.isIntersecting ? "true" : "false";
        }
      },
      { root: null, rootMargin, threshold }
    );

    revealTargets.forEach((el) => ioReveal.observe(el));

    return () => {
      cancelAnimationFrame(raf);
      ioScopes.disconnect();
      ioReveal.disconnect();
    };
  }, [selector, rootMargin, threshold]);

  return null;
}
