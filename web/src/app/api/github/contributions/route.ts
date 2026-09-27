import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { parseGithubContributions } from "@/lib/githubContributions";

export const runtime = "nodejs";

export async function GET() {
  try {
    const portfolio = JSON.parse(await readFile(join(process.cwd(), "data", "portfolio.json"), "utf-8"));
    const username: string = portfolio.github.username;
    if (!/^[a-zA-Z0-9][a-zA-Z0-9-]{0,38}$/.test(username)) throw new Error("Invalid GitHub username");
    const response = await fetch(`https://github.com/users/${username}/contributions`, {
      cache: "no-store",
      headers: { "Accept-Language": "en", Accept: "text/html" },
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
    const days = parseGithubContributions(await response.text());
    return NextResponse.json({ username, days }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "기여 활동을 불러오지 못했습니다." }, {
      status: 502,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
