import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

const BASE_URL = "https://portfolio-dusky-three-v0owey1kvg.vercel.app";

export const metadata: Metadata = {
  title: "천주아 | 웹 프론트엔드 개발자 포트폴리오",
  description: "데스크톱 UI 메타포로 구현한 천주아의 프론트엔드 포트폴리오입니다. Next.js, React, TypeScript 기반으로 제작되었습니다.",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    type: "website",
    url: BASE_URL,
    title: "천주아 | 웹 프론트엔드 개발자 포트폴리오",
    description: "데스크톱 UI 메타포로 구현한 천주아의 프론트엔드 포트폴리오입니다.",
    siteName: "천주아 포트폴리오",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "천주아 포트폴리오" }],
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "천주아 | 웹 프론트엔드 개발자 포트폴리오",
    description: "데스크톱 UI 메타포로 구현한 천주아의 프론트엔드 포트폴리오입니다.",
    images: ["/og.png"],
  },
  alternates: {
    canonical: BASE_URL,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "천주아",
  alternateName: "Juah Cheon",
  jobTitle: "웹 프론트엔드 개발자",
  url: BASE_URL,
  sameAs: ["https://github.com/juahcheon"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans">
        <div className="flex md:hidden fixed inset-0 z-[9999] flex-col items-center justify-center gap-5 bg-[#5f9ea0]">
          <svg width="96" height="96" viewBox="0 0 32 32" aria-hidden="true">
            <polygon points="31,16 23.5,3 8.5,3 1,16 8.5,29 23.5,29" fill="white" />
            <text
              x="7" y="14"
              dominantBaseline="central"
              fill="#5f9ea0"
              fontFamily="Consolas,'Courier New',monospace"
              fontSize="13"
              fontWeight="700"
            >{`>_`}</text>
          </svg>
          <div className="flex flex-col items-center gap-2 text-center px-8">
            <p className="text-white text-2xl font-bold tracking-tight">데스크톱에서 접속해주세요</p>
            <p className="text-white/75 text-sm leading-relaxed">
              이 포트폴리오는 PC 환경에 최적화되어 있습니다
            </p>
          </div>
          <p className="text-white/50 text-xs font-mono mt-2">portfolio-dusky-three-v0owey1kvg.vercel.app</p>
        </div>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
