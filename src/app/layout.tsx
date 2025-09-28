import type { Metadata } from "next";
import { Geist, Geist_Mono, Viga } from "next/font/google";
import {getMessages} from 'next-intl/server';
import {NextIntlClientProvider} from 'next-intl';
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL('https://masterhongscaffolding.com'),
  title: "Master Hong Scaffolding Works - Professional Scaffolding Services",
  description: "Master Hong Scaffolding Works offers professional scaffolding services in Hong Kong with over 20 years of experience. Safe, reliable, and fairly priced scaffolding solutions.",
  keywords: "scaffolding, Hong Kong, construction, safety, professional scaffolding, 搭棚, 香港, 建築, 安全",
  authors: [{ name: "Master Hong Scaffolding Works" }],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#C0FF4B' }
    ]
  },
  manifest: '/manifest.json',
  openGraph: {
    title: "Master Hong Scaffolding Works - Professional Scaffolding Services",
    description: "Professional scaffolding services in Hong Kong with over 20 years of experience",
    type: "website",
    locale: "zh_HK",
    alternateLocale: "en_US",
  },
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();

  return (
    <html lang="zh">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${viga.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
