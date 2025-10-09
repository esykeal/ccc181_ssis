import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { Student } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DeleteConfirmationDialog from "./StudentDeleteConfirmationDialog";
import AddStudentDialog from "./AddStudentDialog";

export default function StudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Delete State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);

  const fetchStudents = () => {
    setLoading(true);
    api
      .get("/student/") // Note: Backend route is /student/ (singular based on your controller)
      .then((response) => {
        setStudents(response.data);
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
  }, []);

  // Delete Logic
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

  if (loading && students.length === 0)
    return <p className="text-center p-4">Loading students...</p>;
  if (error) return <p className="text-center text-red-500 p-4">{error}</p>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Students</h1>
          <p className="text-zinc-500 text-sm">Manage student records</p>
        </div>
        <AddStudentDialog onStudentAdded={fetchStudents} />
      </div>

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
            {students.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-zinc-500">
                  No students found.
                </td>
              </tr>
            ) : (
              students.map((student) => (
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
                      onClick={() => alert("Edit coming soon!")}
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
              ))
            )}
          </tbody>
        </table>
      </div>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title={`Delete ${studentToDelete}?`}
        description="Are you sure you want to delete this student record? This cannot be undone."
      />
    </div>
  );
}
