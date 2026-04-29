import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { z } from "zod";
import type { BuildConfig } from "@/types/build-config";

const ARIA_BUILD_FILE = "aria-build.config.json";

const buildConfigSchema = z.object({
  appName: z.string().min(2),
  appTagline: z.string().min(6),
  ideaId: z.string().min(6),
  monetizationMode: z.enum(["product", "subscription"]),
  pricing: z.object({
    planName: z.string().min(2).optional(),
    amount: z.number().nonnegative(),
    currency: z.string().min(3).max(3).transform((value) => value.toUpperCase()),
    interval: z.enum(["month", "year"]).optional(),
  }),
  integrations: z.array(z.enum(["neon", "stripe", "resend", "notion", "github", "vercel"])),
  branding: z.object({
    primaryColor: z.string().min(4),
    accentColor: z.string().min(4),
    logoUrl: z.string().trim().optional(),
  }),
});

const FALLBACK_CONFIG: BuildConfig = {
  appName: "Template App",
  appTagline: "Centralized baseline ready for idea-specific features.",
  ideaId: "template-idea",
  monetizationMode: "subscription",
  pricing: {
    planName: "Starter",
    amount: 19,
    currency: "USD",
    interval: "month",
  },
  integrations: ["neon", "stripe", "github", "vercel"],
  branding: {
    primaryColor: "#111111",
    accentColor: "#525252",
    logoUrl: "",
  },
};

function readBuildConfigFile(): BuildConfig | null {
  const path = join(process.cwd(), ARIA_BUILD_FILE);
  if (!existsSync(path)) {
    return null;
  }
  try {
    const raw = readFileSync(path, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    const result = buildConfigSchema.safeParse(parsed);
    if (!result.success) {
      console.error(
        "[getBuildConfig] Invalid aria-build.config.json (using fallback):",
        result.error.flatten()
      );
      return null;
    }
    return result.data;
  } catch (e) {
    console.error("[getBuildConfig] Failed to read or parse aria-build.config.json:", e);
    return null;
  }
}

/**
 * App metadata and branding.
 *
 * 1) `ARIA_BUILD_CONFIG_JSON` when set (ARIA MVP sets this on the Vercel project so the app
 *    does not depend on `readFileSync` of `aria-build.config.json` being present in the
 *    serverless trace — a common cause of always seeing fallback "Template App" on Vercel).
 * 2) `aria-build.config.json` in the repo root (local dev and file-based deploys).
 * 3) Template defaults.
 */
export function getBuildConfig(): BuildConfig {
  const rawEnv = process.env.ARIA_BUILD_CONFIG_JSON?.trim();
  if (rawEnv) {
    try {
      const parsed = JSON.parse(rawEnv) as unknown;
      const result = buildConfigSchema.safeParse(parsed);
      if (result.success) {
        return result.data;
      }
      console.error(
        "[getBuildConfig] Invalid ARIA_BUILD_CONFIG_JSON (trying file):",
        result.error.flatten()
      );
    } catch (e) {
      console.error("[getBuildConfig] Failed to parse ARIA_BUILD_CONFIG_JSON:", e);
    }
  }

  const fromFile = readBuildConfigFile();
  if (fromFile) {
    return fromFile;
  }

  return FALLBACK_CONFIG;
}
