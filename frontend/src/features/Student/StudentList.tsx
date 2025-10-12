import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { Student } from "@/types";
import { Button } from "@/components/ui/button";
import AddStudentDialog from "./StudentAddDialog";
import DeleteConfirmationDialog from "./StudentDeleteConfirmationDialog";
import EditStudentDialog from "./StudentEditDialog";
import PaginationControls from "../Components/PaginationControls";

export default function StudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);

  const fetchStudents = () => {
    setLoading(true);

    api
      .get("/student/", {
        params: {
          page: page,
          limit: limit,
        },
      })
      .then((response) => {
        setStudents(response.data.data || response.data);
        setTotalPages(response.data.total_pages || 1);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setError("Failed to load students.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStudents();
  }, [page]);

  const initiateDelete = (id: string) => {
    setStudentToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!studentToDelete) return;
    try {
      await api.delete(`/student/${studentToDelete}`);
      setDeleteDialogOpen(false);
      setStudentToDelete(null);
      fetchStudents();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete student");
      setDeleteDialogOpen(false);
    }
  };

  const handleEdit = (student: Student) => {
    setStudentToEdit(student);
    setEditDialogOpen(true);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Students</h1>
          <p className="text-zinc-500 text-sm">Manage student records</p>
        </div>
        <AddStudentDialog onStudentAdded={fetchStudents} />
      </div>

      {loading ? (
        <p className="text-center p-4">Loading students...</p>
      ) : (
        <>
          <div className="border rounded-lg overflow-hidden shadow-sm bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 border-b">
                <tr>
                  <th className="p-4 font-medium text-zinc-500">ID</th>
                  <th className="p-4 font-medium text-zinc-500">Full Name</th>
                  <th className="p-4 font-medium text-zinc-500">Program</th>
                  <th className="p-4 font-medium text-zinc-500">Year</th>
                  <th className="p-4 font-medium text-zinc-500">Gender</th>
                  <th className="p-4 font-medium text-zinc-500 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b last:border-0 hover:bg-zinc-50"
                  >
                    <td className="p-4 font-medium font-mono">
                      {student.student_id}
                    </td>
                    <td className="p-4">
                      {student.lastname}, {student.firstname}
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded text-xs">
                        {student.program_code}
                      </span>
                    </td>
                    <td className="p-4">{student.year}</td>
                    <td className="p-4">{student.gender}</td>
                    <td className="p-4 text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(student)}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => initiateDelete(student.student_id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mt-4">
            <PaginationControls
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </>
      )}

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title={`Delete Student ${studentToDelete}?`}
        description="Are you sure? This cannot be undone."
      />

      <EditStudentDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        student={studentToEdit}
        onStudentUpdated={fetchStudents}
      />
    </div>
  );
}
