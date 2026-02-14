import { ContactService } from "@/services/contact-service";
import type { ContactFormRequest } from "@/services/contact-service";

describe("ContactService", () => {
  describe("validateContactForm", () => {
    const validFormData: ContactFormRequest = {
      name: "John Doe",
      company: "Test Company",
      email: "john@example.com",
      phone: "+852 1234 5678",
      subject: "Test Subject",
      message: "This is a test message that is at least 10 characters long",
      projectType: "residential",
      location: "Hong Kong",
      urgency: "normal",
    };

    it("should validate valid contact form data", () => {
      const result = ContactService.validateContactForm(validFormData);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it("should return error for invalid name", () => {
      const invalidData = { ...validFormData, name: "J" };
      const result = ContactService.validateContactForm(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBeDefined();
    });

    it("should return error for invalid email", () => {
      const invalidData = { ...validFormData, email: "invalid-email" };
      const result = ContactService.validateContactForm(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBeDefined();
    });

    it("should return error for invalid phone", () => {
      const invalidData = { ...validFormData, phone: "abc" };
      const result = ContactService.validateContactForm(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors.phone).toBeDefined();
    });

    it("should return error for short message", () => {
      const invalidData = { ...validFormData, message: "Short" };
      const result = ContactService.validateContactForm(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors.message).toBeDefined();
    });

    it("should return error for missing project type", () => {
      const invalidData = { ...validFormData, projectType: undefined as any };
      const result = ContactService.validateContactForm(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors.projectType).toBeDefined();
    });

    it("should return error for invalid location", () => {
      const invalidData = { ...validFormData, location: "H" };
      const result = ContactService.validateContactForm(invalidData);

      expect(result.isValid).toBe(false);
      expect(result.errors.location).toBeDefined();
    });

    it("should return multiple errors for multiple invalid fields", () => {
      const invalidData = {
        ...validFormData,
        name: "J",
        email: "invalid",
        phone: "abc",
      };
      const result = ContactService.validateContactForm(invalidData);

      expect(result.isValid).toBe(false);
      expect(Object.keys(result.errors)).toHaveLength(3);
      expect(result.errors.name).toBeDefined();
      expect(result.errors.email).toBeDefined();
      expect(result.errors.phone).toBeDefined();
    });

    it("should accept form without company field (optional)", () => {
      const dataWithoutCompany = { ...validFormData, company: undefined };
      const result = ContactService.validateContactForm(dataWithoutCompany);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });
  });

  describe("submitContactForm", () => {
    it("should submit contact form in mock mode", async () => {
      const formData: ContactFormRequest = {
        name: "John Doe",
        email: "john@example.com",
        phone: "+852 1234 5678",
        subject: "Test",
        message: "Test message",
        projectType: "residential",
        location: "Hong Kong",
        urgency: "normal",
      };

      // Mock the API call
      const response = await ContactService.submitContactForm(formData);

      // In mock mode, the function should return a response
      expect(response).toBeDefined();
      expect(response.meta?.timestamp).toBeDefined();
    });
  });
});
