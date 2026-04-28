export type MonetizationMode = "product" | "subscription";

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

export interface BuildConfig {
  appName: string;
  appTagline: string;
  ideaId: string;
  monetizationMode: MonetizationMode;
  pricing: PricingConfig;
  integrations: IntegrationProvider[];
  branding: {
    primaryColor: string;
    accentColor: string;
    logoUrl?: string;
  };
}
