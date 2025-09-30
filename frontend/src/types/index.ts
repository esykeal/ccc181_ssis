export interface College {
  id: number;
  college_code: string;
  college_name: string;
}

export interface Program {
  id: number;
  program_code: string;
  program_name: string;
  college_code: string;
}

export interface Student {
  id: number;
  student_id: string;
  firstname: string;
  lastname: string;
  program_code: string;
  year: number;
  gender: string;
}
