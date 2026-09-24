"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import styles from "./TelegramOrderForm.module.css";

type TelegramUser = {
  id?: number;
  first_name?: string;
  last_name?: string;
  username?: string;
};

type TelegramWebApp = {
  initData?: string;
  initDataUnsafe?: {
    user?: TelegramUser;
  };
  ready?: () => void;
  expand?: () => void;
  close?: () => void;
  setHeaderColor?: (color: string) => void;
  setBackgroundColor?: (color: string) => void;
};

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

const clientTypes = [
  "🏪 Мебельный магазин",
  "📦 Оптовик",
  "🛒 Селлер маркетплейса",
  "🏢 Мебельная сеть",
  "🏭 Производитель / СТМ",
  "🤝 Хочу стать дилером / Торговым представителем",
  "Другое",
];

function digitsCount(value: string) {
  return (value.match(/\d/g) ?? []).length;
}

export default function TelegramOrderForm() {
  const [telegramReady, setTelegramReady] = useState(false);
  const [initData, setInitData] = useState("");
  const [telegramUsername, setTelegramUsername] = useState("");

  const [clientType, setClientType] = useState("");
  const [city, setCity] = useState("");
  const [publicPhone, setPublicPhone] = useState("");
  const [email, setEmail] = useState("");
  const [primaryContact, setPrimaryContact] = useState("");
  const [otherTelegram, setOtherTelegram] = useState("");
  const [whatsApp, setWhatsApp] = useState("");
  const [maxAccount, setMaxAccount] = useState("");

  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");
  const [closeCountdown, setCloseCountdown] = useState(5);

  useEffect(() => {
    let attempts = 0;

    const connect = () => {
      const webApp = window.Telegram?.WebApp;
      attempts += 1;

      if (!webApp) {
        if (attempts < 50) {
          window.setTimeout(connect, 100);
        }
        return;
      }

      webApp.ready?.();
      webApp.expand?.();
      webApp.setHeaderColor?.("#0f1115");
      webApp.setBackgroundColor?.("#0f1115");

      const rawInitData = webApp.initData ?? "";
      const username = webApp.initDataUnsafe?.user?.username ?? "";
      const formattedUsername = username ? `@${username}` : "";

      setInitData(rawInitData);
      setTelegramUsername(formattedUsername);
      setPrimaryContact((current) => current || formattedUsername);
      setTelegramReady(Boolean(rawInitData));
    };

    connect();
  }, []);

  const displayTelegram = useMemo(
    () => telegramUsername || "Username в Telegram не указан",
    [telegramUsername],
  );

  useEffect(() => {
    if (status !== "success") {
      return;
    }

    setCloseCountdown(5);

    const intervalId = window.setInterval(() => {
      setCloseCountdown((current) => Math.max(0, current - 1));
    }, 1000);

    const timeoutId = window.setTimeout(() => {
      window.Telegram?.WebApp?.close?.();
    }, 5000);

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(timeoutId);
    };
  }, [status]);

  function closeMiniApp() {
    window.Telegram?.WebApp?.close?.();
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!telegramReady || !initData) {
      setStatus("error");
      setError("Откройте форму из Telegram-бота ОПТ МЕБЕЛЬ ЮГ.");
      return;
    }

    if (!clientType) {
      setStatus("error");
      setError("Выберите тип клиента.");
      return;
    }

    if (city.trim().length < 2) {
      setStatus("error");
      setError("Укажите город.");
      return;
    }

    if (digitsCount(publicPhone) < 7) {
      setStatus("error");
      setError("Укажите публичный рабочий номер для связи.");
      return;
    }

    if (email && !/^\S+@\S+\.\S+$/.test(email.trim())) {
      setStatus("error");
      setError("Проверьте адрес электронной почты.");
      return;
    }

    if (!primaryContact.trim()) {
      setStatus("error");
      setError("Укажите актуальный аккаунт для связи.");
      return;
    }

    setStatus("sending");

    try {
      const response = await fetch("/api/telegram-order", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          initData,
          form: {
            clientType,
            city: city.trim(),
            publicPhone: publicPhone.trim(),
            email: email.trim(),
            primaryContact: primaryContact.trim(),
            otherTelegram: otherTelegram.trim(),
            whatsApp: whatsApp.trim(),
            maxAccount: maxAccount.trim(),
          },
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || payload.ok !== true) {
        throw new Error(payload.error || "Не удалось отправить заявку.");
      }

      setStatus("success");
    } catch (submitError) {
      setStatus("error");
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Не удалось отправить заявку. Попробуйте ещё раз.",
      );
    }
  }

  if (status === "success") {
    return (
      <main className={styles.screen}>
        <section className={styles.successCard}>
          <div className={styles.successIcon}>✓</div>
          <h1>Заявка отправлена</h1>
          <p>
            Менеджер ОПТ МЕБЕЛЬ ЮГ получил ваши контактные данные.
            После закрытия приложения подтверждение будет ждать вас в чате с ботом.
          </p>

          <button
            className={styles.successCloseButton}
            type="button"
            onClick={closeMiniApp}
          >
            <span>Закрыть сейчас</span>
            <span
              className={styles.successCountdown}
              aria-label={`Автоматическое закрытие через ${closeCountdown} секунд`}
            >
              {closeCountdown}
            </span>
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.screen}>
      <section className={styles.shell}>
        <header className={styles.header}>
          <div className={styles.brand}>ОПТ МЕБЕЛЬ ЮГ</div>
          <h1>Оставить заявку</h1>
          <p>
            Заполните контактные данные. Менеджер получит заявку и сможет
            связаться с вами удобным способом.
          </p>
        </header>

        <form className={styles.form} onSubmit={submit}>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>О компании</div>

            <label className={styles.field}>
              <span>Тип клиента *</span>
              <select
                value={clientType}
                onChange={(event) => setClientType(event.target.value)}
                required
              >
                <option value="" disabled>
                  Выберите вариант
                </option>
                {clientTypes.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              <span>Город *</span>
              <input
                value={city}
                onChange={(event) => setCity(event.target.value)}
                placeholder="Краснодар"
                autoComplete="address-level2"
                required
              />
            </label>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionTitle}>Контакты</div>

            <label className={styles.field}>
              <span>Публичный номер для связи *</span>
              <input
                type="tel"
                inputMode="tel"
                value={publicPhone}
                onChange={(event) => setPublicPhone(event.target.value)}
                placeholder="+7 928 000-00-00"
                autoComplete="tel"
                required
              />
              <small>
                Рабочий номер компании, отдела продаж или другой публичный
                номер. Не указывайте личный номер сотрудника, если он не
                предназначен для общения с клиентами и партнёрами.
              </small>
            </label>

            <label className={styles.field}>
              <span>Email</span>
              <input
                type="email"
                inputMode="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="office@company.ru"
                autoComplete="email"
              />
            </label>

            <label className={styles.field}>
              <span>Актуальный аккаунт для связи *</span>
              <input
                value={primaryContact}
                onChange={(event) => setPrimaryContact(event.target.value)}
                placeholder="@username или +7 928 000-00-00"
                required
              />
              <small>
                Можно оставить текущий Telegram или указать другой удобный
                контакт для связи.
              </small>
            </label>

            <div className={styles.telegramHint}>
              <span>Telegram пользователя</span>
              <strong>{displayTelegram}</strong>
            </div>

            <div className={styles.optionalGrid}>
              <input
                aria-label="Другой Telegram"
                value={otherTelegram}
                onChange={(event) => setOtherTelegram(event.target.value)}
                placeholder="Другой Telegram"
              />
              <input
                aria-label="WhatsApp"
                type="tel"
                inputMode="tel"
                value={whatsApp}
                onChange={(event) => setWhatsApp(event.target.value)}
                placeholder="WhatsApp"
              />
              <input
                aria-label="MAX"
                value={maxAccount}
                onChange={(event) => setMaxAccount(event.target.value)}
                placeholder="MAX"
              />
            </div>
          </div>

          {status === "error" && error ? (
            <div className={styles.error} role="alert">
              {error}
            </div>
          ) : null}

          {!telegramReady ? (
            <div className={styles.notice}>
              Для отправки заявки откройте эту форму через Telegram-бота.
            </div>
          ) : null}

          <button
            className={styles.submit}
            type="submit"
            disabled={status === "sending" || !telegramReady}
          >
            {status === "sending" ? "Отправляем…" : "Отправить заявку"}
          </button>

          <p className={styles.footerNote}>
            Telegram ID и исходный Telegram-аккаунт передаются менеджеру
            автоматически вместе с заявкой.
          </p>
        </form>
      </section>
    </main>
  );
}
