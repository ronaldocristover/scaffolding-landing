import Image from "next/image";
import Header from "@/components/Header";
import ContactInfo from "@/components/ContactInfo";
import FloatingButtons from "@/components/FloatingButtons";
import {getTranslations} from 'next-intl/server';
import {setRequestLocale} from 'next-intl/server';

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

type Props = {
  params: Promise<{locale: string}>;
};

export default async function Home({params}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const quotePrice: QuoteStep[] = [
    {
      title: t('pricing.step1.title'),
      content: t('pricing.step1.content'),
    },
    {
      title: t('pricing.step2.title'),
      content: t('pricing.step2.content'),
    },
    {
      title: t('pricing.step3.title'),
      content: t('pricing.step3.content'),
    },
    {
      title: t('pricing.step4.title'),
      content: t('pricing.step4.content'),
    },
    {
      title: t('pricing.step5.title'),
      content: t('pricing.step5.content'),
    },
    {
      title: t('pricing.step6.title'),
      content: t('pricing.step6.content'),
    },
  ];

  const companyLogos: string[] = [
    "/company-logo-1.png",
    "/company-logo-2.png",
    "/company-logo-3.png",
    "/company-logo-1.png",
  ];

  const contactInfo: ContactInfoType[] = [
    {
      icon: "/whatsapp-icon.png",
      alt: t('contact.whatsapp'),
      text: "+852 6806-0108",
      link: "https://wa.me/85268060108",
    },
    {
      icon: "/print-icon.png",
      alt: t('contact.phone'),
      text: "+852 3020-6719",
      link: "tel:+85230206719",
    },
    {
      icon: "/email-icon.png",
      alt: t('contact.email'),
      text: "leego.scaffolding@gmail.com",
      link: "mailto:leego.scaffolding@gmail.com",
    },
    {
      icon: "/fb-icon.png",
      alt: t('contact.facebook'),
      text: "https://www.facebook.com/MasterHongScaffolding/",
      link: "https://www.facebook.com/MasterHongScaffolding/",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header phoneNumber="+852 6806-0108" />

      {/* Hero Section */}
      <section
        id="home"
        className="bg-[#C0FF4B] py-20 lg:py-32"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Column - Image */}
            <div className="flex justify-center">
              <Image
                src="/certificate.jpeg"
                alt={t('hero.certificateAlt1')}
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
                alt={t('hero.certificateAlt2')}
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
              {t('about.title')}
            </h2>
            <p className="text-lg text-gray-800 mb-4">{t('about.subtitle')}</p>
          </div>

          {/* Company Images */}
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            {/* Company Image 1 */}
            <div className="text-center">
              <div className="relative">
                <Image
                  src="/company-1.png"
                  alt={t('about.companyImage1Alt')}
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
                  alt={t('about.companyImage2Alt')}
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
              {t('about.description')}
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
                  alt={`${t('companyLogos.alt')} ${idx + 1}`}
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

      {/* Video Section */}
      <section id="video" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title={t('video.title')}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-[#C0FF4B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-viga text-3xl md:text-4xl text-black mb-4">
              {t('pricing.title')}
            </h2>
            <p className="text-lg text-black text-3xl mb-4">{t('pricing.subtitle')}</p>
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
          <p>
            {t('footer.copyright')}
          </p>
        </div>
      </footer>

      <FloatingButtons
        email="leego.scaffolding@gmail.com"
        whatsapp="https://wa.me/85268060108"
      />
    </div>
  );
}