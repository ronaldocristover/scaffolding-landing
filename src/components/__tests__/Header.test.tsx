import React from "react";
import { render, screen } from "@testing-library/react";
import Header from "@/components/Header";
import type { CompanyInfo } from "@/components/HomeContent";

describe("Header Component", () => {
  const mockCompanyInfo: CompanyInfo = {
    logo: "/logo.png",
    name: "Leego Scaffolding",
    title: "Professional Scaffolding Services",
    subtitle: "Quality You Can Trust",
    phone: "+852 1234 5678",
    footer: "© 2024 Leego Scaffolding",
    email: "test@example.com",
    whatsapp: "+852 9876 5432",
  };

  it("should render company name", () => {
    render(<Header companyInfo={mockCompanyInfo} phoneNumber={mockCompanyInfo.phone} />);

    expect(screen.getByText("Leego Scaffolding")).toBeInTheDocument();
  });

  it("should render navigation links", () => {
    render(<Header companyInfo={mockCompanyInfo} phoneNumber={mockCompanyInfo.phone} />);

    // Check for navigation links - there are multiple links with the same text (desktop + mobile)
    const aboutLinks = screen.getAllByRole("link", { name: "關於我們" });
    const pricingLinks = screen.getAllByRole("link", { name: "報價" });
    const contactLinks = screen.getAllByRole("link", { name: "聯絡我們" });

    expect(aboutLinks.length).toBeGreaterThan(0);
    expect(pricingLinks.length).toBeGreaterThan(0);
    expect(contactLinks.length).toBeGreaterThan(0);
  });

  it("should render navigation", () => {
    render(<Header companyInfo={mockCompanyInfo} phoneNumber={mockCompanyInfo.phone} />);

    // Check for navigation element
    const nav = screen.getByRole("navigation");
    expect(nav).toBeInTheDocument();
  });

  it("should handle empty company info", () => {
    const emptyInfo: CompanyInfo = {
      logo: "",
      name: "",
      title: "",
      subtitle: "",
      phone: "",
      footer: "",
      email: "",
      whatsapp: "",
    };

    render(<Header companyInfo={emptyInfo} phoneNumber="" />);

    // Should still render without crashing
    const nav = screen.getByRole("navigation");
    expect(nav).toBeInTheDocument();
  });
});
