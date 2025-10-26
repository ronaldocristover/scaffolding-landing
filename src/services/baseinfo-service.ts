import { apiCall } from "@/lib/api";

export class BaseInfoService {
  static async getBaseInfo() {
    return apiCall("GET", "/baseInfo");
  }
}

export default BaseInfoService;
