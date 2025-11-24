import { useEffect, useState } from "react";
import type { Student } from "@/types";
import studentApi from "@/api/studentApi";
import StudentList from "@/features/Student/StudentList";
import AddStudentDialog from "@/features/Student/StudentAddDialog";
import PaginationControls from "@/features/Components/PaginationControls";
import DeleteConfirmationDialog from "@/features/Student/StudentDeleteConfirmationDialog";
import EditStudentDialog from "@/features/Student/StudentEditDialog";
import ErrorDialog from "@/features/Components/ErrorDialog";
import StudentSearchBar from "@/features/Student/StudentSeachBar";
import { StudenCardDetails } from "@/features/Student/StudentCard";

import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function StudentPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);

  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchStudents = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await studentApi.fetchAll(
        page,
        limit,
        sortBy,
        sortOrder,
        searchQuery
      );
      setStudents(response.data || []);
      const totalRecords = response.total || 0;
      setTotalPages(Math.ceil(totalRecords / limit));
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to load students.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery) setPage(1);
    fetchStudents();
  }, [page, sortBy, sortOrder, searchQuery]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handleRowClick = (student: Student) => {
    setSelectedStudent(student);
  };

  const handleInitiateDelete = (id: string) => {
    setStudentToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;
    try {
      await studentApi.delete(studentToDelete);
      setDeleteDialogOpen(false);

      if (
        selectedStudent &&
        String(selectedStudent.student_id) === String(studentToDelete)
      ) {
        setSelectedStudent(null);
      }

      setStudentToDelete(null);
      fetchStudents();
    } catch (err: any) {
      setDeleteDialogOpen(false);
      const msg = err.response?.data?.error || "Failed to delete student";
      setErrorMessage(msg);
      setErrorDialogOpen(true);
    }
  };

  const handleInitiateEdit = (student: Student) => {
    setStudentToEdit(student);
    setEditDialogOpen(true);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col gap-4 pb-14">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Students</h1>
          <p className="text-zinc-500 text-sm">Manage student records</p>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
        <AddStudentDialog onStudentAdded={fetchStudents} />
      </div>

      <div className="flex justify-between items-center bg-zinc-50 p-2">
        <StudentSearchBar onSearch={setSearchQuery} />
      </div>

      <div className="space-y-4">
        <StudentList
          students={students}
          loading={loading}
          onEdit={handleInitiateEdit}
          onDelete={handleInitiateDelete}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          onRowClick={handleRowClick}
        />

        <div className="fixed bottom-0 left-3/4 -translate-x-1/2 w-full max-w-5xl p-4 flex justify-center z-10">
          <PaginationControls
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>

      <Dialog
        open={!!selectedStudent}
        onOpenChange={(open) => {
          if (!open) setSelectedStudent(null);
        }}
      >
        <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-md w-full [&>button]:hidden">
          <StudenCardDetails
            student={selectedStudent}
            onClose={() => setSelectedStudent(null)}
            onEdit={(student) => {
              handleInitiateEdit(student);
            }}
            onDelete={(id) => {
              handleInitiateDelete(id);
            }}
          />
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title={`Delete Student ${studentToDelete}?`}
      />

      <EditStudentDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        student={studentToEdit}
        onStudentUpdated={() => {
          fetchStudents();
          setSelectedStudent(null);
        }}
      />

      <ErrorDialog
        open={errorDialogOpen}
        onOpenChange={setErrorDialogOpen}
        title="Unable to Delete"
        description={errorMessage}
      />
    </div>
  );
}
