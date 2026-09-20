"use client";

import type { SVGProps } from "react";
import { SocialPill } from "@/components/HeroUtilityBar";
import type { Copy } from "@/lib/copy/ru";
import { resolveCtaHref } from "@/lib/cta";

type Props = { copy: Copy };

function IconTelegram(props: SVGProps<SVGSVGElement>) {
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

function FieldLabel({ children }: { children: string }) {
  return (
    <div className="text-sm font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">
      {children}
    </div>
  );
}

export default function Contacts({ copy }: Props) {
  const telegramGroupHref = resolveCtaHref(copy, copy.cta.contactsTelegramGroup);

  return (
    <section
      className="w-full bg-[#ddd6cc]/30 dark:bg-[#2d2f31]/50"
      data-observe
      data-reveal-mode="items"
      id="contacts"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        {/* eyebrow */}
        <div className="pl-10" data-reveal="up">
          <div className="text-sm font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">
            {copy.contacts.eyebrow}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* LEFT */}
          <div
            className="ui-card border border-black/10 bg-white p-6 shadow-sm dark:border-white/15 dark:bg-white/5 dark:shadow-none"
            data-reveal="up"
            data-reveal-delay="1"
          >
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              {copy.contacts.titleLeft}
            </h2>

            <div className="mt-6 space-y-5 text-base">
              <div>
                <FieldLabel>{copy.contacts.fields.phoneLabel}</FieldLabel>
                <a
                  href={copy.contacts.links.phoneHref}
                  className="mt-1 block text-base font-semibold text-black/85 hover:text-[color:var(--accent)] dark:text-white/85"
                >
                  {copy.contacts.values.phone}
                </a>
              </div>

              <div>
                <FieldLabel>{copy.contacts.fields.emailLabel}</FieldLabel>
                <a
                  href={copy.contacts.links.emailHref}
                  className="mt-1 block text-base font-semibold text-black/85 hover:text-[color:var(--accent)] dark:text-white/85"
                >
                  {copy.contacts.values.email}
                </a>
              </div>

              <div>
                <FieldLabel>{copy.contacts.fields.addressLabel}</FieldLabel>
                <div className="mt-1 text-base font-semibold text-black/85 dark:text-white/85">
                  {copy.contacts.values.address}
                </div>
              </div>

              <div>
                <FieldLabel>{copy.contacts.fields.hoursLabel}</FieldLabel>
                <div className="mt-1 text-base font-semibold text-black/85 dark:text-white/85">
                  {copy.contacts.values.hours}
                </div>
              </div>
            </div>

            <div
              className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
              data-reveal
              data-reveal-delay="2"
            >
              <a
                href={telegramGroupHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 w-full items-center justify-center gap-2 ui-btn bg-[color:var(--accent)] px-6 text-base font-semibold text-black transition hover:opacity-95 sm:w-auto sm:justify-start"
              >
                <IconTelegram className="h-4 w-4" />
                {copy.contacts.cta.telegramGroup}
              </a>

              <SocialPill copy={copy} className="shrink-0 self-center sm:self-auto" />
            </div>
          </div>

          {/* RIGHT */}
          <div
            className="ui-card flex flex-col overflow-hidden border border-black/10 bg-white shadow-sm dark:border-white/15 dark:bg-white/5 dark:shadow-none"
            data-reveal="up"
            data-reveal-delay="2"
          >
            <div className="px-6 pb-3 pt-6">
              <h2 className="text-2xl font-extrabold tracking-tight text-zinc-950 dark:text-white sm:text-3xl">
                {copy.contacts.map.title}
              </h2>
            </div>

            <div className="flex-1 px-6 pb-6">
              <div className="ui-card h-full overflow-hidden border border-black/10 dark:border-white/15">
                <iframe
                  title={copy.contacts.map.title}
                  src={copy.contacts.map.src}
                  className="h-full w-full"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}