"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPortfolio } from "@/lib/api";
import { PortfolioDesktop } from "@/components/desktop/PortfolioDesktop";

export function HomePageClient() {
  const q = useQuery({
    queryKey: ["portfolio"],
    queryFn: fetchPortfolio,
  });

  if (q.isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-desk text-lg text-white">
        불러오는 중…
      </div>
    );
  }

  if (q.isError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-neutral-900 px-4 text-center text-white">
        <p className="font-medium">데이터를 불러오지 못했습니다.</p>
        <p className="text-sm text-neutral-300">
          <code className="rounded bg-neutral-800 px-1">web/data/portfolio.json</code>과{" "}
          <code className="rounded bg-neutral-800 px-1">/api/v1/portfolio</code> Route Handler를
          확인하세요.
        </p>
        <p className="text-xs text-red-200">{(q.error as Error).message}</p>
      </div>
    );
  }

  return <PortfolioDesktop data={q.data} />;
}
