import { apiCall } from "@/lib/api";

export class CompanyInfoService {
  static async getCompanyInfo() {
    return apiCall("GET", "/basic-company-info");
  }
}

export default CompanyInfoService;
