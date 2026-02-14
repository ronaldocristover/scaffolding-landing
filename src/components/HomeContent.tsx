"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getImageSrc, getImageAlt, type ContactInfoType } from "@/lib/utils";
import { QuotePricingInfo } from "@/services/quote-price-service";
import Header from "@/components/Header";

// Lazy load below-the-fold components
const ContactInfo = dynamic(() => import("@/components/ContactInfo"), {
  loading: () => <div className="h-64 animate-pulse bg-gray-100" />,
  ssr: true,
});

const FloatingButtons = dynamic(() => import("@/components/FloatingButtons"), {
  ssr: false, // Only load on client side
});

const Carousel = dynamic(() => import("@/components/Carousel"), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100" />,
  ssr: true,
});

type ImageItem =
  | string
  | { src?: string; url?: string; alt?: string; type?: string };

export interface AboutCompanyInfo {
  title: string;
  subtitle: string;
  content: string;
  images: {
    section1: ImageItem[];
    section2: ImageItem[];
    section3: ImageItem[];
  };
}

export interface CompanyInfo {
  logo: string;
  name: string;
  title: string;
  subtitle: string;
  phone: string;
  footer: string;
  email: string;
  whatsapp: string;
}

export interface ContactBaseInfo {
  title: string;
  subtitle: string;
}

interface HomeContentProps {
  banners: string[];
  aboutCompanyInfo: AboutCompanyInfo;
  companyInfo: CompanyInfo;
  contactInfo: ContactInfoType[];
  contactBaseInfo: ContactBaseInfo;
  quotePricing: QuotePricingInfo;
}

export default function HomeContent({
  banners,
  aboutCompanyInfo,
  companyInfo,
  contactInfo,
  contactBaseInfo,
  quotePricing,
}: HomeContentProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll functions for hero section carousel
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      // Responsive scroll amount based on screen size
      const isMobile = window.innerWidth < 640;
      const isTablet = window.innerWidth >= 640 && window.innerWidth < 768;
      const scrollAmount = isMobile ? 280 + 16 : isTablet ? 400 + 32 : 563 + 32;
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      // Responsive scroll amount based on screen size
      const isMobile = window.innerWidth < 640;
      const isTablet = window.innerWidth >= 640 && window.innerWidth < 768;
      const scrollAmount = isMobile ? 280 + 16 : isTablet ? 400 + 32 : 563 + 32;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <Header
        companyInfo={companyInfo}
        phoneNumber={companyInfo?.phone || ""}
      />

      {/* Hero Section */}
      <section id="home" className="bg-[#C0FF4B] py-12 sm:py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black text-center mb-8 font-viga">
            {companyInfo.name || "Leego Scaffolding"} -{" "}
            {companyInfo.title || "Professional Scaffolding Services"}
          </h1> */}
          {banners.length > 0 && (
            <div className="relative min-h-[280px] sm:min-h-[400px] md:min-h-[563px]">
              {/* Left Navigation Button */}
              {banners.length > 1 && (
                <button
                  onClick={scrollLeft}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 sm:p-3 rounded-full hover:bg-black/70 transition-colors z-10 shadow-lg"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} className="sm:w-7 sm:h-7" />
                </button>
              )}

              {/* Scrollable Container */}
              <div
                ref={scrollContainerRef}
                className="overflow-x-auto scrollbar-hide scroll-smooth"
              >
                <div className="flex gap-4 sm:gap-8 pb-4">
                  {banners.map((banner: string, index: number) => (
                    <div
                      key={index}
                      className="flex-shrink-0 flex justify-center"
                    >
                      <div className="relative w-[280px] sm:w-[400px] md:w-[563px] rounded-lg overflow-hidden">
                        <Image
                          src={banner}
                          alt={`Leego Scaffolding professional work showcase ${index + 1}`}
                          width={563}
                          height={563}
                          className="rounded-lg w-full h-auto"
                          priority={index === 0}
                          sizes="(max-width: 640px) 280px, (max-width: 768px) 400px, 563px"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Navigation Button */}
              {banners.length > 1 && (
                <button
                  onClick={scrollRight}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 sm:p-3 rounded-full hover:bg-black/70 transition-colors z-10 shadow-lg"
                  aria-label="Next image"
                >
                  <ChevronRight size={20} className="sm:w-7 sm:h-7" />
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* About Company Section */}
      <section id="about" className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Centered About Our Company Title */}
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="font-viga text-2xl sm:text-[30px] text-black mb-2">
              {aboutCompanyInfo.title || "關於我們"}
            </h2>
            <p className="text-base sm:text-lg text-gray-800 mb-4 px-4">
              {aboutCompanyInfo.subtitle || "超過20年的專業搭棚經驗"}
            </p>
          </div>

          {/* H3: Company Introduction */}
          <h3
            className="text-xl sm:text-2xl font-semibold text-center mb-8 text-gray-900"
            style={{ display: "none" }}
          >
            專業搭棚服務，安全可靠
          </h3>

          {/* Add bullet points for services */}
          <div
            className="max-w-4xl mx-auto mb-12 px-4"
            style={{ display: "none" }}
          >
            <ul className="text-left space-y-3 text-base sm:text-lg text-gray-800">
              <li className="flex items-start">
                <span className="text-green-600 mr-2 text-xl">✓</span>
                <span>小型工程搭棚 - 為住宅裝修提供安全棚架</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 text-xl">✓</span>
                <span>工業搭棚 - 大型建築項目的專業解決方案</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 text-xl">✓</span>
                <span>外牆維修搭棚 - 外牆工程的安全保障</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2 text-xl">✓</span>
                <span>
                  <a
                    href="#contact"
                    className="text-blue-600 hover:text-blue-800 underline font-medium"
                  >
                    立即獲取免費報價
                  </a>{" "}
                  - 電話: {companyInfo?.phone || "+852-6806-0108"}
                </span>
              </li>
            </ul>
          </div>

          {/* Company Images */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 sm:gap-8 md:gap-12 mb-12">
            {aboutCompanyInfo?.images?.section1.map((item, index) => (
              <div key={index} className="text-center">
                <div
                  className="relative w-full max-w-[280px] sm:max-w-[302px] aspect-square mx-auto overflow-hidden"
                  style={{ aspectRatio: "1/1" }}
                >
                  <Image
                    src={getImageSrc(item)}
                    alt={getImageAlt(item, "康師傅搭棚公司工程圖片")}
                    width={302}
                    height={302}
                    className="object-contain w-full h-full"
                    sizes="(max-width: 640px) 280px, 302px"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Company Description Text */}
          <div className="text-center">
            {/* Add internal links in description */}
            <div
              className="text-base sm:text-lg text-black leading-relaxed max-w-5xl mx-auto px-4"
              dangerouslySetInnerHTML={{
                __html:
                  aboutCompanyInfo.content ||
                  '<p>康師傅搭棚公司擁有超過20年的專業搭棚經驗。</p><p>我們提供專業的<a href="#contact" className="text-blue-600 hover:text-blue-800 underline">搭棚服務</a>，包括竹棚搭建、金屬棚架等。歡迎查看我們的<a href="#company-logos" className="text-blue-600 hover:text-blue-800 underline">客戶案例</a>和<a href="#video" className="text-blue-600 hover:text-blue-800 underline">工程作品</a>。</p>',
              }}
            />
          </div>
        </div>
      </section>

      {/* Company Logos Section */}
      <section className="py-8 sm:py-12 bg-white" id="company-logos">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* H2: Client Projects */}
          <h2
            className="font-viga text-2xl sm:text-[30px] text-black text-center mb-8"
            style={{ display: "none" }}
          >
            客戶案例展示
          </h2>
          <div
            className="flex gap-4 sm:gap-8 overflow-x-auto pb-4 scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {aboutCompanyInfo.images?.section2?.map((item, idx) => {
              const imageSrc = getImageSrc(item);
              return (
                <div
                  key={idx}
                  className="w-[200px] h-[138px] sm:w-[250px] sm:h-[173px] md:w-[300px] md:h-[207px] flex items-center justify-center flex-shrink-0 overflow-hidden"
                  style={{ aspectRatio: "300/207" }}
                >
                  <Image
                    src={imageSrc}
                    alt={getImageAlt(
                      item,
                      `Leego Scaffolding client project ${idx + 1}`,
                    )}
                    width={300}
                    height={207}
                    className="object-contain w-full h-full"
                    sizes="(max-width: 640px) 200px, (max-width: 768px) 250px, 300px"
                    loading="lazy"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Carousel Section */}
      {aboutCompanyInfo && aboutCompanyInfo.images?.section3 && (
        <section id="video" className="py-12 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* H2: Project Gallery */}
            <h2
              className="font-viga text-2xl sm:text-[30px] text-black text-center mb-8"
              style={{ display: "none" }}
            >
              工程作品展示
            </h2>
            <Carousel
              items={aboutCompanyInfo.images.section3.map((item, index) => ({
                type: "image" as const,
                src: getImageSrc(item),
                alt: getImageAlt(
                  item,
                  `Leego Scaffolding completed project gallery ${index + 1}`,
                ),
              }))}
              autoPlay={true}
              interval={4000}
            />
          </div>
        </section>
      )}

      <ContactInfo contacts={contactInfo} contactBaseInfo={contactBaseInfo} />

      {/* Why Choose Us Section with internal links */}
      <section
        className="py-12 sm:py-16 bg-gray-50"
        style={{ display: "none" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-viga text-2xl sm:text-[30px] text-black text-center mb-8">
            為什麼選擇康師傅搭棚？
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                安全專業
              </h3>
              <p className="text-gray-700 mb-4">
                康師傅入行26年，所有個人及公司牌照齊備，確保工程安全。
              </p>
              <a
                href="#about"
                className="text-blue-600 hover:text-blue-800 underline font-medium inline-flex items-center"
              >
                了解更多 →
              </a>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                定價公道
              </h3>
              <p className="text-gray-700 mb-4">
                企理妥當的服務，透明公道的收費標準，不隱藏費用。
              </p>
              <a
                href="#contact"
                className="text-blue-600 hover:text-blue-800 underline font-medium inline-flex items-center"
              >
                免費報價 →
              </a>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                經驗豐富
              </h3>
              <p className="text-gray-700 mb-4">
                超過20年的專業經驗，服務全香港，完成無數工程項目。
              </p>
              <a
                href="#video"
                className="text-blue-600 hover:text-blue-800 underline font-medium inline-flex items-center"
              >
                查看案例 →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="contact"
        className="text-white bg-gradient-to-b from-[#FFFBB5] to-[#E0B700]"
      >
        <div className="pt-8 pb-8 text-center text-black">
          <p>{companyInfo.footer || "© 2024 康師傅搭棚公司. 版權所有."}</p>
        </div>
      </footer>

      <FloatingButtons
        email={
          companyInfo.email?.replace("mailto:", "") ||
          "leego.scaffolding@gmail.com"
        }
        whatsapp={
          "https://wa.me/" + companyInfo.whatsapp?.replace(/\D/g, "") ||
          "85268060108"
        }
      />
    </main>
  );
}
