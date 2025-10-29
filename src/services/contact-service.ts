import { apiCall, ApiResponse } from "@/lib/api";
import { mockContactInfo } from "@/lib/mock-data";

// Types for contact endpoints

export interface ContactInfoContent {
  whatsapp: string;
  phone: string;
  email: string;
  facebook: string;
}
export interface ContactInfo {
  title: string;
  subtitle: string;
  content: ContactInfoContent;
}

export interface ContactFormRequest {
  name: string;
  company?: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  projectType: "residential" | "commercial" | "industrial";
  location: string;
  urgency: "normal" | "urgent";
  attachments?: string[]; // Array of uploaded file URLs
  [key: string]: unknown;
}

export interface ContactFormResponse {
  id: string;
  status: string;
  estimatedResponse: string;
  followUpDate: string;
}

// Mock implementation for contact endpoints
export class ContactService {
  // Check if we should use mock data (when API is not available)
  private static useMock =
    !process.env.NEXT_PUBLIC_API_URL || process.env.NODE_ENV === "development";

  /**
   * Get contact information
   * GET /api/contact-info
   */
  static async getContactInfo(): Promise<ApiResponse<ContactInfo>> {
    return apiCall<ContactInfo>("GET", "/contact-us");
  }

  /**
   * Submit contact form
   * POST /api/contact-form
   */
  static async submitContactForm(
    formData: ContactFormRequest
  ): Promise<ApiResponse<ContactFormResponse>> {
    if (this.useMock) {
      // Simulate API delay and processing
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Generate mock response
      const mockResponse: ContactFormResponse = {
        id: `contact_${Date.now()}`,
        status: "received",
        estimatedResponse: "2-4 hours",
        followUpDate: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
      };

      
      return {
        success: true,
        data: mockResponse,
        meta: {
          timestamp: new Date().toISOString(),
        },
      };
    }

    return apiCall<ContactFormResponse>("POST", "/contact-form", formData);
  }

  /**
   * Validate contact form data
   */
  static validateContactForm(formData: Partial<ContactFormRequest>): {
    isValid: boolean;
    errors: Record<string, string>;
  } {
    const errors: Record<string, string> = {};

    if (!formData.name || formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters long";
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.phone || !/^[+]?[\d\s\-\(\)]+$/.test(formData.phone)) {
      errors.phone = "Please enter a valid phone number";
    }

    if (!formData.message || formData.message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters long";
    }

    if (!formData.projectType) {
      errors.projectType = "Please select a project type";
    }

    if (!formData.location || formData.location.trim().length < 2) {
      errors.location = "Please enter a valid location";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}

export default ContactService;
