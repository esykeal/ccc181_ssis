import { useEffect, useState } from "react";
import type { Program } from "@/types";
import programApi from "@/api/programApi";
import ProgramList from "@/features/Programs/ProgramList";
import AddProgramDialog from "@/features/Programs/ProgramAddDialog";
import PaginationControls from "@/features/Components/PaginationControls";
import DeleteConfirmationDialog from "@/features/Programs/ProgramDeleteConfirmationDialog";
import EditProgramDialog from "@/features/Programs/ProgramEditDialog";
import ErrorDialog from "@/features/Components/ErrorDialog";
import ProgramSearchBar from "@/features/Programs/ProgramSearchBar";

export default function ProgramPage() {
  // --- 1. STATE (The Brain) ---
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  // Sorting & Search
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog States
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<string | null>(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [programToEdit, setProgramToEdit] = useState<Program | null>(null);

  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // --- 2. API ACTIONS ---
  const fetchPrograms = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await programApi.fetchAll(
        page,
        limit,
        sortBy,
        sortOrder,
        searchQuery
      );
      setPrograms(response.data || []);
      const totalRecords = response.total || 0;
      setTotalPages(Math.ceil(totalRecords / limit));
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to load programs.");
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch when these change
  useEffect(() => {
    if (searchQuery) setPage(1); // Reset to page 1 on new search
    fetchPrograms();
  }, [page, sortBy, sortOrder, searchQuery]);

  // --- 3. EVENT HANDLERS ---
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handleInitiateDelete = (code: string) => {
    setProgramToDelete(code);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!programToDelete) return;
    try {
      await programApi.delete(programToDelete);
      setDeleteDialogOpen(false);
      setProgramToDelete(null);
      fetchPrograms();
    } catch (err: any) {
      setDeleteDialogOpen(false);
      const msg = err.response?.data?.error || "Failed to delete program";
      setErrorMessage(msg);
      setErrorDialogOpen(true);
    }
  };

  const handleInitiateEdit = (program: Program) => {
    setProgramToEdit(program);
    setEditDialogOpen(true);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto flex flex-col gap-4 pb-18">
      {/* HEADER & ADD BUTTON */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Programs</h1>
          <p className="text-zinc-500 text-sm">Manage academic courses</p>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
        <AddProgramDialog onProgramAdded={fetchPrograms} />
      </div>

      {/* SEARCH BAR */}
      <div className="flex justify-between items-center bg-zinc-50 p-2">
        <ProgramSearchBar onSearch={setSearchQuery} />
      </div>

      {/* TABLE (Pure UI) */}
      <ProgramList
        programs={programs}
        loading={loading}
        onEdit={handleInitiateEdit}
        onDelete={handleInitiateDelete}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
      />

      {/* PAGINATION (Fixed Bottom) */}
      <div className="fixed bottom-0 left-3/4 -translate-x-1/2 w-full max-w-5xl p-4 flex justify-center z-10">
        <PaginationControls
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      {/* DIALOGS */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title={`Delete ${programToDelete}?`}
      />

      <EditProgramDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        program={programToEdit}
        onProgramUpdated={fetchPrograms}
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
