"use client";

import { useEffect, useState } from "react";

/**
 * Tiny client-side hook that returns `true` after the first render — useful for code that
 * only runs in the browser (e.g. accessing `window`, `document`, `localStorage`) and
 * needs to defer until after hydration to avoid SSR mismatches.
 *
 * Provided as a baseline so the `@/hooks` alias (declared in components.json) always resolves
 * to a real directory, and so generated MVPs have a safe, idiomatic example to extend.
 *
 * @example
 *   const mounted = useMounted();
 *   if (!mounted) return null;
 *   return <ClientOnlyChart data={data} />;
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}
