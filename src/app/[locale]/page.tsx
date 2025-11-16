"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AboutCompanyService from "@/services/about-company-service";
import BannerService from "@/services/banner-service";
import ContactService from "@/services/contact-service";
import CompanyInfoService from "@/services/company-info.service";
import QuotePriceService, {
  QuotePricingInfo,
} from "@/services/quote-price-service";
import Carousel from "@/components/Carousel";
import ContactInfo from "@/components/ContactInfo";
import FloatingButtons from "@/components/FloatingButtons";
import Header from "@/components/Header";
import {
  getImageSrc,
  getImageAlt,
  getApiContent,
  createContactInfo,
  type ContactInfoType,
} from "@/lib/utils";

type ImageItem = string | { src?: string; url?: string; alt?: string; type?: string };

type Props = {
  params: Promise<{ locale: string }>;
};

export default function Home({ params }: Props) {
  const [locale, setLocale] = useState<string | null>(null);
  const t = useTranslations();

  // Handle async params
  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setLocale(resolvedParams.locale);
    };
    getParams();
  }, [params]);

  const [banners, setBanners] = useState<string[]>([]);
  const [aboutCompanyInfo, setAboutCompanyInfo] = useState<{
    title: string;
    subtitle: string;
    content: string;
    images: {
      section1: ImageItem[];
      section2: ImageItem[];
      section3: ImageItem[];
    };
  }>({
    title: "",
    subtitle: "",
    content: "",
    images: {
      section1: [],
      section2: [],
      section3: [],
    },
  });

  const [companyInfo, setCompanyInfo] = useState({
    logo: "",
    name: "",
    title: "",
    subtitle: "",
    phone: "",
    footer: "",
    email: "",
    whatsapp: "",
  });
  const [contactInfo, setContactInfo] = useState<ContactInfoType[]>([]);
  const [contactBaseInfo, setContactBaseInfo] = useState({
    title: "",
    subtitle: "",
  });
  const [quotePricing, setQuotePricing] = useState<QuotePricingInfo>({
    title: "",
    subtitle: "",
    content: [],
  });
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Create memoized fetch data function
  const fetchData = useCallback(async () => {
    if (!locale) return; // Don't fetch until locale is set

    try {
      setLoading(true);

      // Fetch contact info
      const contactResponse = await ContactService.getContactInfo();
      const contactData = getApiContent(contactResponse);
      if (contactData) {
        setContactBaseInfo({
          title: contactData.title || t("contact.title"),
          subtitle: contactData.subtitle || t("contact.subtitle"),
        });
        setContactInfo(
          createContactInfo(contactData.content, {
            whatsapp: t("contact.whatsapp"),
            phone: t("contact.phone"),
            email: t("contact.email"),
            facebook: t("contact.facebook"),
          })
        );
      }

      // Fetch quote price info
      const quoteResponse = await QuotePriceService.getContactInfo();
      const quoteData = getApiContent<QuotePricingInfo>(quoteResponse);
      if (quoteData) {
        setQuotePricing({
          title: quoteData.title || "",
          subtitle: quoteData.subtitle || "",
          content: quoteData.content || [],
        });
      }

      // Fetch banners
      const bannerResponse = await BannerService.getBannerInfo();
      const bannerData = getApiContent<{ images?: string[] }>(bannerResponse);
      if (bannerData?.images) {
        setBanners(bannerData.images);
      }

      // Fetch about company
      const aboutCompanyResponse = await AboutCompanyService.getAboutInfo();
      const aboutData = getApiContent<{
        title?: string;
        subtitle?: string;
        content?: string;
        images?: {
          section1?: ImageItem[];
          section2?: ImageItem[];
          section3?: ImageItem[];
        };
      }>(aboutCompanyResponse);
      if (aboutData) {
        setAboutCompanyInfo({
          title: aboutData.title || t("about.title"),
          subtitle: aboutData.subtitle || t("about.subtitle"),
          content: aboutData.content || t("about.description"),
          images: {
            section1: aboutData.images?.section1 || [],
            section2: aboutData.images?.section2 || [],
            section3: aboutData.images?.section3 || [],
          },
        });
      }

      // Fetch company info
      const companyInfoResponse = await CompanyInfoService.getCompanyInfo();
      const companyData = getApiContent<typeof companyInfo>(companyInfoResponse);
      if (companyData) {
        setCompanyInfo(companyData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);

      // Fallback to hardcoded data if API fails
      setContactInfo(
        createContactInfo(undefined, {
          whatsapp: t("contact.whatsapp"),
          phone: t("contact.phone"),
          email: t("contact.email"),
          facebook: t("contact.facebook"),
        })
      );
    } finally {
      setLoading(false);
    }
  }, [locale, t]);

  // Fetch data from API on component mount and when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Scroll functions for hero section carousel
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = 563 + 32; // image width + gap
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = 563 + 32; // image width + gap
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C0FF4B] mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header companyInfo={companyInfo} phoneNumber={companyInfo?.phone || ""} />

      {/* Hero Section */}
      <section id="home" className="bg-[#C0FF4B] py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {banners.length > 0 && (
            <div className="relative">
              {/* Left Navigation Button */}
              {banners.length > 1 && (
                <button
                  onClick={scrollLeft}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors z-10 shadow-lg"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={28} />
                </button>
              )}

              {/* Scrollable Container */}
              <div
                ref={scrollContainerRef}
                className="overflow-x-auto scrollbar-hide scroll-smooth"
              >
                <div className="flex gap-8 pb-4">
                  {banners.map((banner: string, index: number) => (
                    <div
                      key={index}
                      className="flex-shrink-0 flex justify-center"
                    >
                      <div className="relative w-[563px] h-[563px] rounded-lg">
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors z-10 shadow-lg"
                  aria-label="Next image"
                >
                  <ChevronRight size={28} />
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* About Company Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Centered About Our Company Title */}
          <div className="text-center mb-16">
            <h2 className="font-viga text-3xl md:text-4xl text-black mb-2">
              {aboutCompanyInfo.title || t("about.title")}
            </h2>
            <p className="text-lg text-gray-800 mb-4">
              {aboutCompanyInfo.subtitle || t("about.subtitle")}
            </p>
          </div>

          {/* Company Images */}
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            {aboutCompanyInfo?.images?.section1.map((item, index) => (
              <div key={index} className="text-center">
                <div className="relative w-[302px] h-[302px] mx-auto">
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
              className="text-lg text-black leading-relaxed max-w-5xl mx-auto"
              dangerouslySetInnerHTML={{
                __html: aboutCompanyInfo.content || t("about.description")
              }}
            />
          </div>
        </div>
      </section>

      {/* Company Logos Section */}
      <section className="py-12 bg-white" id="company-logos">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
            {aboutCompanyInfo.images?.section2?.map((item, idx) => {
              const imageSrc = getImageSrc(item);
              return (
                <div
                  key={idx}
                  className="w-[200px] h-[138px] flex items-center justify-center"
                >
                  <Image
                    src={imageSrc}
                    alt={getImageAlt(item, `${imageSrc}-${idx + 1}`)}
                    width={200}
                    height={138}
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
        <section id="video" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Carousel
              items={aboutCompanyInfo.images.section3.map((item, index) => ({
                type: 'image' as const,
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
      <section id="pricing" className="py-20 bg-[#C0FF4B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-viga text-3xl md:text-4xl text-black mb-4">
              {/* {t("pricing.title")} */}
              {quotePricing.title || ""}
            </h2>
            <p className="text-lg text-black text-3xl mb-4">
              {/* {t("pricing.subtitle")} */}
              {quotePricing.subtitle || ""}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {quotePricing.content.map((item, idx) => (
              <div key={idx} className="p-8">
                <h3 className="font-viga text-2xl mb-4 text-black text-center">
                  {item["title"] as string}
                </h3>
                <div className="space-y-3 mb-8 text-black">
                  <p className="text-black">{item["content"] as string}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
