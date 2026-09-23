import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

const SPACEWEB_ORDER_URL =
  "http://optmebelug.temp.swtest.ru/miniapp.php";

export async function POST(request: NextRequest) {
  const contentLength = Number(
    request.headers.get("content-length") ?? "0",
  );

  if (contentLength > 32_000) {
    return NextResponse.json(
      { ok: false, error: "Request too large" },
      { status: 413 },
    );
  }

  const body = await request.text();

  if (Buffer.byteLength(body) > 32_000) {
    return NextResponse.json(
      { ok: false, error: "Request too large" },
      { status: 413 },
    );
  }

  try {
    JSON.parse(body);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(SPACEWEB_ORDER_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-optmebelug-source": "telegram-mini-app",
      },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    });

    const responseBody = await response.text();

    return new NextResponse(responseBody, {
      status: response.status,
      headers: {
        "content-type":
          response.headers.get("content-type")
          ?? "application/json",
        "cache-control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Сервис временно недоступен" },
      { status: 502 },
    );
  }
}
