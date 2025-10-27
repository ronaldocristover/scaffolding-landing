import { apiCall, ApiResponse } from "@/lib/api";
import { mockContactInfo } from "@/lib/mock-data";

// Mock implementation for price endpoints
export class QuotaPriceService {
  // Check if we should use mock data (when API is not available)
  private static useMock =
    !process.env.NEXT_PUBLIC_API_URL || process.env.NODE_ENV === "development";

  static async getContactInfo() {
    return apiCall("GET", "/quote-price");
  }
}

export default QuotaPriceService;
