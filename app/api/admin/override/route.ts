import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

function getOverridePath() {
  return path.join(process.cwd(), "ru.override.json");
}

function requireAuth(request: Request) {
  const user = process.env.ADMIN_USERNAME ?? "";
  const pass = process.env.ADMIN_PASSWORD ?? "";
  const header = request.headers.get("authorization") ?? "";

  if (!header.startsWith("Basic ")) return false;

  const decoded = Buffer.from(header.slice(6), "base64").toString("utf8");

  const idx = decoded.indexOf(":");
  const u = idx >= 0 ? decoded.slice(0, idx) : decoded;
  const p = idx >= 0 ? decoded.slice(idx + 1) : "";

  return u === user && p === pass;
}

async function ghJson<T>(url: string, init?: RequestInit): Promise<T> {
  const token = process.env.GITHUB_TOKEN ?? "";
  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GitHub API ${res.status}: ${text}`);
  }

  return (await res.json()) as T;
}

function toBase64Utf8(s: string) {
  return Buffer.from(s, "utf8").toString("base64");
}

function fromBase64Utf8(b64: string) {
  return Buffer.from((b64 ?? "").replace(/\n/g, ""), "base64").toString("utf8");
}

export async function GET(request: Request) {
  if (!requireAuth(request)) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
    });
  }

  const isVercel = process.env.VERCEL === "1";

  // Vercel: читаем из GitHub
  if (isVercel) {
    const owner = process.env.GITHUB_OWNER ?? "";
    const repo = process.env.GITHUB_REPO ?? "";
    const branch = process.env.GITHUB_BRANCH ?? "";
    const token = process.env.GITHUB_TOKEN ?? "";
    if (!owner || !repo || !branch || !token) return NextResponse.json({});

    try {
      const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(
        "ru.override.json"
      )}?ref=${encodeURIComponent(branch)}`;

      const data = await ghJson<{ content?: string }>(url, { method: "GET" });
      const raw = fromBase64Utf8(data.content ?? "");
      const json = raw.trim() ? JSON.parse(raw) : {};
      return NextResponse.json(json);
    } catch {
      return NextResponse.json({});
    }
  }

  // Локально: читаем файл
  const file = getOverridePath();
  if (!fs.existsSync(file)) return NextResponse.json({});

  try {
    const raw = fs.readFileSync(file, "utf8");
    const json = raw.trim() ? JSON.parse(raw) : {};
    return NextResponse.json(json);
  } catch {
    return NextResponse.json({});
  }
}

export async function PUT(request: Request) {
  if (!requireAuth(request)) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
    });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad JSON" }, { status: 400 });
  }

  const pretty = JSON.stringify(body ?? {}, null, 2) + "\n";
  const isVercel = process.env.VERCEL === "1";

  // Локально: пишем в файл
  if (!isVercel) {
    try {
      fs.writeFileSync(getOverridePath(), pretty, "utf8");
      return NextResponse.json({ ok: true, mode: "local-file" });
    } catch (e: any) {
      return NextResponse.json(
        { ok: false, error: String(e?.message ?? "Write failed") },
        { status: 500 }
      );
    }
  }

  // Vercel: коммитим в GitHub
  const owner = process.env.GITHUB_OWNER ?? "";
  const repo = process.env.GITHUB_REPO ?? "";
  const branch = process.env.GITHUB_BRANCH ?? "";
  const token = process.env.GITHUB_TOKEN ?? "";
  if (!owner || !repo || !branch || !token) {
    return NextResponse.json(
      { ok: false, error: "Missing GitHub env (OWNER/REPO/BRANCH/TOKEN)" },
      { status: 500 }
    );
  }

  const pathInRepo = "ru.override.json";

  try {
    // sha, если файл существует
    type GetContentResp = { sha: string };
    let sha: string | undefined;

    try {
      const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(
        pathInRepo
      )}?ref=${encodeURIComponent(branch)}`;
      const existing = await ghJson<GetContentResp>(url, { method: "GET" });
      sha = existing.sha;
    } catch (e: any) {
      const msg = String(e?.message ?? "");
      if (!msg.includes(" 404:")) throw e;
    }

    // PUT contents
    type PutContentResp = { commit: { sha: string } };

    const putUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(
      pathInRepo
    )}`;

    const payload: any = {
      message: `admin: update ${pathInRepo}`,
      content: toBase64Utf8(pretty),
      branch,
    };
    if (sha) payload.sha = sha;

    const out = await ghJson<PutContentResp>(putUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return NextResponse.json({
      ok: true,
      mode: "github-commit",
      commitSha: out.commit.sha,
    });
  } catch (e: any) {
    const details =
      e?.cause ? `${e.message} | cause: ${String(e.cause)}` : String(e?.message ?? e);
    console.error("GitHub PUT failed:", e);
    return NextResponse.json({ ok: false, error: details }, { status: 500 });
  }
}
