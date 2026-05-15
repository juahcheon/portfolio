import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const noto = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["100","200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-noto",
});

export const metadata: Metadata = {
  title: "주아 | 프론트엔드 포트폴리오",
  description: "Next.js + REST API 데스크톱 스타일 포트폴리오",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={noto.variable}>
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
