import {routing} from '@/i18n/routing';
import {setRequestLocale, getTranslations} from 'next-intl/server';
import {ReactNode} from 'react';
import type { Metadata } from "next";

type Props = {
  children: ReactNode;
  params: Promise<{locale: string}>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export async function generateMetadata({
  params
}: Props): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale});

  return {
    title: "Master Hong Scaffolding Works - " + t('about.title'),
    description: t('about.description').slice(0, 160),
    keywords: locale === 'zh'
      ? "搭棚, 香港, 建築, 安全, 專業搭棚, 康師傅搭棚, 利高棚業"
      : "scaffolding, Hong Kong, construction, safety, professional scaffolding, Master Hong",
    authors: [{ name: "Master Hong Scaffolding Works" }],
    openGraph: {
      title: "Master Hong Scaffolding Works - " + t('about.title'),
      description: t('about.description').slice(0, 160),
      type: "website",
      locale: locale === 'zh' ? 'zh_HK' : 'en_US',
      siteName: "Master Hong Scaffolding Works",
      images: [
        {
          url: '/certificate.jpeg',
          width: 350,
          height: 400,
          alt: t('hero.certificateAlt1'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: "Master Hong Scaffolding Works - " + t('about.title'),
      description: t('about.description').slice(0, 160),
      images: ['/certificate.jpeg'],
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'zh-HK': '/zh',
        'en-US': '/en',
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params
}: Props) {
  const {locale} = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Master Hong Scaffolding Works",
            "alternateName": "康師傅搭棚工程",
            "description": locale === 'zh'
              ? "專業搭棚服務，超過20年經驗，安全可靠，公道取價"
              : "Professional scaffolding services with over 20 years of experience. Safe, reliable, and fairly priced.",
            "url": `https://masterhongscaffolding.com/${locale}`,
            "telephone": "+852-6806-0108",
            "email": "leego.scaffolding@gmail.com",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Hong Kong",
              "addressCountry": "HK"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "22.3193",
              "longitude": "114.1694"
            },
            "sameAs": [
              "https://www.facebook.com/MasterHongScaffolding/",
              "https://wa.me/85268060108"
            ],
            "serviceArea": {
              "@type": "Place",
              "name": "Hong Kong"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Scaffolding Services",
              "itemListElement": [
                {
                  "@type": "OfferCatalog",
                  "name": locale === 'zh' ? "小型工程搭棚" : "Small Construction Scaffolding"
                },
                {
                  "@type": "OfferCatalog",
                  "name": locale === 'zh' ? "工業搭棚" : "Industrial Scaffolding"
                },
                {
                  "@type": "OfferCatalog",
                  "name": locale === 'zh' ? "安全檢查" : "Safety Inspection"
                }
              ]
            }
          })
        }}
      />
    </>
  );
}