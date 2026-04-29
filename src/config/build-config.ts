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
 * App metadata and branding. Prefer `aria-build.config.json` in the repo root
 * (committed by ARIA before deploy). Fallback: `ARIA_BUILD_CONFIG_JSON` for one-off
 * or legacy. Last resort: template defaults.
 */
export function getBuildConfig(): BuildConfig {
  const fromFile = readBuildConfigFile();
  if (fromFile) {
    return fromFile;
  }

  const rawConfig = process.env.ARIA_BUILD_CONFIG_JSON;
  if (rawConfig) {
    try {
      const parsed = JSON.parse(rawConfig) as unknown;
      return buildConfigSchema.parse(parsed);
    } catch {
      return FALLBACK_CONFIG;
    }
  }

  return FALLBACK_CONFIG;
}
