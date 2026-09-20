// components/Button.tsx
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost" | "accentOutline" | "soft";
type Size = "sm" | "md";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const base =
  "inline-flex items-center justify-center whitespace-nowrap ui-btn font-semibold transition " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 disabled:opacity-50 disabled:pointer-events-none";

const sizes: Record<Size, string> = {
  // mobile: 44px, md+: 32px
  sm: "h-9 px-4 text-sm md:h-8 md:px-3.5",
  // mobile: 48px, md+: 36px (как было близко к h-9)
  md: "h-12 px-5 text-sm md:h-9 md:px-4",
};


const variants: Record<Variant, string> = {
  primary:
    "bg-[color:var(--primary-bg)] text-[color:var(--primary-fg)] ring-1 ring-white/10 " +
    "hover:bg-[color:var(--accent)] hover:text-white hover:ring-[color:var(--accent)]",

  outline:
    "border border-black/20 bg-transparent text-[color:var(--foreground)] " +
    "dark:border-white/15 dark:bg-white/[0.02] " +
    "hover:bg-[color:var(--accent)] hover:text-white hover:border-[color:var(--accent)]",

  ghost:
    "bg-white/10 text-white ring-1 ring-white/20 backdrop-blur " +
    "hover:bg-white/15 hover:ring-white/30",

  accentOutline:
    "border border-[color:var(--accent)] bg-white/40 text-zinc-950 backdrop-blur-md " +
    "dark:bg-white/[0.02] dark:text-white/85 " +
    "hover:bg-[color:var(--accent)] hover:text-white hover:border-[color:var(--accent)]",

  soft:
    "bg-black/[0.02] text-zinc-950/80 border border-black/20 backdrop-blur-md " +
    "dark:bg-white/[0.01] dark:text-white/85 dark:border-white/18 " +
    "hover:text-[color:var(--accent)] hover:border-[color:var(--accent)] " +
    "hover:bg-black/[0.00] dark:hover:bg-white/[0.03]",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ComponentProps<"button"> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}) {
  return (
    <button className={cx(base, sizes[size], variants[variant], className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  ...props
}: Omit<ComponentProps<"a">, "href"> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  href: string;
}) {
  const isExternal =
    /^https?:\/\//i.test(href) || href.startsWith("tel:") || href.startsWith("mailto:");

  const cls = cx(base, sizes[size], variants[variant], className);

  if (isExternal) {
    return (
      <a href={href} className={cls} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
