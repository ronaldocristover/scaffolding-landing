import Image from "next/image";

export default function Home() {
  const quotePrice = [
    {
      title: "步驟 1｜報價咨詢",
      content:
        "Whatsapp 或 電郵報價，請提供以下資料： 1. 客戶/公司名稱  2. 施工地點  3. 施工點照片  4. 棚架用途",
    },
    {
      title: "步驟 2 報價咨詢",
      content:
        "Whatsapp 或 電郵報價，請提供以下資料： 1. 客戶/公司名稱  2. 施工地點  3. 施工點照片  4. 棚架用途",
    },
    {
      title: "步驟 3｜報價咨詢",
      content:
        "Whatsapp 或 電郵報價，請提供以下資料： 1. 客戶/公司名稱  2. 施工地點  3. 施工點照片  4. 棚架用途",
    },
    {
      title: "步驟 4｜報價咨詢",
      content:
        "Whatsapp 或 電郵報價，請提供以下資料： 1. 客戶/公司名稱  2. 施工地點  3. 施工點照片  4. 棚架用途",
    },
    {
      title: "步驟 5｜報價咨詢",
      content:
        "Whatsapp 或 電郵報價，請提供以下資料： 1. 客戶/公司名稱  2. 施工地點  3. 施工點照片  4. 棚架用途",
    },
    {
      title: "步驟 6｜報價咨詢",
      content:
        "Whatsapp 或 電郵報價，請提供以下資料： 1. 客戶/公司名稱  2. 施工地點  3. 施工點照片  4. 棚架用途",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Sticky Navigation */}
      <div style={{ background: "#737365" }} className="text-center py-1">
        <span style={{ color: "#F7EA87" }}>
          立即WhatsApp：+852 6806-0108
          <Image
            src="/whatsapp-icon.png"
            alt="WhatsApp"
            width={20}
            height={20}
            className="inline-block align-middle mx-2 mb-1"
          />
        </span>
      </div>
      <nav
        className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700"
        style={{
          background: "linear-gradient(0deg, #FFFBB5 0%, #E0B700 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Company Name */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 flex items-center justify-center">
                <Image
                  src="/company-1.png"
                  alt="Scaffolding Engineering Limited"
                  width={100}
                  height={100}
                  className="rounded-lg"
                />
              </div>
              <span className="font-viga text-xl text-gray-900 dark:text-white">
                利高棚業工程有限公司｜康師傅搭棚公司
                <br /> Scaffolding Engineering Limited
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              <a
                href="#about"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                公司簡介
              </a>
              <a
                href="#pricing"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                報價流程
              </a>
              <a
                href="#contact"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                聯絡我們
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-gray-700 dark:text-gray-300">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Banner/Hero Section */}
      <section
        id="home"
        className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-20 lg:py-32"
        style={{ background: "#C0FF4B" }}
      >
        {" "}
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

      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
            {[
              "/company-logo-1.png",
              "/company-logo-2.png",
              "/company-logo-3.png",
              "/company-logo-1.png",
            ].map((src, idx) => (
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
                  style={{ border: "none" }}
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
            <div className="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Company Introduction Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20" style={{ background: "#C0FF4B" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-viga text-3xl md:text-4xl text-gray-900 text-black mb-4">
              Quote Price
            </h2>
            <p className="text-lg text-black text-3xl mb-4">公司簡介</p>
          </div>

          <div className="grid md:grid-cols-3">
            {quotePrice.map((item, idx) => (
              <div key={idx} className="p-8">
                <h3 className="font-viga text-2xl mb-4 text-black text-center">
                  {item.title}
                </h3>
                <div className="space-y-3 mb-8 text-black">
                  <p className={idx === 1 ? "" : "text-black"}>
                    {item.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact US Section */}
      <section id="contact-us" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-viga text-3xl md:text-4xl text-black mb-2">
            Contact Us
          </h2>
          <p className="text-lg text-black text-3xl mb-12">聯絡我們</p>
          <p className="text-lg text-black mb-12">
            <span className="pr-5">
              <Image
                src="/whatsapp-icon.png"
                alt="WhatsApp"
                width={24}
                height={24}
                className="inline-block align-middle mr-2"
              />
              +852 6806-0108
            </span>
            <span className="pr-5">
              <Image
                src="/print-icon.png"
                alt="Print"
                width={24}
                height={24}
                className="inline-block align-middle mr-2"
              />
              +852 3020-6719
            </span>
            <span className="pr-5">
              <Image
                src="/email-icon.png"
                alt="Print"
                width={24}
                height={24}
                className="inline-block align-middle mr-2"
              />
              leego.scaffolding@gmail.com
            </span>{" "}
            <br />
            <span>
              <Image
                src="/fb-icon.png"
                alt="Print"
                width={24}
                height={24}
                className="inline-block align-middle mr-2"
              />
              https://www.facebook.com/MasterHongScaffolding/
            </span>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="contact"
        className="bg-gray-900 text-white"
        style={{
          background: "linear-gradient(0deg, #FFFBB5 0%, #E0B700 100%)",
        }}
      >
        <div className="border-gray-800 mt-12 pt-8 pb-8 text-center text-black">
          <p>
            MASTER HONG SCAFFOLDING WORKS &copy; Copyright 2025. All Rights
            Reserved.
          </p>
        </div>
      </footer>

      {/* Floating WhatsApp and Email Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-3 z-50">
        <a
          href="mailto:hello@company.com"
          className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110"
          title="Send Email"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
          </svg>
        </a>
        <a
          href="https://wa.me/1234567890"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110"
          title="Chat on WhatsApp"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
          </svg>
        </a>
      </div>
    </div>
  );
}
