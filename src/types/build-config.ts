export type MonetizationMode =
  | "product"
  | "subscription"
  | "has_free_tier"
  | "paid_only";

export type IntegrationProvider =
  | "neon"
  | "stripe"
  | "resend"
  | "notion"
  | "github"
  | "vercel";

export interface PricingConfig {
  planName?: string;
  amount: number;
  currency: string;
  interval?: "month" | "year";
}

export interface BuildPlanConfig {
  tierSlug: string;
  displayName: string;
  amount: number;
  currency: string;
  interval: "month";
  isFree: boolean;
  stripePriceId?: string;
}

export interface BuildConfig {
  appName: string;
  appTagline: string;
  ideaId: string;
  monetizationMode: MonetizationMode;
  supportEmail?: string;
  plans?: BuildPlanConfig[];
  pricing: PricingConfig;
  gating?: Record<string, unknown>;
  integrations: IntegrationProvider[];
  branding: {
    primaryColor: string;
    accentColor: string;
    logoUrl?: string;
  };
}
