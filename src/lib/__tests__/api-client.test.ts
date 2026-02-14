import { apiCall, type ApiResponse } from "@/lib/api";

// Mock the axios module at the top level
jest.mock("@/lib/api", () => {
  const originalModule = jest.requireActual<typeof import("@/lib/api")>("@/lib/api");
  return {
    ...originalModule,
    apiCall: jest.fn(),
  };
});

describe("apiCall", () => {
  const mockEndpoint = "/test-endpoint";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should have apiCall function exported", () => {
    expect(typeof apiCall).toBe("function");
  });

  it("should accept correct parameters", () => {
    const mockApiCall = apiCall as jest.MockedFunction<typeof apiCall>;

    // Test type checking (compile-time)
    type TestResponse = ApiResponse<{ id: string }>;

    // This is mainly a type test - we're checking the types work
    expect(typeof mockApiCall).toBe("function");
  });
});

describe("ApiResponse Type", () => {
  it("should accept response with data", () => {
    const response: ApiResponse<string> = {
      success: true,
      data: "test",
    };
    expect(response.success).toBe(true);
  });

  it("should accept response with error", () => {
    const response: ApiResponse<never> = {
      success: false,
      error: {
        code: "ERROR",
        message: "Error message",
      },
    };
    expect(response.success).toBe(false);
  });

  it("should accept response with meta information", () => {
    const response: ApiResponse<string> = {
      success: true,
      data: "test",
      meta: {
        timestamp: "2024-01-01T00:00:00.000Z",
        pagination: {
          page: 1,
          limit: 10,
          total: 100,
          totalPages: 10,
        },
      },
    };
    expect(response.meta?.pagination?.page).toBe(1);
  });

  it("should accept response with error details", () => {
    const response: ApiResponse<never> = {
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid data",
        details: { field: "email" },
      },
    };
    expect(response.error?.code).toBe("VALIDATION_ERROR");
    expect(response.error?.details).toEqual({ field: "email" });
  });

  it("should accept response without optional fields", () => {
    const response: ApiResponse<string> = {
      success: true,
      data: "test",
    };
    expect(response.success).toBe(true);
    expect(response.data).toBe("test");
  });
});
