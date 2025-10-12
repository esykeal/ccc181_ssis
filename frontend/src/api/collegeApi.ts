import api from "@/lib/api";
import type { College } from "@/types";

interface FetchCollegesResponse {
  data: College[];
  total: number;
}

const collegeApi = {
  fetchAll: async (page: number, limit: number) => {
    const response = await api.get<FetchCollegesResponse>("/colleges/", {
      params: { page, limit },
    });
    return response.data;
  },

  getByCode: async (code: string) => {
    const response = await api.get<College>(`/colleges/${code}`);
    return response.data;
  },

  create: async (code: string, name: string) => {
    return api.post("/colleges/", {
      college_code: code,
      college_name: name,
    });
  },

  update: async (originalCode: string, newCode: string, newName: string) => {
    return api.put(`/colleges/${originalCode}`, {
      college_code: newCode,
      college_name: newName,
    });
  },

  delete: async (code: string) => {
    return api.delete(`/colleges/${code}`);
  },
};

export default collegeApi;
