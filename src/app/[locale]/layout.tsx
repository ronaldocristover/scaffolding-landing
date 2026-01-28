import { routing } from "@/i18n/routing";
import {
  setRequestLocale,
  getTranslations,
  getMessages,
} from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { ReactNode, Suspense } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Viga } from "next/font/google";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const viga = Viga({
  variable: "--font-viga",
  subsets: ["latin"],
  weight: "400",
});

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return {
    metadataBase: new URL("https://leegoscaffolding.com"),
    title: t("metadata.siteTitle") + " - " + t("metadata.tagline"),
    description: t("about.description").slice(0, 160),
    keywords:
      locale === "zh"
        ? "搭棚, 香港, 建築, 安全, 專業搭棚, 康師傅搭棚, 利高棚業, 竹棚, 金屬棚, 外牆維修, 裝修工程, 搭棚工程, 康師傅搭掤, scaffolding, leego, 康師傅, 康師父, 搭掤, 掤業, 掤架"
        : "scaffolding, Hong Kong, construction, safety, professional scaffolding, Master Hong, bamboo scaffolding, metal scaffolding, exterior wall repair, renovation, scaffolding engineering, 康師傅搭掤, leego, 康師傅, 康師父, 搭掤, 掤業, 竹棚, 掤架",
    authors: [{ name: "Leego Scaffolding" }],
    openGraph: {
      title: t("metadata.siteTitle") + " - " + t("about.title"),
      description: t("about.description").slice(0, 160),
      type: "website",
      locale: locale === "zh" ? "zh_HK" : "en_US",
      siteName: "Leego Scaffolding",
      images: [
        {
          url: "/certificate.jpeg",
          width: 350,
          height: 400,
          alt: t("hero.certificateAlt1"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("metadata.siteTitle") + " - " + t("about.title"),
      description: t("about.description").slice(0, 160),
      images: ["/certificate.jpeg"],
    },
    alternates: {
      canonical: `https://leegoscaffolding.com/${locale}`,
      languages: {
        "zh-HK": "https://leegoscaffolding.com/zh",
        "en-US": "https://leegoscaffolding.com/en",
      },
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

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${viga.variable} antialiased`}
      >
        <Suspense fallback={null}>
          <NextIntlClientProvider messages={messages}>
            {children}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "LocalBusiness",
                  name: "Leego Scaffolding",
                  alternateName: "康師傅搭棚工程",
                  description:
                    locale === "zh"
                      ? "專業搭棚服務，超過20年經驗，安全可靠，公道取價"
                      : "Professional scaffolding services with over 20 years of experience. Safe, reliable, and fairly priced.",
                  url: `https://leegoscaffolding.com/${locale}`,
                  telephone: "+852-6806-0108",
                  email: "leego.scaffolding@gmail.com",
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: "Hong Kong",
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
                  hasOfferCatalog: {
                    "@type": "OfferCatalog",
                    name: "Scaffolding Services",
                    itemListElement: [
                      {
                        "@type": "OfferCatalog",
                        name:
                          locale === "zh"
                            ? "小型工程搭棚"
                            : "Small Construction Scaffolding",
                      },
                      {
                        "@type": "OfferCatalog",
                        name:
                          locale === "zh"
                            ? "工業搭棚"
                            : "Industrial Scaffolding",
                      },
                      {
                        "@type": "OfferCatalog",
                        name:
                          locale === "zh" ? "安全檢查" : "Safety Inspection",
                      },
                    ],
                  },
                }),
              }}
            />
          </NextIntlClientProvider>
        </Suspense>
      </body>
    </html>
  );
}
