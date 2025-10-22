"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import ContactInfo from "@/components/ContactInfo";
import FloatingButtons from "@/components/FloatingButtons";
import Carousel from "@/components/Carousel";
import ContactService from "@/services/contact-service";
import ContentService from "@/services/content-service";
import CarouselService from "@/services/carousel-service";
import { useTranslations } from "next-intl";

interface QuoteStep {
  title: string;
  content: string;
}

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
  const [locale, setLocale] = useState<string>('en');
  const t = useTranslations();

  // Handle async params
  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setLocale(resolvedParams.locale);
    };
    getParams();
  }, [params]);

  const [contactInfo, setContactInfo] = useState<ContactInfoType[]>([]);
  const [carouselItems, setCarouselItems] = useState<CarouselItemType[]>([]);
  const [loading, setLoading] = useState(true);

  const quotePrice: QuoteStep[] = [
    {
      title: t("pricing.step1.title"),
      content: t("pricing.step1.content"),
    },
    {
      title: t("pricing.step2.title"),
      content: t("pricing.step2.content"),
    },
    {
      title: t("pricing.step3.title"),
      content: t("pricing.step3.content"),
    },
    {
      title: t("pricing.step4.title"),
      content: t("pricing.step4.content"),
    },
    {
      title: t("pricing.step5.title"),
      content: t("pricing.step5.content"),
    },
    {
      title: t("pricing.step6.title"),
      content: t("pricing.step6.content"),
    },
  ];

  const companyLogos: string[] = [
    "/company-logo-1.png",
    "/company-logo-2.png",
    "/company-logo-3.png",
    "/company-logo-1.png",
  ];

  // Fetch data from API on component mount and when locale changes
  useEffect(() => {
    if (locale === 'en') return; // Don't fetch until locale is set

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch contact info
        const contactResponse = await ContactService.getContactInfo();
        if (contactResponse.success && contactResponse.data) {
          const contacts: ContactInfoType[] = [
            {
              icon: "/whatsapp-icon.png",
              alt: t("contact.whatsapp"),
              text: contactResponse.data.whatsapp.number,
              link: contactResponse.data.whatsapp.link,
            },
            {
              icon: "/print-icon.png",
              alt: t("contact.phone"),
              text: contactResponse.data.phone.main,
              link: `tel:${contactResponse.data.phone.main.replace(/\s/g, '')}`,
            },
            {
              icon: "/email-icon.png",
              alt: t("contact.email"),
              text: contactResponse.data.email.address,
              link: `mailto:${contactResponse.data.email.address}`,
            },
            {
              icon: "/fb-icon.png",
              alt: t("contact.facebook"),
              text: contactResponse.data.facebook.url,
              link: contactResponse.data.facebook.url,
            },
          ];
          setContactInfo(contacts);
        }

        // Fetch carousel items
        const carouselResponse = await CarouselService.getCarouselItems();
        if (carouselResponse.success && carouselResponse.data) {
          const items: CarouselItemType[] = carouselResponse.data.items.map(item => ({
            type: item.type,
            src: item.url,
            alt: item.alt || item.title,
          }));
          setCarouselItems(items);
        }
      } catch (error) {
        console.error('Error fetching data:', error);

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
    };

    fetchData();
  }, [locale]);

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
      <Header phoneNumber={contactInfo[0]?.text || "+852 6806-0108"} />

      {/* Hero Section */}
      <section id="home" className="bg-[#C0FF4B] py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Column - Image */}
            <div className="flex justify-center">
              <Image
                src="/certificate.jpeg"
                alt={t("hero.certificateAlt1")}
                width={350}
                height={400}
                className="rounded-lg shadow-xl w-full h-auto object-cover max-w-xs"
                priority
              />
            </div>
            {/* Right Column - Image */}
            <div className="flex justify-center">
              <Image
                src="/certificate.jpeg"
                alt={t("hero.certificateAlt2")}
                width={350}
                height={400}
                className="rounded-lg shadow-xl w-full h-auto object-cover max-w-xs"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Company Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Centered About Our Company Title */}
          <div className="text-center mb-16">
            <h2 className="font-viga text-3xl md:text-4xl text-black mb-2">
              {t("about.title")}
            </h2>
            <p className="text-lg text-gray-800 mb-4">{t("about.subtitle")}</p>
          </div>

          {/* Company Images */}
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            {/* Company Image 1 */}
            <div className="text-center">
              <div className="relative">
                <Image
                  src="/company-1.png"
                  alt={t("about.companyImage1Alt")}
                  width={300}
                  height={200}
                  className="w-full h-auto object-cover max-w-sm mx-auto"
                />
              </div>
            </div>

            {/* Company Image 2 */}
            <div className="text-center">
              <div className="relative">
                <Image
                  src="/company-2.png"
                  alt={t("about.companyImage2Alt")}
                  width={300}
                  height={200}
                  className="w-full h-auto object-cover max-w-sm mx-auto"
                />
              </div>
            </div>
          </div>

          {/* Company Description Text */}
          <div className="text-center">
            <p className="text-lg text-black leading-relaxed max-w-5xl mx-auto">
              {t("about.description")}
            </p>
          </div>
        </div>
      </section>

      {/* Company Logos Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
            {companyLogos.map((src, idx) => (
              <div
                key={idx}
                className="w-32 h-32 flex items-center justify-center"
              >
                <Image
                  src={src}
                  alt={`${t("companyLogos.alt")} ${idx + 1}`}
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
      <section id="video" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Carousel items={carouselItems} autoPlay={true} interval={4000} />
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-[#C0FF4B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-viga text-3xl md:text-4xl text-black mb-4">
              {t("pricing.title")}
            </h2>
            <p className="text-lg text-black text-3xl mb-4">
              {t("pricing.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {quotePrice.map((item, idx) => (
              <div key={idx} className="p-8">
                <h3 className="font-viga text-2xl mb-4 text-black text-center">
                  {item.title}
                </h3>
                <div className="space-y-3 mb-8 text-black">
                  <p className="text-black">{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactInfo contacts={contactInfo} />

      {/* Footer */}
      <footer
        id="contact"
        className="text-white bg-gradient-to-b from-[#FFFBB5] to-[#E0B700]"
      >
        <div className="pt-8 pb-8 text-center text-black">
          <p>{t("footer.copyright")}</p>
        </div>
      </footer>

      <FloatingButtons
        email={contactInfo[2]?.text?.replace("mailto:", "") || "leego.scaffolding@gmail.com"}
        whatsapp={contactInfo[0]?.link || "https://wa.me/85268060108"}
      />
    </div>
  );
}
