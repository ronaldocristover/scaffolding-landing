import { apiCall } from "@/lib/api";

export class AboutCompanyService {
  static async getAboutInfo() {
    return apiCall("GET", "/about");
  }
}

export default AboutCompanyService;
