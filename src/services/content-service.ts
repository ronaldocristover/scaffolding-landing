import { apiCall, ApiResponse } from "@/lib/api";
import { mockContent } from "@/lib/mock-data";

// Types for content endpoints
export interface HeroContent {
  title: string;
  subtitle: string;
  ctaText: string;
  backgroundImage: string;
}

export interface AboutContent {
  title: string;
  description: string;
  stats: Array<{
    label: string;
    value: string;
  }>;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

export interface WebsiteContent {
  hero: HeroContent;
  about: AboutContent;
  services: Service[];
}

export interface ContentUpdateRequest extends Record<string, unknown> {
  section: "hero" | "about" | "services";
  locale: string;
  content: Record<string, unknown>;
}

// Mock implementation for content endpoints
export class ContentService {
  // Check if we should use mock data (when API is not available)
  private static useMock = false;

  /**
   * Get website content
   * GET /api/content?locale=en|zh
   */
  static async getContent(
    locale: string = "en"
  ): Promise<ApiResponse<WebsiteContent>> {
    if (this.useMock) {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Return localized content based on locale
      const localizedContent = {
        ...mockContent,
        hero: {
          ...mockContent.hero,
          title: locale === "zh" ? "專業棚架服務" : mockContent.hero.title,
          subtitle:
            locale === "zh"
              ? "在香港擁有20多年經驗"
              : mockContent.hero.subtitle,
          ctaText: locale === "zh" ? "免費報價" : mockContent.hero.ctaText,
        },
        about: {
          ...mockContent.about,
          title: locale === "zh" ? "關於香港棚架大師" : mockContent.about.title,
          description:
            locale === "zh"
              ? "專業棚架服務，在香港建築業擁有超過20年經驗。我們為住宅、商業和工業項目提供安全、可靠和高效的棚架解決方案。"
              : mockContent.about.description,
        },
        services: mockContent.services.map((service) => ({
          ...service,
          title:
            locale === "zh"
              ? service.id === "residential"
                ? "住宅棚架"
                : service.id === "commercial"
                ? "商業棚架"
                : "工業棚架"
              : service.title,
          description:
            locale === "zh"
              ? service.id === "residential"
                ? "為住宅和公寓提供安全棚架"
                : service.id === "commercial"
                ? "為商業建築提供重型棚架"
                : "為工業設施提供專業棚架"
              : service.description,
        })),
      };

      return {
        success: true,
        data: localizedContent,
        meta: {
          timestamp: new Date().toISOString(),
        },
      };
    }

    return apiCall<WebsiteContent>("GET", `/content?locale=${locale}`);
  }

  /**
   * Update website content (Admin only)
   * PUT /api/content
   */
  static async updateContent(
    updateData: ContentUpdateRequest
  ): Promise<
    ApiResponse<{ message: string; section: string; locale: string }>
  > {
    if (this.useMock) {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return {
        success: true,
        data: {
          message: "Content updated successfully",
          section: updateData.section,
          locale: updateData.locale,
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      };
    }

    return apiCall<{ message: string; section: string; locale: string }>(
      "PUT",
      "/content",
      updateData
    );
  }

  /**
   * Get services catalog
   * GET /api/services
   */
  static async getServices(): Promise<ApiResponse<{ services: Service[] }>> {
    if (this.useMock) {
      await new Promise((resolve) => setTimeout(resolve, 200));

      return {
        success: true,
        data: {
          services: mockContent.services,
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      };
    }

    return apiCall<{ services: Service[] }>("GET", "/services");
  }

  /**
   * Validate content update data
   */
  static validateContentUpdate(updateData: Partial<ContentUpdateRequest>): {
    isValid: boolean;
    errors: Record<string, string>;
  } {
    const errors: Record<string, string> = {};

    if (!updateData.section) {
      errors.section = "Section is required";
    }

    if (!updateData.locale || !["en", "zh"].includes(updateData.locale)) {
      errors.locale = 'Locale must be either "en" or "zh"';
    }

    if (!updateData.content || Object.keys(updateData.content).length === 0) {
      errors.content = "Content data is required";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}

export default ContentService;
