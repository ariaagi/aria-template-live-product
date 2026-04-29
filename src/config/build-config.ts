import { z } from "zod";
import type { BuildConfig } from "@/types/build-config";

const buildConfigSchema = z.object({
  appName: z.string().min(2),
  appTagline: z.string().min(6),
  ideaId: z.string().min(6),
  monetizationMode: z.enum(["product", "subscription"]),
  pricing: z.object({
    planName: z.string().min(2).optional(),
    amount: z.number().positive(),
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

export function getBuildConfig(): BuildConfig {
  const rawConfig = process.env.ARIA_BUILD_CONFIG_JSON;
  if (!rawConfig) {
    return FALLBACK_CONFIG;
  }

  try {
    const parsed = JSON.parse(rawConfig) as unknown;
    return buildConfigSchema.parse(parsed);
  } catch {
    return FALLBACK_CONFIG;
  }
}
