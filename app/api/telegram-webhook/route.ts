import { createCipheriv, createHash, randomBytes } from "node:crypto";

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

const SPACEWEB_URL = "http://optmebelug.temp.swtest.ru/webhook.php";

function encrypt(body: string, secret: string) {
  const key = createHash("sha256")
    .update("spaceweb-telegram-v1\0")
    .update(secret)
    .digest();
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(body, "utf8"), cipher.final()]);
  return JSON.stringify({
    iv: iv.toString("base64"),
    tag: cipher.getAuthTag().toString("base64"),
    data: ciphertext.toString("base64"),
  });
}

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-telegram-bot-api-secret-token") ?? "";
  if (!secret || secret.length > 256) {
    return new NextResponse(null, { status: 403 });
  }

  const body = await request.text();
  if (Buffer.byteLength(body) > 1_000_000) {
    return new NextResponse(null, { status: 413 });
  }

  try {
    const response = await fetch(SPACEWEB_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-spaceweb-payload": "aes-256-gcm",
      },
      body: encrypt(body, secret),
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
      redirect: "manual",
    });
    return new NextResponse(null, { status: response.status });
  } catch {
    return new NextResponse(null, { status: 502 });
  }
}

export function GET() {
  return new NextResponse(null, { status: 405 });
}
