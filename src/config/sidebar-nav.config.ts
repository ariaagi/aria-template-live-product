/**
 * Extension point: extra sidebar navigation items.
 *
 * Generated MVPs SHOULD write their primary section nav items here (e.g. "Workouts",
 * "Tournaments", "Recipes"). The template's `AppShell` merges them between the built-in
 * "Home" and "Billing" entries so the user-facing IA always reads:
 *
 *   Home → [your sections...] → Billing → Settings
 *
 * Conventions:
 *   - `href` MUST start with `/` and match an actual route in `src/app/(app)/`.
 *   - `iconName` is one of the supported lucide-react icons (see ICON_MAP in app-shell.tsx).
 *     Omit to use the default folder icon.
 *   - 0–6 items recommended. The template's responsive nav is tuned for that range.
 *
 * To extend the sidebar, replace the array below with your items. Do NOT modify
 * `src/components/app/app-shell.tsx` — the merge logic is the stable contract.
 *
 * Example:
 *   export const extraSidebarNavItems: SidebarNavItem[] = [
 *     { href: "/home/workouts", label: "Workouts", iconName: "dumbbell" },
 *     { href: "/home/programs", label: "Programs", iconName: "calendar" },
 *   ];
 */

export type SidebarIconName =
  | "layout-grid"
  | "list"
  | "folder"
  | "calendar"
  | "users"
  | "shopping-bag"
  | "package"
  | "file-text"
  | "image"
  | "music"
  | "video"
  | "message-square"
  | "bell"
  | "star"
  | "heart"
  | "bookmark"
  | "trophy"
  | "dumbbell"
  | "book"
  | "graduation-cap"
  | "briefcase"
  | "wallet"
  | "trending-up"
  | "bar-chart"
  | "globe"
  | "map";

export type SidebarNavItem = {
  href: string;
  label: string;
  iconName?: SidebarIconName;
};

export const extraSidebarNavItems: SidebarNavItem[] = [];
