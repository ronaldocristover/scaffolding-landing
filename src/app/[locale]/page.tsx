"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import AboutCompanyService from "@/services/about-company-service";
import BannerService, { BannerInfo } from "@/services/banner-service";
import BaseInfoService from "@/services/baseinfo-service";
import CarouselService from "@/services/carousel-service";
import ContactService from "@/services/contact-service";
import CompanyInfoService from "@/services/company-info.service";
import QuotePriceService, {
  QuotePricingInfo,
} from "@/services/quote-price-service";
import Carousel from "@/components/Carousel";
import ContactInfo from "@/components/ContactInfo";
import FloatingButtons from "@/components/FloatingButtons";
import Header from "@/components/Header";

interface ContactInfoType {
  icon: string;
  alt: string;
  text: string;
  link?: string;
}

interface CarouselItemType {
  type: "image" | "video";
  src: string;
  alt: string;
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default function Home({ params }: Props) {
  const [locale, setLocale] = useState<string>("en");
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
  const [aboutCompanyInfo, setAboutCompanyInfo] = useState({
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
  const [carouselItems, setCarouselItems] = useState<CarouselItemType[]>([]);
  const [quotePricing, setQuotePricing] = useState<QuotePricingInfo>({
    title: "",
    subtitle: "",
    content: [],
  });
  const [loading, setLoading] = useState(true);

  // Create memoized fetch data function
  const fetchData = useCallback(async () => {
    if (locale === "en") return; // Don't fetch until locale is set

    try {
      setLoading(true);

      // Fetch contact info
      const contactResponse = await ContactService.getContactInfo();
      if (contactResponse.success && contactResponse.data) {
        const contactBaseInfo = {
          title: contactResponse.data.title || t("contact.title"),
          subtitle: contactResponse.data.subtitle || t("contact.subtitle"),
        };
        const contacts: ContactInfoType[] = [
          {
            icon: "/whatsapp-icon.png",
            alt: t("contact.whatsapp"),
            text: contactResponse.data.content?.whatsapp || "+852 6806-0108",
            link: contactResponse.data.content?.whatsapp || "+852 6806-0108",
          },
          {
            icon: "/print-icon.png",
            alt: t("contact.phone"),
            text: contactResponse.data.content?.phone || "+852 3020-6719",
            link: `tel:${(contactResponse.data.content?.phone || "+852 3020-6719").replace(
              /\s/g,
              ""
            )}`,
          },
          {
            icon: "/email-icon.png",
            alt: t("contact.email"),
            text: contactResponse.data.content?.email || "leego.scaffolding@gmail.com",
            link: `mailto:${contactResponse.data.content?.email || "leego.scaffolding@gmail.com"}`,
          },
          {
            icon: "/fb-icon.png",
            alt: t("contact.facebook"),
            text: contactResponse.data.content?.facebook || "https://www.facebook.com/MasterHongScaffolding/",
            link: contactResponse.data.content?.facebook || "https://www.facebook.com/MasterHongScaffolding/",
          },
        ];
        setContactInfo(contacts);
        setContactBaseInfo(contactBaseInfo);
      }

      // Fetch quote price info
      const quoteResponse = await QuotePriceService.getContactInfo();
      if (quoteResponse.success && quoteResponse.data) {
        // Currently not used, but can be set to state if needed
        setQuotePricing({
          title: quoteResponse.data.title || "",
          subtitle: quoteResponse.data.subtitle || "",
          content: quoteResponse.data.content,
        });
      }

      // Fetch banners
      const bannerResponse = await BannerService.getBannerInfo();
      if (bannerResponse.success && bannerResponse.data) {
        setBanners(bannerResponse.data?.images || []);
      }

      // Fetch about company
      const aboutCompanyResponse = await AboutCompanyService.getAboutInfo();
      if (aboutCompanyResponse.success && aboutCompanyResponse.data) {
        const data = aboutCompanyResponse.data as {
          title?: string;
          subtitle?: string;
          content?: string;
          images?: {
            section1?: string[];
            section2?: string[];
            section3?: string[];
          };
        };
        setAboutCompanyInfo({
          title: data.title || t("about.title"),
          subtitle: data.subtitle || t("about.subtitle"),
          content: data.content || t("about.description"),
          images: data.images || {
            section1: [],
            section2: [],
            section3: [],
          },
        });
      }

      const companyInfoResponse = await CompanyInfoService.getCompanyInfo();
      if (companyInfoResponse.success && companyInfoResponse.data) {
        setCompanyInfo(companyInfoResponse.data as typeof companyInfo);
      }

      // Fetch carousel items
      const carouselResponse = await CarouselService.getCarouselItems();
      if (carouselResponse.success && carouselResponse.data) {
        const items: CarouselItemType[] = (carouselResponse.data.items || []).map(
          (item) => ({
            type: item.type,
            src: item.url,
            alt: item.alt || item.title || "Carousel item",
          })
        );
        setCarouselItems(items);
      }
    } catch (error) {
      console.error("Error fetching data:", error);

      // Fallback to hardcoded data if API fails
      const fallbackContacts: ContactInfoType[] = [
        {
          icon: "/whatsapp-icon.png",
          alt: t("contact.whatsapp"),
          text: "+852 6806-0108",
          link: "https://wa.me/85268060108",
        },
        {
          icon: "/print-icon.png",
          alt: t("contact.phone"),
          text: "+852 3020-6719",
          link: "tel:+85230206719",
        },
        {
          icon: "/email-icon.png",
          alt: t("contact.email"),
          text: "leego.scaffolding@gmail.com",
          link: "mailto:leego.scaffolding@gmail.com",
        },
        {
          icon: "/fb-icon.png",
          alt: t("contact.facebook"),
          text: "https://www.facebook.com/MasterHongScaffolding/",
          link: "https://www.facebook.com/MasterHongScaffolding/",
        },
      ];
      setContactInfo(fallbackContacts);

      const fallbackCarousel: CarouselItemType[] = [
        {
          type: "image",
          src: "/banner-1.jpeg",
          alt: "Scaffolding work 1",
        },
        {
          type: "image",
          src: "/banner-2.jpeg",
          alt: "Scaffolding work 2",
        },
      ];
      setCarouselItems(fallbackCarousel);
    } finally {
      setLoading(false);
    }
  }, [locale, t]);

  // Fetch data from API on component mount and when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {banners.length > 0 &&
              banners.map((banner: string, index: number) => (
                <div key={index} className="flex justify-center">
                  <Image
                    src={banner}
                    alt={banner + "-" + index}
                    width={350}
                    height={400}
                    className="rounded-lg shadow-xl w-full h-auto object-cover max-w-xs"
                    priority
                  />
                </div>
              ))}
          </div>
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
            {aboutCompanyInfo &&
              aboutCompanyInfo?.images?.section1.map((src, index) => (
                <div key={index} className="text-center">
                  <div className="relative">
                    <Image
                      src={src}
                      alt={t("about.companyImage1Alt")}
                      width={300}
                      height={200}
                      className="w-full h-auto object-cover max-w-sm mx-auto"
                    />
                  </div>
                </div>
              ))}
          </div>

          {/* Company Description Text */}
          <div className="text-center">
            <p className="text-lg text-black leading-relaxed max-w-5xl mx-auto">
              {aboutCompanyInfo.content || t("about.description")}
            </p>
          </div>
        </div>
      </section>

      {/* Company Logos Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
            {aboutCompanyInfo &&
              aboutCompanyInfo.images?.section2?.map((src, idx) => (
                <div
                  key={idx}
                  className="w-32 h-32 flex items-center justify-center"
                >
                  <Image
                    src={src}
                    alt={src + "-" + (idx + 1)}
                    width={200}
                    height={200}
                    className="object-contain w-full h-full"
                    loading="lazy"
                  />
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Carousel Section */}
      {aboutCompanyInfo && aboutCompanyInfo.images?.section3 && (
        <section id="video" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Carousel
              items={aboutCompanyInfo && aboutCompanyInfo.images?.section3}
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
