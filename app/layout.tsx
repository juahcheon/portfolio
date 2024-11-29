import "./global.css";
import type { Metadata } from "next";
import { Navbar } from "../components/nav";
import Footer from "../components/footer";
import { baseUrl } from "./sitemap";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "개발자 꿈나무의 작업실",
    template: "%s | 개발자 꿈나무의 작업실",
  },
  description: "포트폴리오 겸 개발 공부장으로 만들어둔 공간입니다.",
  openGraph: {
    title: "My Portfolio",
    description: "This is my portfolio.",
    url: baseUrl,
    siteName: "My Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/profile.jpg",
        width: 800,
        height: 600,
        alt: "프로필 이미지",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    card: "summary_large_image",
    images: ["/profile.jpg"],
  },
  icons: {
    icon: "/profile.jpg",
    apple: "/profile.jpg",
  },
};

// const cx = (...classes) => classes.filter(Boolean).join(" ");

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
      // className={cx(GeistSans.variable, GeistMono.variable)}/
    >
      <body className='antialiased max-w-xl mx-4 mt-8 lg:mx-auto text-black bg-white dark:text-white dark:bg-black'>
        <ThemeProvider attribute='class' defaultTheme='light'>
          <main className='flex-auto min-w-0 mt-6 flex flex-col px-2 md:px-0'>
            <Navbar />
            {children}
            <Footer />
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
