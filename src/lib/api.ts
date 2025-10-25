import axios from "axios";

// API base configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// API response type
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    timestamp: string;
  };
}

// Utility function for API calls
export const apiCall = async <T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  endpoint: string,
  data?: Record<string, unknown> | FormData
): Promise<ApiResponse<T>> => {
  try {
    const response = await apiClient.request({
      method,
      url: endpoint,
      data,
    });
    return response.data;
  } catch (error: unknown) {
    // Type guard for axios error
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: {
          data?: {
            error?: {
              code?: string;
              message?: string;
              details?: Record<string, unknown>;
            };
          };
        };
      };
      return {
        success: false,
        error: {
          code: axiosError.response?.data?.error?.code || "NETWORK_ERROR",
          message:
            axiosError.response?.data?.error?.message ||
            "Network error occurred",
          details: axiosError.response?.data?.error?.details,
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      };
    }

    return {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message: "Network error occurred",
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  }
};

export default apiClient;
