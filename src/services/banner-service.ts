import { apiCall } from "@/lib/api";

export interface BannerInfo {
  images: string[];
}

export class BannerService {
  static async getBannerInfo() {
    return apiCall<BannerInfo>("GET", "/banners");
  }
}

export default BannerService;
