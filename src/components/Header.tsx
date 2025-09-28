import Image from "next/image";

interface HeaderProps {
  phoneNumber: string;
}

export default function Header({ phoneNumber }: HeaderProps) {
  const menuItems = [
    { href: "#about", label: "公司簡介" },
    { href: "#pricing", label: "報價流程" },
    { href: "#contact", label: "聯絡我們" },
  ];

  return (
    <>
      {/* Top Contact Bar */}
      <div className="bg-[#737365] text-center py-1">
        <span className="text-[#F7EA87]">
          立即WhatsApp：{phoneNumber}
          <Image
            src="/whatsapp-icon.png"
            alt="WhatsApp"
            width={20}
            height={20}
            className="inline-block align-middle mx-2 mb-1"
            priority
          />
        </span>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-gradient-to-b from-[#FFFBB5] to-[#E0B700] backdrop-blur-md">
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
                  priority
                />
              </div>
              <span className="font-viga text-xl text-gray-900">
                利高棚業工程有限公司｜康師傅搭棚公司
                <br /> Scaffolding Engineering Limited
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              {menuItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-gray-700">
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
    </>
  );
}