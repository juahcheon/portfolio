import type { PortfolioPayload } from "@/types/portfolio";

function getBaseUrl(): string {
  const fromEnv =
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_PORTFOLIO_API_URL
      : undefined;
  if (fromEnv?.trim()) return fromEnv.replace(/\/$/, "");
  return "http://localhost:4000";
}

export async function fetchPortfolio(): Promise<PortfolioPayload> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/v1/portfolio`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`portfolio fetch failed: ${res.status}`);
  }
  return res.json() as Promise<PortfolioPayload>;
}
