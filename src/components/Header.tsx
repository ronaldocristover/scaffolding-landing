"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";

interface HeaderProps {
  phoneNumber?: string;
  companyInfo?: {
    logo?: string;
    title?: string;
    subtitle?: string;
    name?: string;
    phone?: string;
  };
}

export default function Header({ companyInfo, phoneNumber }: HeaderProps) {
  const t = useTranslations("nav");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Add null checks to prevent runtime errors
  if (!companyInfo) {
    return null;
  }

  const menuItems = [
    { href: "#about", label: t("about") },
    { href: "#pricing", label: t("pricing") },
    { href: "#contact", label: t("contact") },
  ];

  return (
    <>
      {/* Top Contact Bar */}
      <div className="bg-[#737365] text-center py-1 px-2">
        <span className="text-[#F7EA87] text-xs sm:text-sm">
          <span className="hidden sm:inline">立即WhatsApp：</span>
          <span className="sm:hidden">WhatsApp：</span>
          {phoneNumber || companyInfo?.phone || ""}
          <Image
            src="/whatsapp-icon.png"
            alt="WhatsApp"
            width={20}
            height={20}
            className="inline-block align-middle mx-1 sm:mx-2 mb-1"
            priority
          />
        </span>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-gradient-to-b from-[#FFFBB5] to-[#E0B700] backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Company Name */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center overflow-hidden rounded-lg bg-transparent">
                <Image
                  src={companyInfo?.logo || "/logo.png"}
                  alt={companyInfo?.name || "Scaffolding Engineering Limited"}
                  width={100}
                  height={100}
                  className="rounded-lg object-cover w-full h-full"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-sans font-bold text-sm sm:text-lg md:text-xl text-gray-900 leading-tight tracking-tight">
                  {companyInfo?.title || "利高棚業工程有限公司｜康師傅搭棚公司"}
                </span>
                <span className="font-sans font-semibold text-xs sm:text-sm md:text-base text-gray-700 leading-tight tracking-wide">
                  {companyInfo?.name || "Scaffolding Engineering Limited"}
                </span>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {menuItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="font-sans font-medium text-gray-700 hover:text-blue-600 transition-colors text-sm tracking-wide"
                >
                  {item.label}
                </a>
              ))}
              {/* <LanguageSwitcher /> */}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-700 hover:text-gray-900 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-gray-200 bg-gradient-to-b from-[#FFFBB5] to-[#E0B700] ${isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div
            className={`px-4 py-3 space-y-3 transform transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "translate-y-0" : "-translate-y-4"
              }`}
          >
            {menuItems.map((item, index) => (
              <a
                key={item.href}
                href={item.href}
                className={`block font-sans font-medium text-gray-700 hover:text-blue-600 transition-all duration-300 py-2 text-sm tracking-wide transform ${isMobileMenuOpen
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-4 opacity-0"
                  }`}
                style={{
                  transitionDelay: isMobileMenuOpen ? `${index * 50}ms` : "0ms",
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div
              className={`pt-2 border-t border-gray-200/50 transform transition-all duration-300 ${isMobileMenuOpen
                ? "translate-x-0 opacity-100"
                : "-translate-x-4 opacity-0"
                }`}
              style={{
                transitionDelay: isMobileMenuOpen
                  ? `${menuItems.length * 50}ms`
                  : "0ms",
              }}
            >
              {/* <LanguageSwitcher /> */}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
