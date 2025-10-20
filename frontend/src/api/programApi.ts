import api from "@/lib/api";
import type { Program } from "@/types";

interface FetchProgramsResponse {
  data: Program[];
  total: number;
}

const programApi = {
  // 1. FETCH ALL (With Pagination, Sort, Search)
  fetchAll: async (
    page: number,
    limit: number,
    sortBy: string = "program_code",
    sortOrder: "asc" | "desc" = "asc",
    search: string = ""
  ) => {
    const response = await api.get<FetchProgramsResponse>("/programs/", {
      params: {
        page,
        limit,
        sort_by: sortBy,
        sort_order: sortOrder,
        search: search,
      },
    });
    return response.data;
  },

  // 2. GET ONE (By Code)
  getByCode: async (code: string) => {
    const response = await api.get<Program>(`/programs/${code}`);
    return response.data;
  },

  // 3. CREATE (Requires College Code)
  create: async (code: string, name: string, collegeCode: string) => {
    return api.post("/programs/", {
      program_code: code,
      program_name: name,
      college_code: collegeCode,
    });
  },

  // 4. UPDATE (Requires College Code)
  update: async (
    originalCode: string,
    newCode: string,
    newName: string,
    newCollegeCode: string
  ) => {
    return api.put(`/programs/${originalCode}`, {
      program_code: newCode,
      program_name: newName,
      college_code: newCollegeCode,
    });
  },

  // 5. DELETE
  delete: async (code: string) => {
    return api.delete(`/programs/${code}`);
  },
};

export default programApi;
