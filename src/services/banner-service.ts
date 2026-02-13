import { apiCall } from "@/lib/api";

export interface BannerInfo {
  success: boolean;
  content: {
    id: string
    title: string;
    subtitle: string;
    content: string;
    images: string[];
  };
  images: string[];
}

export class BannerService {
  static async getBannerInfo() {
    return apiCall<BannerInfo>("GET", "/banners");
  }
}

export default BannerService;
