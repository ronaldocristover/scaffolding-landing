"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Carousel from "@/components/Carousel";
import ContactInfo from "@/components/ContactInfo";
import FloatingButtons from "@/components/FloatingButtons";
import Header from "@/components/Header";
import PricingSection from "@/components/PricingSection";
import { getImageSrc, getImageAlt, type ContactInfoType } from "@/lib/utils";
import { QuotePricingInfo } from "@/services/quote-price-service";

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
  const t = useTranslations();
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
    <div className="min-h-screen bg-white">
      <Header
        companyInfo={companyInfo}
        phoneNumber={companyInfo?.phone || ""}
      />

      {/* Hero Section */}
      <section id="home" className="bg-[#C0FF4B] py-12 sm:py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {banners.length > 0 && (
            <div className="relative">
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
                      <div className="relative w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] md:w-[563px] md:h-[563px] rounded-lg">
                        <Image
                          src={banner}
                          alt={banner + "-" + index}
                          width={563}
                          height={563}
                          className="rounded-lg object-contain w-full h-full max-w-full max-h-full"
                          priority={index === 0}
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
              {aboutCompanyInfo.title || t("about.title")}
            </h2>
            <p className="text-base sm:text-lg text-gray-800 mb-4 px-4">
              {aboutCompanyInfo.subtitle || t("about.subtitle")}
            </p>
          </div>

          {/* Company Images */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 sm:gap-8 md:gap-12 mb-12">
            {aboutCompanyInfo?.images?.section1.map((item, index) => (
              <div key={index} className="text-center">
                <div className="relative w-full max-w-[280px] sm:max-w-[302px] aspect-square mx-auto">
                  <Image
                    src={getImageSrc(item)}
                    alt={getImageAlt(item, t("about.companyImage1Alt"))}
                    width={302}
                    height={302}
                    className="object-contain w-full h-full max-w-full max-h-full"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Company Description Text */}
          <div className="text-center">
            <div
              className="text-base sm:text-lg text-black leading-relaxed max-w-5xl mx-auto px-4"
              dangerouslySetInnerHTML={{
                __html: aboutCompanyInfo.content || t("about.description"),
              }}
            />
          </div>
        </div>
      </section>

      {/* Company Logos Section */}
      <section className="py-8 sm:py-12 bg-white" id="company-logos">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="flex gap-4 sm:gap-8 overflow-x-auto pb-4 scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {aboutCompanyInfo.images?.section2?.map((item, idx) => {
              const imageSrc = getImageSrc(item);
              return (
                <div
                  key={idx}
                  className="w-[200px] h-[138px] sm:w-[250px] sm:h-[173px] md:w-[300px] md:h-[207px] flex items-center justify-center flex-shrink-0"
                >
                  <Image
                    src={imageSrc}
                    alt={getImageAlt(item, `${imageSrc}-${idx + 1}`)}
                    width={300}
                    height={207}
                    className="object-contain w-full h-full max-w-full max-h-full"
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
            <Carousel
              items={aboutCompanyInfo.images.section3.map((item, index) => ({
                type: "image" as const,
                src: getImageSrc(item),
                alt: getImageAlt(item, `Gallery image ${index + 1}`),
              }))}
              autoPlay={true}
              interval={4000}
            />
          </div>
        </section>
      )}

      {/* Pricing Section */}
      {/* <PricingSection quotePricing={quotePricing} /> */}

      <ContactInfo contacts={contactInfo} contactBaseInfo={contactBaseInfo} />

      {/* Footer */}
      <footer
        id="contact"
        className="text-white bg-gradient-to-b from-[#FFFBB5] to-[#E0B700]"
      >
        <div className="pt-8 pb-8 text-center text-black">
          <p>{companyInfo.footer || t("footer.copyright")}</p>
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
    </div>
  );
}
