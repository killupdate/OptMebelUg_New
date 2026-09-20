import "server-only";

import { ru as ruBase } from "./ru";
import { deepMerge, loadRuOverride } from "@/lib/override";

export function getRuCopy() {
  const override = loadRuOverride();
  return deepMerge(ruBase as any, override as any);
}
