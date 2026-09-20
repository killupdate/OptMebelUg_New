import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

const BOT_USERNAME = "optmebelug_givmypr_bot";
const ALLOWED_METHODS = new Set([
  "answerCallbackQuery",
  "getChat",
  "getChatMember",
  "getMe",
  "getWebhookInfo",
  "sendDocument",
  "sendMessage",
  "setWebhook",
]);

function tokenFrom(request: NextRequest): string | null {
  const authorization = request.headers.get("authorization") ?? "";
  const match = authorization.match(/^Bearer ([0-9]+:[A-Za-z0-9_-]+)$/);
  return match?.[1] ?? null;
}

async function telegram(token: string, method: string, body: string) {
  return fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
    cache: "no-store",
    signal: AbortSignal.timeout(20_000),
  });
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ method: string }> },
) {
  const token = tokenFrom(request);
  const { method } = await context.params;
  if (!token || !ALLOWED_METHODS.has(method)) {
    return new NextResponse(null, { status: 403 });
  }

  const body = await request.text();
  if (Buffer.byteLength(body) > 1_000_000) {
    return new NextResponse(null, { status: 413 });
  }
  try {
    const identity = await telegram(token, "getMe", "{}");
    const identityBody = await identity.json();
    if (
      !identity.ok ||
      identityBody?.ok !== true ||
      String(identityBody?.result?.username ?? "").toLowerCase() !== BOT_USERNAME
    ) {
      return new NextResponse(null, { status: 403 });
    }

    const response = await telegram(token, method, body || "{}");
    return new NextResponse(response.body, {
      status: response.status,
      headers: {
        "content-type": response.headers.get("content-type") ?? "application/json",
        "cache-control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}

export function GET() {
  return new NextResponse(null, { status: 405 });
}
