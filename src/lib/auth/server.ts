import { createAuthServer } from "@neondatabase/auth/next/server";

export function getAuthServer() {
  if (!process.env.NEON_AUTH_BASE_URL) {
    return null;
  }

  return createAuthServer();
}
