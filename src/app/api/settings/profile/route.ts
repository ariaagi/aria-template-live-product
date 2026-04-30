import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { getDbPool } from "@/lib/db";
import { canUserRunProtectedAction } from "@/lib/server/billing/gating";

export const runtime = "nodejs";

function normalizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function GET(request: Request): Promise<NextResponse> {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const pool = getDbPool();
  const { rows } = await pool.query<{ name: string | null; email: string | null }>(
    `SELECT name, email FROM "user" WHERE id = $1 LIMIT 1`,
    [session.user.id]
  );
  const row = rows[0];
  return NextResponse.json({
    ok: true,
    name: row?.name ?? "",
    email: row?.email ?? "",
    productUpdates: true,
  });
}

export async function PATCH(request: Request): Promise<NextResponse> {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user?.id) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  if (!(await canUserRunProtectedAction(session.user.id))) {
    return NextResponse.json(
      { ok: false, error: "subscription_required_for_action" },
      { status: 402 }
    );
  }

  const body = (await request.json().catch(() => null)) as
    | { name?: unknown; email?: unknown; productUpdates?: unknown }
    | null;
  const name = normalizeText(body?.name);
  const ignoredEmail = normalizeText(body?.email);

  if (!name) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const pool = getDbPool();
  try {
    const { rows } = await pool.query<{ name: string; email: string | null }>(
      `UPDATE "user"
       SET name = $2, "updatedAt" = now()
       WHERE id = $1
       RETURNING name, email`,
      [session.user.id, name]
    );
    const row = rows[0];
    return NextResponse.json({
      ok: true,
      name: row?.name ?? name,
      email: row?.email ?? ignoredEmail ?? "",
      productUpdates: true,
    });
  } catch {
    return NextResponse.json({ ok: false, error: "internal_error" }, { status: 500 });
  }
}
