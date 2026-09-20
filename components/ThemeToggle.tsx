"use client";

type Props = {
  copy: any;
};
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type Mode = "system" | "light" | "dark";

function Icon({ mode }: { mode: Mode }) {
  const common = "h-3.5 w-3.5 text-current";
  const strokeProps = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (mode === "light") {
    return (
      <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
        <circle cx="12" cy="12" r="4" {...strokeProps} />
        <path d="M12 2v2" {...strokeProps} />
        <path d="M12 20v2" {...strokeProps} />
        <path d="M2 12h2" {...strokeProps} />
        <path d="M20 12h2" {...strokeProps} />
        <path d="M4.9 4.9 6.3 6.3" {...strokeProps} />
        <path d="M17.7 17.7 19.1 19.1" {...strokeProps} />
        <path d="M4.9 19.1 6.3 17.7" {...strokeProps} />
        <path d="M17.7 6.3 19.1 4.9" {...strokeProps} />
      </svg>
    );
  }

  if (mode === "dark") {
    return (
      <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
        <path
          d="M21 14.5A7.5 7.5 0 0 1 9.5 3.5 6.5 6.5 0 1 0 21 14.5Z"
          {...strokeProps}
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
      <rect x="7" y="3" width="10" height="16" rx="2" {...strokeProps} />
      <path d="M9 21h6" {...strokeProps} />
    </svg>
  );
}

export default function ThemeToggle({
  className = "",
  ui = "desktop",
  copy,
}: {
  className?: string;
  ui?: "desktop" | "mobile";
  copy: any;
}) {

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const mode = (theme ?? "system") as Mode;

  const groupDesktop =
    "border-zinc-900/15 bg-white/60 text-zinc-950 dark:border-white/15 dark:bg-white/5 dark:text-white";

  const groupMobile = "border-black/10 bg-black/5 dark:border-white/15 dark:bg-white/10";

  const group =
    "inline-flex items-center rounded-full border p-[3px] backdrop-blur transition-colors " +
    (ui === "mobile" ? groupMobile : groupDesktop) +
    " " +
    className;

  const base =
    "inline-flex h-8 w-8 items-center justify-center rounded-full border border-transparent " +
    "appearance-none no-underline select-none outline-none transition-colors";

  // active
  const activeDesktop = "bg-white/10 border-white/20 shadow-sm text-[color:var(--accent)]";
  const activeMobile =
    "shadow-sm text-[color:var(--accent)] bg-black/10 border-black/10 dark:bg-white/10 dark:border-white/20";

  // inactive
  const inactiveDesktop =
    "text-zinc-950/70 hover:text-zinc-950 hover:bg-black/5 dark:text-white/75 dark:hover:text-white dark:hover:bg-white/10";

  const inactiveMobile =
    "text-black/70 hover:text-black hover:bg-black/10 dark:text-white/75 dark:hover:text-white dark:hover:bg-white/10";

  const active = ui === "mobile" ? activeMobile : activeDesktop;
  const inactive = ui === "mobile" ? inactiveMobile : inactiveDesktop;

  const btnClass = (value: Mode) => `${base} ${mode === value ? active : inactive}`;

  const labelFor = (value: Mode) =>
    value === "system" ? copy.theme.system : value === "light" ? copy.theme.light : copy.theme.dark;

  return (
    <div role="radiogroup" aria-label={copy.theme.label} className={group}>
      {(["system", "light", "dark"] as const).map((value) => (
<button
  key={value}
  type="button"
  role="radio"
  aria-checked={mode === value ? "true" : "false"}
  aria-label={labelFor(value)}
  onClick={() => setTheme(value)}
  className={btnClass(value)}
  title={labelFor(value)}
>

          <Icon mode={value} />
          <span className="sr-only">{labelFor(value)}</span>
        </button>
      ))}
    </div>
  );
}
