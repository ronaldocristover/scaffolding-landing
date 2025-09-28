// API service for landing page data
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';

export interface LandingPageData {
  locale: string;
  hero: {
    certificates: Array<{
      src: string;
      alt: string;
    }>;
  };
  about: {
    title: string;
    subtitle: string;
    description: string;
    images: Array<{
      src: string;
      alt: string;
    }>;
  };
  companyLogos: string[];
  video: {
    title: string;
    embedUrl: string;
  };
  pricing: {
    title: string;
    subtitle: string;
    steps: Array<{
      title: string;
      content: string;
    }>;
  };
  contact: {
    phoneNumber: string;
    contacts: Array<{
      type: string;
      icon: string;
      alt: string;
      text: string;
      link?: string;
    }>;
  };
  footer: {
    copyright: string;
  };
  navigation: {
    about: string;
    pricing: string;
    contact: string;
  };
}

export interface ContactInfo {
  phoneNumber: string;
  contacts: Array<{
    type: string;
    icon: string;
    alt: string;
    text: string;
    link?: string;
  }>;
}

export interface PricingData {
  title: string;
  subtitle: string;
  steps: Array<{
    title: string;
    content: string;
  }>;
}

class ApiService {
  private async fetchData<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API call failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async getLandingPageData(locale: string): Promise<LandingPageData> {
    return this.fetchData<LandingPageData>(`/landing-page/${locale}`);
  }

  async getContactInfo(): Promise<ContactInfo> {
    return this.fetchData<ContactInfo>('/contact');
  }

  async getPricingData(locale: string): Promise<PricingData> {
    return this.fetchData<PricingData>(`/pricing/${locale}`);
  }

  async getHealthStatus(): Promise<{ status: string; timestamp: string }> {
    return this.fetchData<{ status: string; timestamp: string }>('/health');
  }
}

export const apiService = new ApiService();