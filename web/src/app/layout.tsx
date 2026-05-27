import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const noto = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto",
});

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
    <html lang="ko" className={noto.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
