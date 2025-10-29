import { apiCall, ApiResponse } from "@/lib/api";
import { mockContactInfo } from "@/lib/mock-data";

// Types for quote price endpoints
export interface QuotePricingInfo {
  title: string;
  subtitle: string;
  content: Record<string, unknown>[]; // Array of pricing items
}

// Mock implementation for price endpoints
export class QuotePriceService {
  // Check if we should use mock data (when API is not available)
  private static useMock =
    !process.env.NEXT_PUBLIC_API_URL || process.env.NODE_ENV === "development";

  static async getContactInfo() {
    return apiCall<QuotePricingInfo>("GET", "/quote-price");
  }
}

export default QuotePriceService;
