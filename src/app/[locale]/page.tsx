import { getTranslations } from "next-intl/server";
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

type Props = {
  params: Promise<{ locale: string }>;
};

type ImageItem =
  | string
  | { src?: string; url?: string; alt?: string; type?: string };

export default async function Home({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

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
    title: contactData?.title || t("contact.title"),
    subtitle: contactData?.subtitle || t("contact.subtitle"),
  };
  const contactInfo: ContactInfoType[] = createContactInfo(
    contactData?.content,
    {
      whatsapp: t("contact.whatsapp"),
      phone: t("contact.phone"),
      email: t("contact.email"),
      facebook: t("contact.facebook"),
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
    title: aboutData?.title || t("about.title"),
    subtitle: aboutData?.subtitle || t("about.subtitle"),
    content: aboutData?.content || t("about.description"),
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
