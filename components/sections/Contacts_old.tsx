"use client";

import { useState } from "react";
import { SocialPill } from "@/components/HeroUtilityBar";
import type { Copy } from "@/lib/copy/ru";
import { resolveCtaHref } from "@/lib/cta";

type Props = { copy: Copy };

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

function FieldLabel({ children }: { children: string }) {
  return (
    <div className="text-sm font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">
      {children}
    </div>
  );
}

type LeadValues = {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
};

function buildLeadText(values: LeadValues) {
  const clean = (v?: string) => (v ?? "").trim();

  const name = clean(values.name);
  const phone = clean(values.phone);
  const email = clean(values.email);
  const message = clean(values.message);

  const lines = [
    "Здравствуйте!",
    "",
    "Хочу запросить условия/расчёт.",
    "",
    "Контакты для связи:",
    `— Имя: ${name || "—"}`,
    `— Телефон: ${phone || "—"}`,
    `— Email: ${email || "—"}`,
    "",
    "Сообщение / запрос:",
    message || "—",
    "",
    "Чек-лист для расчёта (если актуально):",
    "1) Вы (ЮЛ/ИП) + город:",
    "2) Канал (маркетплейсы/опт/магазин/студия):",
    "3) Что нужно произвести (позиции):",
    "4) Объём/партия:",
    "5) Есть ли ТЗ/чертежи/ссылка на аналог:",
    "6) Требования к упаковке/маркировке (если есть):",
    "7) Точка отгрузки (ТК/склад/фулфилмент):",
    "8) Сроки:",
  ];

  return lines.join("\n");
}

function buildMailtoHref(baseMailto: string, subject: string, bodyText: string) {
  return `${baseMailto}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
}

export default function Contacts({ copy }: Props) {
  const [sent, setSent] = useState(false);
  const [lastLead, setLastLead] = useState<LeadValues | null>(null);

  // CTA для кнопки "Наша группа в Telegram"
  const telegramGroupHref = resolveCtaHref(copy, copy.cta.contactsTelegramGroup);

  // Режим сабмита формы: "email" | "telegram"
  const submitMode = copy.contacts.form.submitMode ?? "email";

  const mailtoBase = copy.contacts.links.emailHref; // mailto:...
  const tgManagerHref = resolveCtaHref(copy, copy.cta.contactsManager); // tgAccount/override
  const subject = copy.contacts.form.mailSubject ?? "Запрос условий / расчёта — ОптМебельЮг";

  const lastBodyText = lastLead ? buildLeadText(lastLead) : "";
  const openMailHref = buildMailtoHref(
    mailtoBase,
    subject,
    lastBodyText || buildLeadText({})
  );

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);
    const lead: LeadValues = {
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      message: String(fd.get("message") ?? ""),
    };

    setLastLead(lead);

    const bodyText = buildLeadText(lead);

    if (submitMode === "telegram") {
      // Открываем чат менеджера в Telegram с предзаполненным текстом.
      // Важно: предзаполнение гарантированно работает для https://t.me/username?text=...
      // Invite-ссылки вида https://t.me/+... часто не поддерживают ?text=.
      try {
        const url = new URL(tgManagerHref);
        url.searchParams.set("text", bodyText);
        window.open(url.toString(), "_blank", "noopener,noreferrer");
      } catch {
        // fallback: просто откроем то, что есть (даже если это "#")
        window.open(tgManagerHref, "_blank", "noopener,noreferrer");
      }
    } else {
      // Email: открываем почтовый клиент
      const mailto = buildMailtoHref(mailtoBase, subject, bodyText);
      window.open(mailto, "_self"); // _self обычно корректнее для mailto
    }

    setSent(true);
  };

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

        <div className="space-y-6">
          {/* FORM block */}
          <div className="p-6 sm:p-8" data-reveal="up">
            <h3 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              {copy.contacts.titleRight}
            </h3>

            <form onSubmit={onSubmit} className="mt-9">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch">
                {/* LEFT: fields */}
                <div className="grid grid-cols-1 gap-4" data-reveal data-reveal-delay="1">
                  <label className="space-y-2">
                    <div className="px-4 text-sm font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">
                      Обращение <span className="text-[color:var(--accent)]">*</span>
                    </div>
                    <input
                      name="name"
                      required
                      placeholder={copy.contacts.form.namePlaceholder}
                      aria-label={copy.contacts.form.name}
                      className="h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-base outline-none focus:border-[color:var(--accent)] dark:border-white/15 dark:bg-white/5"
                    />
                  </label>

                  <label className="space-y-2">
                    <div className="px-4 text-sm font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">
                      Телефон <span className="text-[color:var(--accent)]">*</span>
                    </div>
                    <input
                      name="phone"
                      required
                      placeholder={copy.contacts.form.phonePlaceholder}
                      aria-label={copy.contacts.form.phone}
                      className="h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-base outline-none focus:border-[color:var(--accent)] dark:border-white/15 dark:bg-white/5"
                    />
                  </label>

                  <label className="space-y-2">
                    <div className="px-4 text-sm font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">
                      Email{" "}
                      <span className="font-normal normal-case tracking-normal">(необязательно)</span>
                    </div>
                    <input
                      name="email"
                      placeholder={copy.contacts.form.emailPlaceholder}
                      aria-label={copy.contacts.form.email}
                      className="h-11 w-full rounded-xl border border-black/10 bg-white px-4 text-base outline-none focus:border-[color:var(--accent)] dark:border-white/15 dark:bg-white/5"
                    />
                  </label>
                </div>

                {/* RIGHT: message */}
                <div className="h-full min-h-0" data-reveal data-reveal-delay="2">
                  <div className="flex h-full min-h-0 flex-col gap-2">
                    <div className="px-4 text-sm font-semibold uppercase tracking-[0.16em] text-black/50 dark:text-white/60">
                      Сообщение{" "}
                      <span className="font-normal normal-case tracking-normal">(необязательно)</span>
                    </div>

                    <textarea
                      name="message"
                      placeholder={copy.contacts.form.messagePlaceholder}
                      aria-label={copy.contacts.form.message}
                      className={[
                        "w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-base outline-none",
                        "focus:border-[color:var(--accent)] dark:border-white/15 dark:bg-white/5",
                        "resize-none overflow-y-auto",
                        "h-[220px] lg:flex-1 lg:min-h-0 lg:h-auto",
                      ].join(" ")}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 h-px w-full bg-black/10 dark:bg-white/10" />

              <div
                className="mt-6 flex flex-col gap-3 px-4 sm:flex-row sm:items-start sm:gap-6"
                data-reveal
                data-reveal-delay="2"
              >
                <button
                  type="submit"
                  className="inline-flex h-11 w-full items-center justify-center ui-btn bg-[color:var(--accent)] px-10 text-base font-semibold text-black transition hover:opacity-95 sm:w-auto"
                >
                  {copy.contacts.form.submit}
                </button>

                <div className="text-sm leading-relaxed text-black/60 dark:text-white/60 sm:max-w-[400px]">
                  {copy.contacts.form.consent}
                </div>
              </div>

              {sent ? (
                <div
                  className="mt-4 text-base text-black/60 dark:text-white/70"
                  data-reveal
                  data-reveal-delay="3"
                >
                  Сообщение можно отправить в Telegram или на Email. Для расчёта укажите позиции,
                  партию, точку отгрузки и сроки.{" "}
                  <a
                    href={openMailHref}
                    className="font-semibold text-black/80 underline underline-offset-4 hover:text-[color:var(--accent)] dark:text-white/80"
                  >
                    Открыть письмо
                  </a>
                  .
                </div>
              ) : null}
            </form>
          </div>

          {/* CONTACTS + MAP */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
                  onClick={() => setSent(true)}
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

          {/* если захочешь отдельный блок "Email" — mailto уже готов */}
        </div>
      </div>
    </section>
  );
}
