import { apiCall } from "@/lib/api";

export class BannerService {
  static async getBannerInfo() {
    return apiCall("GET", "/banners");
  }
}

export default BannerService;
