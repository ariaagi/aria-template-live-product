import { NextResponse } from "next/server";

type AuthRouteContext = {
  params: Promise<{ path: string[] }>;
};

async function getHandlers() {
  const { authApiHandler } = await import("@neondatabase/auth/next/server");
  return authApiHandler();
}

function missingAuthUrlResponse() {
  return NextResponse.json(
    {
      error:
        "NEON_AUTH_BASE_URL is not configured. ARIA should inject auth environment values during build/deploy.",
    },
    { status: 500 }
  );
}

export async function GET(request: Request, context: AuthRouteContext) {
  if (!process.env.NEON_AUTH_BASE_URL) {
    return missingAuthUrlResponse();
  }

  const { GET: handler } = await getHandlers();
  return handler(request, context);
}

export async function POST(request: Request, context: AuthRouteContext) {
  if (!process.env.NEON_AUTH_BASE_URL) {
    return missingAuthUrlResponse();
  }

  const { POST: handler } = await getHandlers();
  return handler(request, context);
}
