import api from "@/lib/api";
import type { Student } from "@/types";

interface FetchStudentsResponse {
  data: Student[];
  total: number;
}

export interface StudentFilters {
  program?: string[];
  year?: string[];
  gender?: string[];
}

const studentApi = {
  fetchAll: async (
    page: number,
    limit: number,
    sortBy: string = "student_id",
    sortOrder: "asc" | "desc" = "asc",
    search: string = "",
    filters?: StudentFilters
  ) => {
    const params: any = {
      page,
      limit,
      sort_by: sortBy,
      sort_order: sortOrder,
      search: search,
    };

    if (filters) {
      if (filters.program?.length) params.program = filters.program.join(",");
      if (filters.year?.length) params.year = filters.year.join(",");
      if (filters.gender?.length) params.gender = filters.gender.join(",");
    }

    const response = await api.get<FetchStudentsResponse>("/student/", {
      params,
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Student>(`/student/${id}`);
    return response.data;
  },

  create: async (
    id: string,
    firstname: string,
    lastname: string,
    programCode: string,
    year: number,
    gender: string,
    file: File | null
  ) => {
    const formData = new FormData();
    formData.append("student_id", id);
    formData.append("firstname", firstname);
    formData.append("lastname", lastname);
    formData.append("program_code", programCode);
    formData.append("year", year.toString());
    formData.append("gender", gender);

    if (file) {
      formData.append("avatar", file);
    }

    return api.post("/student/", formData);
  },

  update: async (
    originalId: string,
    newId: string,
    firstname: string,
    lastname: string,
    programCode: string,
    year: number,
    gender: string,
    file: File | null
  ) => {
    const formData = new FormData();
    formData.append("student_id", newId);
    formData.append("firstname", firstname);
    formData.append("lastname", lastname);
    formData.append("program_code", programCode);
    formData.append("year", year.toString());
    formData.append("gender", gender);

    if (file) {
      formData.append("avatar", file);
    }

    return api.put(`/student/${originalId}`, formData);
  },

  delete: async (id: string) => {
    return api.delete(`/student/${id}`);
  },
};

export default studentApi;
