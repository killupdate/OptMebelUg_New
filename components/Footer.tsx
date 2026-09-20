"use client";

import { useId, useMemo, useState } from "react";
import type { Copy } from "@/lib/copy/ru";

type Props = { copy: Copy };

type DocKind = "privacy" | "personalData";

function getYearReplaced(template: string, year: number) {
  return template.replace("{year}", String(year));
}

function SplashModal(props: {
  open: boolean;
  title: string;
  body: string;
  onClose: () => void;
}) {
  const titleId = useId();
  const bodyId = useId();

  if (!props.open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={bodyId}
      onMouseDown={(e) => {
        // клик по фону закрывает
        if (e.target === e.currentTarget) props.onClose();
      }}
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* panel */}
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl dark:border-white/15 dark:bg-[#111213]">
        <div className="flex items-start justify-between gap-4 border-b border-black/10 px-6 py-4 dark:border-white/10">
          <h3 id={titleId} className="text-lg font-extrabold tracking-tight text-zinc-950 dark:text-white">
            {props.title}
          </h3>

          <button
            type="button"
            onClick={props.onClose}
            className="ui-btn inline-flex h-9 items-center justify-center rounded-xl border border-black/10 bg-black/5 px-3 text-sm font-semibold text-black/80 hover:bg-black/10 dark:border-white/15 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
            aria-label="Закрыть"
          >
            Закрыть
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
          <div
            id={bodyId}
            className="whitespace-pre-wrap text-base leading-relaxed text-black/70 dark:text-white/70"
          >
            {props.body}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Footer({ copy }: Props) {
  const year = new Date().getFullYear();
  const copyright = useMemo(
    () => getYearReplaced(copy.footer.copyright, year),
    [copy.footer.copyright, year]
  );

  const [openKind, setOpenKind] = useState<DocKind | null>(null);

  const docs = copy.footer.docs;

  const modalTitle =
    openKind === "privacy"
      ? docs.privacy.title
      : openKind === "personalData"
        ? docs.personalData.title
        : "";

  const modalBody =
    openKind === "privacy"
      ? docs.privacy.body
      : openKind === "personalData"
        ? docs.personalData.body
        : "";

  return (
    <>
      <footer className="w-full border-t border-black/10 bg-[#ddd6cc]/60 py-10 sm:py-7 lg:py-6 dark:border-white/15 dark:bg-[#2d2f31]/90">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 text-center sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:text-left">
          <div className="text-base tracking-[0.02em] text-black/70 dark:text-white/70">
            {copyright}
          </div>

          <div className="flex flex-wrap justify-center gap-5 text-base sm:justify-end sm:gap-6">
           {/* <a
              href={copy.footer.links.privacy.href}
              onClick={(e) => {
                e.preventDefault();
                setOpenKind("privacy");
              }}
              className="text-black/70 hover:text-[color:var(--accent)] dark:text-white/70"
            >
              {copy.footer.links.privacy.label}
            </a>

            <a
              href={copy.footer.links.personalData.href}
              onClick={(e) => {
                e.preventDefault();
                setOpenKind("personalData");
              }}
              className="text-black/70 hover:text-[color:var(--accent)] dark:text-white/70"
            >
              {copy.footer.links.personalData.label}
            </a>*/}
          </div>
        </div>
      </footer>

      <SplashModal
        open={openKind !== null}
        title={modalTitle}
        body={modalBody}
        onClose={() => setOpenKind(null)}
      />
    </>
  );
}
