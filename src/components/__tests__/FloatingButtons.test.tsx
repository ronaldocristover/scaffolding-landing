import React from "react";
import { render, screen } from "@testing-library/react";
import FloatingButtons from "@/components/FloatingButtons";

describe("FloatingButtons", () => {
  const defaultProps = {
    email: "test@example.com",
    whatsapp: "85212345678",
  };

  it("should render email floating button", () => {
    render(<FloatingButtons {...defaultProps} />);

    // Check for Email button
    const emailLink = screen.getByRole("link", { name: /email/i });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute("href", "mailto:test@example.com");
  });

  it("should render WhatsApp button", () => {
    render(<FloatingButtons {...defaultProps} />);

    // Check for WhatsApp button
    const whatsappLink = screen.getByRole("link", { name: /whatsapp/i });
    expect(whatsappLink).toBeInTheDocument();
    expect(whatsappLink).toHaveAttribute("href", "85212345678");
  });

  it("should render email button with mailto link", () => {
    render(<FloatingButtons {...defaultProps} />);

    const emailLink = screen.getByRole("link", { name: /email/i });
    expect(emailLink).toHaveAttribute("href", expect.stringContaining("mailto:"));
  });

  it("should display contact text", () => {
    render(<FloatingButtons {...defaultProps} />);

    // Check for contact text
    expect(screen.getByText("按此聯絡康師傅")).toBeInTheDocument();
  });

  it("should have proper accessibility attributes", () => {
    render(<FloatingButtons {...defaultProps} />);

    const emailLink = screen.getByRole("link", { name: /email/i });
    const whatsappLink = screen.getByRole("link", { name: /whatsapp/i });

    expect(emailLink).toHaveAttribute("title", "Send Email");
    expect(whatsappLink).toHaveAttribute("title", "Chat on WhatsApp");
  });

  it("should handle empty props", () => {
    render(<FloatingButtons email="" whatsapp="" />);

    // Should still render email button even with empty props
    const emailLink = screen.getByRole("link", { name: /email/i });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute("href", "mailto:");
  });
});
