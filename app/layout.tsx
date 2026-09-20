// app/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import ThemeProvider from "@/components/ThemeProvider";
import "./globals.css";

import { getRuCopy } from "@/lib/copy";

const gilroyDisplay = localFont({
  variable: "--font-gilroy-display",
  src: [
    { path: "../public/fonts/gilroy-bold.ttf", weight: "700", style: "normal" },
    { path: "../public/fonts/gilroy-extrabold.ttf", weight: "800", style: "normal" },
  ],
  display: "swap",
});

const gilroySubhead = localFont({
  variable: "--font-gilroy-subhead",
  src: [{ path: "../public/fonts/gilroy-regular.ttf", weight: "400", style: "normal" }],
  display: "swap",
});

export const metadata: Metadata = (() => {
  const copy = getRuCopy();
  return {
    title: {
      default: copy.seo.title,
      template: `%s — ${copy.seo.title}`,
    },
    description: copy.seo.description,
  };
})();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const copy = getRuCopy();
  const accent = copy?.theme?.accentColor; 

  // ВАЖНО: если accent undefined — style будет undefined и переменная не переопределится
  const style = accent
    ? ({ ["--accent" as any]: accent } as React.CSSProperties)
    : undefined;

  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        style={style}
        className={`${gilroyDisplay.variable} ${gilroySubhead.variable} antialiased bg-[var(--background)] text-[var(--foreground)]`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
