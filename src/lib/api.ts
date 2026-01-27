import axios from "axios";

// API base configuration
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://scaffolding-api.ronaldodev.com";

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
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Logger
    if (process.env.NODE_ENV === "development") {
      const { method, url, params, data } = config;
      const fullUrl = config.baseURL ? `${config.baseURL}${url}` : url;

      if (typeof window !== "undefined") {
        const timestamp = new Date().toLocaleTimeString();
        console.groupCollapsed(
          `%c🚀 API Req [${timestamp}]: ${method?.toUpperCase()} ${url}`,
          "color: #3b82f6; font-weight: bold;",
        );
        console.log("Full URL:", fullUrl);
        if (params) console.log("Params:", params);
        if (data) console.log("Body:", data);
        console.log("Headers:", config.headers);
        console.groupEnd();
      } else {
        console.log(`[API Req] ${method?.toUpperCase()} ${fullUrl}`);
      }
    }

    return config;
  },
  (error) => {
    if (process.env.NODE_ENV === "development") {
      console.error("API Request Error:", error);
    }
    return Promise.reject(error);
  },
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Logger
    if (process.env.NODE_ENV === "development") {
      const { status, config, data } = response;
      const { url } = config;

      if (typeof window !== "undefined") {
        const timestamp = new Date().toLocaleTimeString();
        console.groupCollapsed(
          `%c✅ API Res [${timestamp}]: ${status} ${url}`,
          "color: #22c55e; font-weight: bold;",
        );
        console.log("Data:", data);
        console.groupEnd();
      } else {
        console.log(`[API Res] ${status} ${url}`);
      }
    }
    return response;
  },
  (error) => {
    // Logger
    if (process.env.NODE_ENV === "development") {
      const { response, config } = error;
      const status = response?.status;
      const url = config?.url;

      if (typeof window !== "undefined") {
        const timestamp = new Date().toLocaleTimeString();
        console.groupCollapsed(
          `%c❌ API Err [${timestamp}]: ${status || "Network"} ${url}`,
          "color: #ef4444; font-weight: bold;",
        );
        console.error("Error:", error);
        if (response?.data) console.error("Response Data:", response.data);
        console.groupEnd();
      } else {
        console.error(`[API Err] ${status} ${url}`, error.message);
      }
    }

    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized access
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
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
  data?: Record<string, unknown> | FormData,
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
