// lib/cta.ts
export type CtaMode = "tgAccount" | "tgGroup" | "override";

export type CtaRef = {
  mode?: CtaMode;
  override?: string;
};

export function resolveCtaHref(
  copy: any,
  ref?: CtaRef
): string {
  const mode: CtaMode = ref?.mode ?? "tgAccount";
  const ovr = (ref?.override ?? "").trim();

  if (mode === "override") return ovr || "#";

  const account = (copy?.telegram?.account ?? "").trim();
  const group = (copy?.telegram?.group ?? "").trim();

  if (mode === "tgGroup") return group || "#";
  return account || "#";
}
