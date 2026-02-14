import type { ApiResponse } from "@/lib/api";

describe("API Types", () => {
  describe("ApiResponse", () => {
    it("should accept response with data property", () => {
      const response: ApiResponse<string> = {
        success: true,
        data: "test data",
      };
      expect(response.success).toBe(true);
      expect(response.data).toBe("test data");
    });

    it("should accept response with content property", () => {
      const response = {
        success: true,
        content: "test content",
      };
      expect(response.success).toBe(true);
      expect(response.content).toBe("test content");
    });

    it("should accept failure response", () => {
      const response: ApiResponse<string> = {
        success: false,
        data: null,
      };
      expect(response.success).toBe(false);
    });
  });
});
