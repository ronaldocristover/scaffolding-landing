import { apiCall } from "@/lib/api";

export class CompanyInfoService {
  static async getCompanyInfo() {
    return apiCall("GET", "/companyInfo");
  }
}

export default CompanyInfoService;
