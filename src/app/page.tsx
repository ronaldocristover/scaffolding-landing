import dynamic from 'next/dynamic';
import AboutCompanyService from "@/services/about-company-service";
import BannerService from "@/services/banner-service";
import ContactService from "@/services/contact-service";
import CompanyInfoService from "@/services/company-info.service";
import QuotePriceService, {
  QuotePricingInfo,
} from "@/services/quote-price-service";
import HomeContent, {
  AboutCompanyInfo,
  CompanyInfo,
  ContactBaseInfo,
} from "@/components/HomeContent";
import {
  getApiContent,
  createContactInfo,
  type ContactInfoType,
} from "@/lib/utils";

// Dynamically import PricingSection - already lazy loaded in HomeContent
// This page component is now very lightweight as HomeContent handles the heavy lifting

type ImageItem =
  | string
  | { src?: string; url?: string; alt?: string; type?: string };

export default async function Home() {
  // Parallel fetching of all required data
  const [
    contactResponse,
    quoteResponse,
    bannerResponse,
    aboutCompanyResponse,
    companyInfoResponse,
  ] = await Promise.all([
    ContactService.getContactInfo(),
    QuotePriceService.getContactInfo(),
    BannerService.getBannerInfo(),
    AboutCompanyService.getAboutInfo(),
    CompanyInfoService.getCompanyInfo(),
  ]);

  // Process Contact Info
  const contactData = getApiContent(contactResponse);
  const contactBaseInfo: ContactBaseInfo = {
    title: contactData?.title || "聯絡我們",
    subtitle: contactData?.subtitle || "隨時為您提供專業服務",
  };
  const contactInfo: ContactInfoType[] = createContactInfo(
    contactData?.content,
    {
      whatsapp: "WhatsApp",
      phone: "電話",
      email: "電郵",
      facebook: "Facebook",
    },
  );

  // Process Quote/Pricing Info
  const quoteData = getApiContent<QuotePricingInfo>(quoteResponse);
  const quotePricing: QuotePricingInfo = {
    title: quoteData?.title || "",
    subtitle: quoteData?.subtitle || "",
    content: quoteData?.content || [],
  };

  // Process Banners
  const bannerData = getApiContent<{ images?: string[] }>(bannerResponse);
  const banners: string[] = bannerData?.images || [];

  // Process About Company Info
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

  const aboutCompanyInfo: AboutCompanyInfo = {
    title: aboutData?.title || "關於我們",
    subtitle: aboutData?.subtitle || "超過20年的專業搭棚經驗",
    content: aboutData?.content || "康師傅搭棚公司擁有超過20年的專業搭棚經驗",
    images: {
      section1: aboutData?.images?.section1 || [],
      section2: aboutData?.images?.section2 || [],
      section3: aboutData?.images?.section3 || [],
    },
  };

  // Process Company Info
  const companyData = getApiContent<CompanyInfo>(companyInfoResponse);
  const companyInfo: CompanyInfo = companyData || {
    logo: "",
    name: "",
    title: "",
    subtitle: "",
    phone: "",
    footer: "",
    email: "",
    whatsapp: "",
  };

  return (
    <HomeContent
      banners={banners}
      aboutCompanyInfo={aboutCompanyInfo}
      companyInfo={companyInfo}
      contactInfo={contactInfo}
      contactBaseInfo={contactBaseInfo}
      quotePricing={quotePricing}
    />
  );
}
