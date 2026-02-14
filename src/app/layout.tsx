import { ReactNode, Suspense } from "react";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Viga } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "optional",
  preload: true,
  adjustFontFallback: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "optional",
  preload: false,
  adjustFontFallback: true,
});

const viga = Viga({
  variable: "--font-viga",
  subsets: ["latin"],
  weight: "400",
  display: "optional",
  preload: true,
  adjustFontFallback: true,
});

type Props = {
  children: ReactNode;
};

export async function generateMetadata(): Promise<Metadata> {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    metadataBase: new URL("https://leegoscaffolding.com"),
    title: "康師傅搭棚公司 - 專業搭棚工程超過20年經驗",
    description:
      "康師傅搭棚公司 - 香港專業搭棚服務超過20年。提供竹棚搭建、金屬棚架、外牆維修、小型工程服務。電話: +852-6806-0108",
    keywords:
      "康師傅搭掤, 康師傅搭棚, 搭棚, 搭掤, 香港, 建築, 安全, 專業搭棚, 利高棚業, 利高棚業工程, 竹棚, 竹棚搭建, 金屬棚, 金屬棚架, 外牆維修, 裝修工程, 搭棚工程, 掤業, 掤架, leego, scaffolding, 康師傅, 康師父, 香港搭棚, 搭棚公司, 專業搭棚公司, 小型工程, 濕碎, 濕碎工程, 香港建築, 棚架, 買棚, 租棚, 搭棚價錢, 搭棚收費, 搭棚師傅, 專業棚架",
    authors: [{ name: "康師傅搭棚公司" }],
    openGraph: {
      title: "康師傅搭棚公司 - 專業搭棚工程超過20年經驗",
      description:
        "康師傅搭棚公司 - 香港專業搭棚服務超過20年。提供竹棚搭建、金屬棚架、外牆維修、小型工程服務。電話: +852-6806-0108",
      type: "website",
      locale: "zh_HK",
      siteName: "康師傅搭棚公司",
      images: [
        {
          url: "https://leegoscaffolding.com/scaffolding-logo.png",
          width: 1200,
          height: 630,
          alt: "康師傅搭棚工程 - 專業竹棚搭建、金屬棚架、外牆維修、小型工程服務，超過20年經驗",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "康師傅搭棚公司 - 專業搭棚工程超過20年經驗",
      description:
        "康師傅搭棚公司 - 香港專業搭棚服務超過20年。提供竹棚搭建、金屬棚架、外牆維修、小型工程服務。電話: +852-6806-0108",
      images: ["https://leegoscaffolding.com/scaffolding-logo.png"],
      site: "@leegoscaffolding",
    },
    alternates: {
      canonical: "https://leegoscaffolding.com",
    },
    robots: {
      index: isProduction,
      follow: isProduction,
      googleBot: {
        index: isProduction,
        follow: isProduction,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: [
        { url: "/favicon/favicon.ico", sizes: "any" },
        { url: "/favicon/favicon.svg", type: "image/svg+xml" },
        {
          url: "/favicon/favicon-96x96.png",
          sizes: "96x96",
          type: "image/png",
        },
      ],
      apple: [
        {
          url: "/favicon/apple-touch-icon.png",
          sizes: "180x180",
          type: "image/png",
        },
      ],
    },
    manifest: "/favicon/site.webmanifest",
  };
}

export function generateViewport(): Viewport {
  return {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  };
}

export default async function RootLayout({ children }: Props) {
  return (
    <html lang="zh-HK">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-96N9T1MJP2"
          strategy="afterInteractive"
          defer
        />
        <Script id="google-analytics" strategy="afterInteractive" defer>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-96N9T1MJP2');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${viga.variable} antialiased`}
      >
        <Suspense fallback={null}>{children}</Suspense>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "康師傅搭棚公司",
              alternateName: [
                "康師傅搭棚公司",
                "康師傅搭掤",
                "利高棚業工程有限公司",
                "Master Hong Scaffolding",
                "Leego Scaffolding",
                "康師傅",
                "濕碎工程",
              ],
              description:
                "康師傅搭棚公司及利高棚業工程有限公司均為康師傅個人獨資公司。康師傅入行26年，所有個人及公司牌照全部齊備。公司業務以裝修及維修類懸空式棚架及小型工程類棚架為主，公司宗旨「安全專業」「企理妥當」「定價公道」歡迎whatapp 查詢",
              url: "https://leegoscaffolding.com",
              logo: "https://leegoscaffolding.com/scaffolding-logo.png",
              image: "https://leegoscaffolding.com/scaffolding-logo.png",
              telephone: "+852-6806-0108",
              email: "leego.scaffolding@gmail.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Hong Kong",
                addressLocality: "Hong Kong",
                postalCode: "999077",
                addressCountry: "HK",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: "22.3193",
                longitude: "114.1694",
              },
              sameAs: [
                "https://www.facebook.com/MasterHongScaffolding/",
                "https://wa.me/85268060108",
              ],
              serviceArea: {
                "@type": "Place",
                name: "Hong Kong",
              },
              priceRange: "$$",
              openingHours: "Mo-Sa 09:00-19:00",
              paymentAccepted: "Cash, Credit Card, Bank Transfer",
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Scaffolding Services",
                itemListElement: [
                  {
                    "@type": "Offer",
                    name: "小型工程搭棚",
                    description: "為小型建築工程提供專業搭棚服務",
                  },
                  {
                    "@type": "Offer",
                    name: "工業搭棚",
                    description: "工業設施和大型建築項目的搭棚解決方案",
                  },
                  {
                    "@type": "Offer",
                    name: "外牆維修搭棚",
                    description: "外牆維修和翻新工程的安全搭棚",
                  },
                  {
                    "@type": "Offer",
                    name: "安全檢查",
                    description: "專業棚架安全檢查和評估服務",
                  },
                ],
              },
              areaServed: {
                "@type": "City",
                name: "Hong Kong",
              },
              knowsAbout: [
                "康師傅搭掤",
                "利高棚業工程有限公司",
                "竹棚搭建",
                "金屬棚架",
                "搭棚安全",
                "外牆維修工程",
                "搭棚工程",
                "小型工程",
                "濕碎工程",
                "香港搭棚",
                "棚架租賃",
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "首頁",
                  item: "https://leegoscaffolding.com",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "關於我們",
                  item: "https://leegoscaffolding.com#about",
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: "聯絡我們",
                  item: "https://leegoscaffolding.com#contact",
                },
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "你們提供什麼類型的搭棚服務？",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text:
                      "我們提供小型工程搭棚、工業搭棚、外牆維修搭棚、裝修工程搭棚等專業服務。我們也提供棚架安全檢查服務。",
                  },
                },
                {
                  "@type": "Question",
                  name: "你們的搭棚服務覆蓋哪些地區？",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text:
                      "我們的搭棚服務覆蓋全香港，包括香港島、九龍和新界。",
                  },
                },
                {
                  "@type": "Question",
                  name: "你們有多少年的搭棚經驗？",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text:
                      "我們擁有超過20年的專業搭棚經驗，是香港知名的专业搭團隊。",
                  },
                },
                {
                  "@type": "Question",
                  name: "如何獲取搭棚服務報價？",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text:
                      "您可以通過電話 +852-6806-0108、WhatsApp 或電子郵件 leego.scaffolding@gmail.com 聯絡我們獲取免費報價。",
                  },
                },
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
