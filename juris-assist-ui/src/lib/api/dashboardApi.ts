import axios from "axios";
import { API_BASE_URL } from "@/lib/config";

const BASE_URL = API_BASE_URL + "/api/dashboard";

const handleResponse = async <T>(promise: Promise<any>): Promise<T> => {
  try {
    const res = await promise;
    // If backend returned HTML by mistake
    if (typeof res.data === "string" && res.data.startsWith("<")) {
      console.error("Unexpected HTML response from backend:", res.data);
      throw new Error("Backend returned HTML instead of JSON");
    }
    return res.data;
  } catch (err) {
    console.error("API request failed:", err);
    throw err;
  }
};

export const DashboardService = {
  // Lawyers
  getTotalLawyers: async (): Promise<number> =>
    handleResponse<number>(axios.get(`${BASE_URL}/lawyers/total`)),

  getActiveLawyers: async (): Promise<number> =>
    handleResponse<number>(axios.get(`${BASE_URL}/lawyers/active`)),

  getLawyersByRegion: async (): Promise<Record<string, number>> =>
    handleResponse<Record<string, number>>(axios.get(`${BASE_URL}/lawyers/region/lawyers`)),

  getLawyersPerYear: async (): Promise<Record<string, number>> =>
    handleResponse<Record<string, number>>(axios.get(`${BASE_URL}/lawyers/trends`)),

  // Cases / Affaires
  getTotalCases: async (): Promise<number> =>
    handleResponse<number>(axios.get(`${BASE_URL}/affaires/total`)),

  getCasesByStatus: async (): Promise<Record<string, number>> =>
    handleResponse<Record<string, number>>(axios.get(`${BASE_URL}/affaires/status`)),

  getCasesByType: async (): Promise<Record<string, number>> =>
    handleResponse<Record<string, number>>(axios.get(`${BASE_URL}/affaires/type`)),

  getAssignedVsUnassigned: async (): Promise<Record<string, number>> =>
    handleResponse<Record<string, number>>(axios.get(`${BASE_URL}/affaires/assigned`)),

  getManualAssignments: async (): Promise<number> =>
    handleResponse<number>(axios.get(`${BASE_URL}/affaires/reassignments`)),

  getAverageHandlingTime: async (): Promise<number> =>
  handleResponse<number>(axios.get(`${BASE_URL}/affaires/avg-handling-time`)),

  getCasesPerMonth: async (): Promise<Record<string, number>> =>
  handleResponse<Record<string, number>>(
    axios.get(`${BASE_URL}/affaires/trends`)
  ),

  getCasesByRegion: async (): Promise<Record<string, number>> =>
  handleResponse<Record<string, number>>(
    axios.get(`${BASE_URL}/affaires/region/affaires`)
  ),

  getLawyerWorkload: async () =>
  handleResponse<any[]>(axios.get(`${BASE_URL}/lawyers/workload`)),

getLawyerResponseRates: async () =>
  handleResponse<any[]>(axios.get(`${BASE_URL}/lawyers/response-rate`)),

getLawyerUtilization: async () =>
  handleResponse<any[]>(axios.get(`${BASE_URL}/lawyers/lawyer-utilization`)),
};
