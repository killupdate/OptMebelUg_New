import "server-only";
import fs from "node:fs";
import path from "node:path";

type AnyRecord = Record<string, any>;

function isPlainObject(v: unknown): v is AnyRecord {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

export function deepMerge<T extends AnyRecord, U extends AnyRecord>(base: T, override: U): T & U {
  const out: AnyRecord = { ...base };
  for (const [k, v] of Object.entries(override)) {
    if (isPlainObject(out[k]) && isPlainObject(v)) out[k] = deepMerge(out[k], v);
    else out[k] = v;
  }
  return out as T & U;
}

export function loadRuOverride(): AnyRecord {
  const file = path.join(process.cwd(), "ru.override.json");
  if (!fs.existsSync(file)) return {};

  try {
    const raw = fs.readFileSync(file, "utf8");
    const parsed = JSON.parse(raw);
    return isPlainObject(parsed) ? parsed : {};
  } catch (e) {
    console.warn(`[override] Failed to read/parse ${file}`, e);
    return {};
  }
}
