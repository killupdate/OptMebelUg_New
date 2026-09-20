"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { ButtonLink } from "@/components/Button";
import type { Copy } from "@/lib/copy/ru";

type Props = { copy: Copy };

type NavId = "terms" | "production" | "portfolio" | "contacts";

function IconTelegram(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M10 14l11 -11" />
      <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 .1l-3.5 -7l-7 -3.5a.55 .55 0 0 1 .1 -1z" />
    </svg>
  );
}

function IconInstagram(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 4m0 4a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z" />
      <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
      <path d="M16.5 7.5l0 .01" />
    </svg>
  );
}

function IconMail(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
      <path d="M3 7l9 6l9 -6" />
    </svg>
  );
}

function IconPhone(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" {...props}>
      <path
        d="M8.2 4.6 6.9 3.8c-.7-.4-1.6-.2-2 .5-.7 1.2-1 2.6-.7 4 1 4.4 4.7 8.1 9.1 9.1 1.4.3 2.8 0 4-.7.7-.4.9-1.3.5-2l-.8-1.3c-.4-.6-1.2-.9-1.9-.6l-1.7.7c-.6.2-1.2.1-1.6-.3l-2.9-2.9c-.4-.4-.5-1-.3-1.6l.7-1.7c.3-.7 0-1.5-.6-1.9Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconBurger(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" {...props}>
      <path d="M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 12h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconClose(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" {...props}>
      <path d="M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 6l-12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function MobileMenu({
  copy,
  open,
  onClose,
  items,
  phoneHref,
  phoneLabel,
  social,
}: {
  copy: Copy;
  open: boolean;
  onClose: () => void;
  items: readonly { id: NavId; href: string; label: string }[];
  phoneHref: string;
  phoneLabel: string;
  social: { href: string; label: string; icon: React.ReactNode }[];
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] md:hidden">
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 bg-black/30 dark:bg-black/50"
      />

      <div
        className={[
          "absolute right-3 top-3 w-[min(92vw,360px)] rounded-2xl border p-4 backdrop-blur transition-colors",
          "border-black/10 bg-white/75 text-[color:var(--foreground)] shadow-sm",
          "dark:border-white/15 dark:bg-black/70 dark:text-white dark:shadow-none",
        ].join(" ")}
      >
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть меню"
            className="rounded-md p-2 hover:bg-black/5 dark:hover:bg-white/10"
          >
            <IconClose className="h-7 w-7" />
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {items.map((it) => (
            <a
              key={it.id}
              href={it.href}
              onClick={onClose}
              className="block rounded-xl px-4 py-3 text-lg leading-snug text-center hover:bg-black/5 dark:hover:bg-white/10"
            >
              {it.label}
            </a>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-black/10 p-4 text-center dark:border-white/15">
          <ButtonLink
            href={phoneHref}
            variant="outline"
            size="sm"
            className="h-12 w-full justify-center gap-3 rounded-full px-4 text-base font-medium text-current/90 hover:text-[color:var(--accent)]"
          >
            <IconPhone className="h-5 w-5" />
            <span className="font-medium">{phoneLabel}</span>
          </ButtonLink>

          <div className="mt-3 flex justify-center gap-3">
            {social.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="rounded-xl p-3 text-current/80 hover:bg-black/5 hover:text-[color:var(--accent)] dark:text-white/90 dark:hover:bg-white/10"
              >
                <span className="block h-6 w-6">{s.icon}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-1 gap-3">
            <div className="rounded-xl border border-black/10 p-3 dark:border-white/15">
              <div className="text-sm text-black/60 text-center dark:text-white/70">Тема</div>
              <div className="mt-2 flex justify-center">
            <ThemeToggle copy={copy} ui="mobile" className="w-full justify-between" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Header({ copy }: Props) {
  const items = useMemo(
    () =>
      [
        { id: "terms", href: "#terms", label: copy.nav.terms },
        { id: "production", href: "#production", label: copy.nav.about },
        { id: "portfolio", href: "#portfolio", label: copy.nav.portfolio },
        { id: "contacts", href: "#contacts", label: copy.nav.contacts },
      ] as const,
    []
  );

  const phoneHref = copy.contacts.links.phoneHref;
  const phoneLabel = copy.contacts.values.phone;

  const social = [
    { href: copy.contacts.links.emailHref, label: "Email", icon: <IconMail className="block h-5 w-5" /> },
    {
      href: copy.contacts.social.telegram.href,
      label: copy.contacts.social.telegram.label,
      icon: <IconTelegram className="block h-5 w-5 scale-[0.92]" />,
    },
    {
      href: copy.contacts.social.instagram.href,
      label: copy.contacts.social.instagram.label,
      icon: <IconInstagram className="block h-5 w-5" />,
    },
  ];

  const [active, setActive] = useState<NavId | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const headerRef = useRef<HTMLElement | null>(null);
  const logoRef = useRef<HTMLAnchorElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const phoneDesktopRef = useRef<HTMLAnchorElement | null>(null);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const ids = ["terms", "production", "portfolio", "contacts"] as const;

    const getHeaderH = () => {
      const v = getComputedStyle(document.documentElement).getPropertyValue("--header-h").trim();
      const n = Number.parseFloat(v);
      return Number.isFinite(n) ? n : 0;
    };

    const calcScrolled = () => {
      const hero = document.getElementById("hero");
      if (!hero) return false;
      const headerH = getHeaderH();
      return hero.getBoundingClientRect().bottom <= headerH;
    };

    const pickByLine = (line: number): NavId | null => {
      const hero = document.getElementById("hero");
      if (hero) {
        const heroRect = hero.getBoundingClientRect();
        if (heroRect.bottom > line) return null;
      }

      let current: NavId | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= line) current = id;
      }
      return current;
    };

    let raf = 0;
    let lastY = window.scrollY;

    const recompute = () => {
      raf = 0;
      const headerH = getHeaderH();
      const lineDown = headerH + 8;
      const lineUp = headerH + Math.round(window.innerHeight * 0.5);

      const y = window.scrollY;
      const goingDown = y > lastY;
      lastY = y;

      const nextActive = goingDown ? pickByLine(lineDown) : pickByLine(lineUp);

      setActive(nextActive);
      setScrolled(calcScrolled());
    };

    const requestRecompute = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(recompute);
    };

    recompute();
    window.addEventListener("scroll", requestRecompute, { passive: true });
    window.addEventListener("resize", requestRecompute);

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", requestRecompute);
      window.removeEventListener("resize", requestRecompute);
    };
  }, []);

  useEffect(() => {
    const measure = () => {
      const header = headerRef.current;
      if (!header) return;

      const logo = logoRef.current;
      const nav = navRef.current;
      const phone = phoneDesktopRef.current;

      const headerW = header.clientWidth;

      if (!logo || !nav || !phone) {
        setCompact(false);
        return;
      }

      const NEED_GAPS = 32;
      const BURGER_W = 44;

      const need =
        Math.ceil(logo.getBoundingClientRect().width) +
        Math.ceil(nav.scrollWidth) +
        Math.ceil(phone.getBoundingClientRect().width) +
        BURGER_W +
        NEED_GAPS;

      setCompact(need > headerW);
    };

    measure();

    const ro = new ResizeObserver(() => measure());
    if (headerRef.current) ro.observe(headerRef.current);

    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const linkBase = "rounded-md px-2 py-1 text-xs uppercase tracking-[0.14em] transition-colors";
  const linkInactive =
    "text-current/85 hover:text-current " +
    "group-data-[scrolled=false]:hover:bg-white/12 " +
    "group-data-[scrolled=true]:hover:bg-black/5 " +
    "dark:group-data-[scrolled=false]:hover:bg-white/10 " +
    "dark:group-data-[scrolled=true]:hover:bg-white/25 ";

  const linkActive = "text-[color:var(--accent)]";

  return (
    <>
      <header
        ref={headerRef}
        data-scrolled={scrolled ? "true" : "false"}
        className={[
          "group fixed inset-x-0 top-0 z-50 border-b backdrop-blur transition-colors duration-200",
          "border-zinc-900/15 bg-white/70 text-zinc-950 dark:border-white/15 dark:bg-black/20 dark:text-white",
          "data-[scrolled=true]:border-black/10 data-[scrolled=true]:bg-white/85 data-[scrolled=true]:text-[color:var(--foreground)] data-[scrolled=true]:shadow-sm",
          "dark:data-[scrolled=true]:border-white/15 dark:data-[scrolled=true]:bg-black/35 dark:data-[scrolled=true]:text-white",
        ].join(" ")}
      >
        <div
          className={[
            "mx-auto grid h-14 sm:h-[60px] max-w-5xl items-center px-4 sm:px-6",
            compact
              ? "grid-cols-[minmax(0,1fr)_auto]"
              : "grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[1fr_auto_1fr]",
          ].join(" ")}
        >
          <a
            ref={logoRef}
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("hero")?.scrollIntoView({ behavior: "smooth", block: "start" });
              setMobileOpen(false);
            }}
            className="flex min-w-0 items-center gap-2 sm:gap-3"

          >
            <span className="inline-flex items-center justify-center">
              <img
                src="/images/logo.webp"
                alt={`${copy.brand.name} ${copy.brand.tagline}`}
                className="h-8 w-8 object-cover"
              />
            </span>

            <span className="block min-w-0 truncate text-[15px] font-semibold tracking-tight leading-none sm:text-base">
              {copy.brand.name}
            </span>
          </a>

          <nav
            ref={navRef}
            className={["hidden md:flex justify-self-center gap-2 lg:gap-3 xl:gap-4", compact ? "md:hidden" : ""].join(
              " "
            )}
          >
            {items.map((item) => {
              const isActive = active === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={[linkBase, isActive ? linkActive : linkInactive, isActive ? "hover:bg-transparent" : ""].join(
                    " "
                  )}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          <div className="flex min-w-0 items-center justify-self-end gap-2 overflow-hidden">

            <a
              ref={phoneDesktopRef}
              href={phoneHref}
              className={[
                "hidden lg:inline-flex items-center gap-2 rounded-full px-3 py-1 text-base font-semibold text-current/90 hover:text-[color:var(--accent)]",
                compact ? "lg:inline-flex" : "",
              ].join(" ")}
            >
              <IconPhone className="h-4 w-4" />
              <span className="font-medium">{phoneLabel}</span>
            </a>

            <a
  href={phoneHref}
  className="inline-flex shrink-0 lg:hidden rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/10 hover:text-[color:var(--accent)]"
              aria-label={phoneLabel}
              title={phoneLabel}
            >
              <IconPhone className="h-6 w-6" />
            </a>

            <div className="hidden items-center">
              {social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="inline-flex h-9 w-9 items-center justify-center text-current/85 hover:text-[color:var(--accent)]"
                >
                  <span className="grid h-5 w-5 place-items-center">{s.icon}</span>
                </a>
              ))}
            </div>

<button
  type="button"
  onClick={() => setMobileOpen(true)}
  aria-label="Open menu"
  className={[
    "inline-flex shrink-0 items-center justify-center rounded-full p-2 md:hidden",
    "text-zinc-950 bg-white/80 ring-1 ring-black/10",
    "hover:bg-white hover:text-[color:var(--accent)]",
    "dark:text-white dark:bg-black/30 dark:ring-white/15 dark:hover:bg-black/45",
  ].join(" ")}
>
  <IconBurger className="h-6 w-6" />
</button>


          </div>
        </div>
      </header>

      <MobileMenu
        copy={copy}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        items={items}
        phoneHref={phoneHref}
        phoneLabel={phoneLabel}
        social={social}
      />
    </>
  );
}
