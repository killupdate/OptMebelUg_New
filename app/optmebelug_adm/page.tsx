"use client";

import { useMemo, useState } from "react";
import { ru } from "@/lib/copy/ru";

type AnyJson = Record<string, any>;

// --- КОНФИГУРАЦИЯ ---
const CTA_MODES = [
  { value: "tgAccount", label: "TG Аккаунт (Менеджер)" },
  { value: "tgGroup", label: "TG Группа (Каталог)" },
  { value: "override", label: "Своя ссылка / Якорь" },
];

const CTA_REGISTRY = [
  { key: "portfolio", label: "Portfolio: Перейти в Telegram" },
  { key: "stepsManager", label: "Steps: Менеджер" },
  { key: "stepsCatalog", label: "Steps: Каталог" },
  { key: "bottomCalc", label: "Низ: Запросить расчёт" },
  { key: "bottomTerms", label: "Низ: Запросить условия" },
  { key: "contactsManager", label: "Контакты: Telegram иконка" },
];

const SYSTEM_LINKS = [
  { label: "Выбрать из списка...", value: "" },
  { label: "К секции: Контакты (#contacts)", value: "#contacts" },
  { label: "К секции: О нас / Производство (#production)", value: "#production" },
  { label: "К секции: Клиентам / Условия (#terms)", value: "#terms" },
  { label: "К секции: Портфолио (#portfolio)", value: "#portfolio" },
  { label: "К секции: Hero (Наверх) (#hero)", value: "#hero" },
];

function encodeBasic(user: string, pass: string) {
  return "Basic " + btoa(`${user}:${pass}`);
}

function getStr(obj: any, path: string, fallback = ""): string {
  const parts = path.split(".");
  let cur = obj;
  for (const p of parts) {
    if (!cur || typeof cur !== "object") return fallback;
    cur = cur[p];
  }
  return typeof cur === "string" ? cur : fallback;
}

function setStr(obj: AnyJson, path: string, value: string) {
  const parts = path.split(".");
  let cur: any = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const k = parts[i];
    if (!cur[k] || typeof cur[k] !== "object") cur[k] = {};
    cur = cur[k];
  }
  cur[parts[parts.length - 1]] = value;
}

export default function AdminPage() {
  const [user, setUserState] = useState("");
  const [pass, setPassState] = useState("");
  const [overrideJson, setOverrideJson] = useState<AnyJson>({});
  const [loaded, setLoaded] = useState(false);

  // Основные поля
  const [accentColor, setAccentColor] = useState("");
  const [tgAccount, setTgAccount] = useState("");
  const [tgGroup, setTgGroup] = useState("");

  // About Special
  const [aboutMode, setAboutMode] = useState("paused");
  const [aboutMsg, setAboutMsg] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const authHeader = useMemo(() => {
    if (!user || !pass) return "";
    return encodeBasic(user, pass);
  }, [user, pass]);

  function updateJson(path: string, value: string) {
    setOverrideJson((prev) => {
      const next = structuredClone(prev);
      setStr(next, path, value);
      return next;
    });
  }

  // --- Хелпер для рендера блока настройки кнопки ---
  const renderCtaControl = (ctaKey: string, label: string) => {
    // 1. Получаем базу (defaults)
    // @ts-ignore
    const base = ru.cta?.[ctaKey] || { mode: 'tgAccount', override: '' };
    
    // 2. Пути
    const pathMode = `cta.${ctaKey}.mode`;
    const pathOverride = `cta.${ctaKey}.override`;

    // 3. Вычисляем текущие значения
    const valMode = getStr(overrideJson, pathMode, ""); 
    const currentMode = valMode || base.mode;

    const valOverride = getStr(overrideJson, pathOverride, "");
    const hasOverrideKey = (() => {
       try { return overrideJson.cta[ctaKey].hasOwnProperty('override') } catch { return false }
    })();
    const currentOverride = hasOverrideKey ? valOverride : (base.override || "");

    return (
      <div className="bg-black/5 dark:bg-white/5 p-4 rounded-xl mb-3 last:mb-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <span className="font-semibold text-sm">{label}</span>
          
          {/* ✅ SELECT 1: Режим кнопки */}
          <select
            value={currentMode}
            onChange={(e) => updateJson(pathMode, e.target.value)}
            className="h-9 rounded-lg border border-black/10 px-2 text-sm outline-none bg-white/10 text-black dark:bg-white/10 dark:text-white dark:border-white/15"
          >
            {CTA_MODES.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        {currentMode === "override" ? (
          <div className="animate-fadeIn space-y-2">
            <input
              type="text"
              value={currentOverride}
              onChange={(e) => updateJson(pathOverride, e.target.value)}
              className="h-9 w-full rounded-lg border border-black/10 bg-white px-3 text-sm outline-none dark:border-white/15 dark:bg-white/5 font-mono text-blue-600 dark:text-blue-400"
              placeholder="https://... или #anchor"
            />
            {/* ✅ SELECT 2: Быстрый выбор якорей */}
            <div className="flex items-center gap-2">
               <span className="text-xs text-black/40 dark:text-white/40 whitespace-nowrap">Быстрая вставка:</span>
               <select 
                 className="h-7 w-full rounded border border-black/10 px-2 text-xs outline-none bg-white text-black dark:bg-neutral-700 dark:text-white dark:border-white/15"
                 onChange={(e) => {
                   if (e.target.value) updateJson(pathOverride, e.target.value);
                 }}
                 value=""
               >
                 {SYSTEM_LINKS.map((link, i) => (
                   <option key={i} value={link.value}>
                     {link.label}
                   </option>
                  ))}
               </select>
            </div>
          </div>
        ) : (
          <div className="text-xs text-black/50 dark:text-white/50 px-1 flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
            {currentMode === "tgAccount" ? "Аккаунт менеджера" : "Группа/каталог"}
          </div>
        )}
      </div>
    );
  };

  async function load() {
    if (!user || !pass) { setError("Введите логин и пароль."); return; }
    setLoading(true); setError(null); setNotice(null);
    try {
      const res = await fetch("/api/admin/override", { method: "GET", headers: { Authorization: authHeader }, cache: "no-store" });
      if (res.status === 401) { setLoaded(false); setError("Неверный логин/пароль."); return; }
      if (!res.ok) { setLoaded(false); setError(`Ошибка: ${res.status}`); return; }
      
      const data = (await res.json()) as AnyJson;
      setOverrideJson(data);

      setAccentColor(getStr(data, "theme.accentColor", "") || ru.theme.accentColor || "");
      setTgAccount(getStr(data, "telegram.account", "") || ru.telegram?.account || "");
      setTgGroup(getStr(data, "telegram.group", "") || ru.telegram?.group || "");
      
      setAboutMode(getStr(data, "about.ctaPanel.mode", "") || ru.about.ctaPanel.mode || "paused");
      setAboutMsg(getStr(data, "about.ctaPanel.tgMessage", "") || ru.about.ctaPanel.tgMessage || "");
      
      setLoaded(true);
    } catch { setLoaded(false); setError("Ошибка загрузки."); } finally { setLoading(false); }
  }

  async function save() {
    if (!loaded) return;
    setSaving(true); setError(null); setNotice(null);
    
    const next: AnyJson = structuredClone(overrideJson ?? {});
    setStr(next, "theme.accentColor", accentColor.trim());
    setStr(next, "telegram.account", tgAccount.trim());
    setStr(next, "telegram.group", tgGroup.trim());
    setStr(next, "about.ctaPanel.mode", aboutMode);
    setStr(next, "about.ctaPanel.tgMessage", aboutMsg.trim());

    try {
      const res = await fetch("/api/admin/override", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: authHeader },
        body: JSON.stringify(next, null, 2),
      });
      if (!res.ok) { setError("Ошибка сохранения."); return; }
      setOverrideJson(next);
      setNotice("Сохранено. Обновится через 3-5 минут.");
    } catch { setError("Ошибка сети."); } finally { setSaving(false); }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 pb-20">
      <h1 className="text-2xl font-extrabold tracking-tight">Админка</h1>
      <p className="mt-2 text-base text-black/60 dark:text-white/60">URL: <code>/optmebelug_adm</code></p>

      {/* LOGIN */}
      <div className="mt-6 grid gap-4 rounded-2xl border border-black/10 bg-white p-5 dark:border-white/15 dark:bg-white/5">
        <div className="grid gap-2">
           <label className="text-sm font-semibold">Логин</label>
           <input value={user} onChange={(e) => setUserState(e.target.value)} className="h-11 w-full rounded-xl border px-4 dark:border-white/15 dark:bg-white/5" />
        </div>
        <div className="grid gap-2">
           <label className="text-sm font-semibold">Пароль</label>
           <input type="password" value={pass} onChange={(e) => setPassState(e.target.value)} className="h-11 w-full rounded-xl border px-4 dark:border-white/15 dark:bg-white/5" />
        </div>
        <div className="flex gap-3">
           <button onClick={load} className="ui-btn h-11 px-5 rounded-xl bg-[color:var(--accent)] font-semibold" disabled={loading}>{loading ? "..." : "Войти"}</button>
           <button onClick={save} className="ui-btn h-11 px-5 rounded-xl bg-[color:var(--accent)] font-semibold" disabled={saving || !loaded}>{saving ? "..." : "Сохранить"}</button>
        </div>
        {notice && <div className="text-green-600 font-medium">{notice}</div>}
        {error && <div className="text-red-600 font-medium">{error}</div>}
      </div>

      {loaded && (
        <div className="space-y-6 mt-6">
          {/* GENERAL */}
          <div className="grid gap-4 rounded-2xl border border-black/10 bg-white p-5 dark:border-white/15 dark:bg-white/5">
            <div className="text-lg font-bold border-b border-white/10 pb-2 mb-2">Основные</div>
            <div className="grid gap-2">
              <label className="text-sm font-semibold">Акцентный цвет</label>
              <div className="flex gap-3">
                <input value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="h-11 flex-1 rounded-xl border px-4 dark:border-white/15 dark:bg-white/5"/>
                <input type="color" value={accentColor || "#ff4b2b"} onChange={(e) => setAccentColor(e.target.value)} className="h-11 w-14 rounded-xl border p-2 dark:border-white/15 dark:bg-white/5"/>
              </div>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-semibold">TG Аккаунт</label>
              <input value={tgAccount} onChange={(e) => setTgAccount(e.target.value)} className="h-11 w-full rounded-xl border px-4 dark:border-white/15 dark:bg-white/5"/>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-semibold">TG Группа</label>
              <input value={tgGroup} onChange={(e) => setTgGroup(e.target.value)} className="h-11 w-full rounded-xl border px-4 dark:border-white/15 dark:bg-white/5"/>
            </div>
          </div>

          {/* ✅ СЕКЦИЯ: HERO */}
          <div className="grid gap-4 rounded-2xl border-2 border-[color:var(--accent)]/50 bg-white p-5 dark:border-[color:var(--accent)]/50 dark:bg-white/5">
            <div className="text-lg font-bold text-[color:var(--accent)] border-b border-white/10 pb-2 mb-2">
              Секция: Hero (Первый экран)
            </div>
            {renderCtaControl("heroPrimary", "Кнопка 1 (Получить прайс)")}
            {renderCtaControl("heroSecondary", "Кнопка 2 (Запросить условия)")}
          </div>

          {/* ✅ СЕКЦИЯ: ABOUT */}
          <div className="grid gap-4 rounded-2xl border-2 border-[color:var(--accent)]/50 bg-white p-5 dark:border-[color:var(--accent)]/50 dark:bg-white/5">
            <div className="text-lg font-bold text-[color:var(--accent)] border-b border-white/10 pb-2 mb-2">
              Секция: О нас (Экскурсия)
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-semibold">Статус</label>
              {/* ✅ SELECT 3: Статус About */}
              <select 
                value={aboutMode} 
                onChange={(e) => setAboutMode(e.target.value)} 
                className="h-11 w-full rounded-xl border border-black/10 px-4 outline-none bg-white text-black dark:bg-neutral-800 dark:text-white dark:border-white/15"
              >
                <option value="paused">Приостановлено</option>
                <option value="telegram">Активно</option>
              </select>
            </div>
            {aboutMode === "telegram" && (
              <div className="grid gap-2 mt-2">
                 <label className="text-sm font-semibold">Сообщение (Context)</label>
                 <textarea value={aboutMsg} onChange={(e) => setAboutMsg(e.target.value)} className="h-20 w-full rounded-xl border p-4 text-sm dark:border-white/15 dark:bg-white/5 resize-none"/>
              </div>
            )}
            <div className="mt-4 border-t border-white/10 pt-4">
              {renderCtaControl("aboutExcursion", "Настройка ссылки кнопки")}
            </div>
          </div>

          {/* ОСТАЛЬНЫЕ */}
          <div className="grid gap-4 rounded-2xl border border-black/10 bg-white p-5 dark:border-white/15 dark:bg-white/5">
            <div className="text-lg font-bold border-b border-white/10 pb-2 mb-2">Остальные кнопки</div>
            <div className="grid gap-4">
              {CTA_REGISTRY.map((cta) => renderCtaControl(cta.key, cta.label))}
            </div>
          </div>

        </div>
      )}
    </main>
  );
}
