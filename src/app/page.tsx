import Image from "next/image";
import Header from "@/components/Header";
import ContactInfo from "@/components/ContactInfo";
import FloatingButtons from "@/components/FloatingButtons";

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

export default function Home() {
  const quotePrice: QuoteStep[] = [
    {
      title: "步驟 1｜初步咨詢",
      content:
        "WhatsApp 或電郵報價，請提供以下資料：1. 客戶/公司名稱 2. 施工地點 3. 施工點照片 4. 棚架用途",
    },
    {
      title: "步驟 2｜實地考察",
      content:
        "安排專業師傅到現場進行實地考察，評估工程難度、安全要求及施工環境，確保報價準確",
    },
    {
      title: "步驟 3｜詳細報價",
      content:
        "根據實地考察結果，提供詳細的工程報價單，包括材料費、人工費、運輸費及相關安全措施費用",
    },
    {
      title: "步驟 4｜合約簽署",
      content:
        "雙方確認報價後簽署正式合約，明確工程範圍、完工時間、付款方式及安全責任條款",
    },
    {
      title: "步驟 5｜工程施工",
      content:
        "由資深師傅帶領專業團隊進行施工，嚴格按照安全規範執行，定期檢查棚架穩固性及安全性",
    },
    {
      title: "步驟 6｜完工驗收",
      content:
        "工程完成後進行全面檢查驗收，確保棚架符合安全標準，提供使用指引及定期維護建議",
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
      alt: "WhatsApp",
      text: "+852 6806-0108",
      link: "https://wa.me/85268060108",
    },
    {
      icon: "/print-icon.png",
      alt: "Phone",
      text: "+852 3020-6719",
      link: "tel:+85230206719",
    },
    {
      icon: "/email-icon.png",
      alt: "Email",
      text: "leego.scaffolding@gmail.com",
      link: "mailto:leego.scaffolding@gmail.com",
    },
    {
      icon: "/fb-icon.png",
      alt: "Facebook",
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
                alt="Certificate of Appreciation"
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
                alt="Certificate of Excellence"
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
              About Our Company
            </h2>
            <p className="text-lg text-gray-800 mb-4">公司簡介</p>
          </div>

          {/* Company Images */}
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            {/* Company Image 1 */}
            <div className="text-center">
              <div className="relative">
                <Image
                  src="/company-1.png"
                  alt="Company 1"
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
                  alt="Company Image"
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
              康師傅搭棚工程 隸屬
              利高棚業工程有限公司其下一品牌，專責處理小型工程，行內又稱為「濕碎」。我們憑著廿多年的搭棚經驗，以專業團隊和工作流程，致力服務業主和中小企各類的棚架工程。由多位廿年資深搭棚師傅監工，以確保棚架安全、實用、省的時；工程和團隊亦已獲得政府認可之專業資格、牌照和保險，定期會配合嚴格的安全評核和訓練。每個工程完成後，更會定期安排督導員檢驗棚架，以確保安全。我們專業快捷、安全可靠、公道取價。
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
                  alt={`Company Logo ${idx + 1}`}
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
                title="Company Introduction Video"
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
              Quote Process
            </h2>
            <p className="text-lg text-black text-3xl mb-4">報價流程</p>
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
            MASTER HONG SCAFFOLDING WORKS &copy; Copyright 2025. All Rights
            Reserved.
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