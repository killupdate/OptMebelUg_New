import type { Metadata } from "next";
import Script from "next/script";
import TelegramOrderForm from "./TelegramOrderForm";

export const metadata: Metadata = {
  title: "Заявка | ОПТ МЕБЕЛЬ ЮГ",
  description: "Форма заявки для партнеров ОПТ МЕБЕЛЬ ЮГ",
  robots: {
    index: false,
    follow: false,
  },
};

export default function TelegramOrderPage() {
  return (
    <>
      <Script
        src="https://telegram.org/js/telegram-web-app.js?63"
        strategy="afterInteractive"
      />
      <TelegramOrderForm />
    </>
  );
}
