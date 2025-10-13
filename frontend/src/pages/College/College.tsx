import { useEffect, useState } from "react";
import type { College } from "@/types";
import collegeApi from "@/api/collegeApi";
import CollegeList from "@/features/College/CollegeList";
import AddCollegeDialog from "@/features/College/CollegeAddDialog";
import PaginationControls from "@/features/Components/PaginationControls";
import DeleteConfirmationDialog from "@/features/College/CollegeDeleteConfirmationDialog";
import EditCollegeDialog from "@/features/College/CollegeEditDialog";
import ErrorDialog from "@/features/Components/ErrorDialog";

export default function CollegePage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [collegeToDelete, setCollegeToDelete] = useState<string | null>(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [collegeToEdit, setCollegeToEdit] = useState<College | null>(null);

  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchColleges = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await collegeApi.fetchAll(
        page,
        limit,
        sortBy,
        sortOrder
      );
      setColleges(response.data || []);
      const totalRecords = response.total || 0;
      setTotalPages(Math.ceil(totalRecords / limit));
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to load colleges.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, [page, sortBy, sortOrder]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handleInitiateDelete = (code: string) => {
    setCollegeToDelete(code);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!collegeToDelete) return;
    try {
      await collegeApi.delete(collegeToDelete);
      setDeleteDialogOpen(false);
      setCollegeToDelete(null);
      fetchColleges();
    } catch (err: any) {
      setDeleteDialogOpen(false);
      const msg = err.response?.data?.error || "Failed to delete college";
      setErrorMessage(msg);
      setErrorDialogOpen(true);
    }
  };

  const handleInitiateEdit = (college: College) => {
    setCollegeToEdit(college);
    setEditDialogOpen(true);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto flex flex-col gap-6 pb-24">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Colleges</h1>
          <p className="text-zinc-500 text-sm">Manage university's colleges</p>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
        <AddCollegeDialog onCollegeAdded={fetchColleges} />
      </div>

      <CollegeList
        colleges={colleges}
        loading={loading}
        onEdit={handleInitiateEdit}
        onDelete={handleInitiateDelete}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
      />

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl bg-white border-t border-zinc-200 p-4 flex justify-center z-10">
        <PaginationControls
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title={`Delete ${collegeToDelete}?`}
      />

      <EditCollegeDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        college={collegeToEdit}
        onCollegeUpdated={fetchColleges}
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
