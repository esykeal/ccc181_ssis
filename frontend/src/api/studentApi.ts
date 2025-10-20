import api from "@/lib/api";
import type { Student } from "@/types"; //

interface FetchStudentsResponse {
  data: Student[];
  total: number;
}

const studentApi = {
  // 1. FETCH ALL (With Pagination, Sort, Search)
  fetchAll: async (
    page: number,
    limit: number,
    sortBy: string = "student_id",
    sortOrder: "asc" | "desc" = "asc",
    search: string = ""
  ) => {
    // Note: The controller prefix is '/student', not '/students'
    const response = await api.get<FetchStudentsResponse>("/student/", {
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

  // 2. GET ONE (By ID)
  getById: async (id: string) => {
    const response = await api.get<Student>(`/student/${id}`);
    return response.data;
  },

  // 3. CREATE
  create: async (
    id: string,
    firstname: string,
    lastname: string,
    programCode: string,
    year: number,
    gender: string
  ) => {
    return api.post("/student/", {
      student_id: id,
      firstname,
      lastname,
      program_code: programCode,
      year,
      gender,
    });
  },

  // 4. UPDATE
  update: async (
    originalId: string,
    newId: string,
    firstname: string,
    lastname: string,
    programCode: string,
    year: number,
    gender: string
  ) => {
    return api.put(`/student/${originalId}`, {
      student_id: newId,
      firstname,
      lastname,
      program_code: programCode,
      year,
      gender,
    });
  },

  // 5. DELETE
  delete: async (id: string) => {
    return api.delete(`/student/${id}`);
  },
};

export default studentApi;
