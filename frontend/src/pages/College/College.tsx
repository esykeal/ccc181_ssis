import { useEffect, useState } from "react";
import type { College } from "@/types";
import collegeApi from "@/api/collegeApi";
import CollegeList from "@/features/College/CollegeList";
import AddCollegeDialog from "@/features/College/CollegeAddDialog";
import PaginationControls from "@/features/Components/PaginationControls";
import DeleteConfirmationDialog from "@/features/College/CollegeDeleteConfirmationDialog";
import EditCollegeDialog from "@/features/College/CollegeEditDialog";
import ErrorDialog from "@/features/Components/ErrorDialog";
import CollegeSearchBar from "@/features/College/CollegeSearchBar";
import { toast } from "sonner";

export default function CollegePage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchQuery, setSearchQuery] = useState("");

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
        sortOrder,
        searchQuery
      );

      console.log("Colleges API Response:", response);

      let dataList: College[] = [];
      let total = 0;

      if (Array.isArray(response)) {
        dataList = response;
        total = response.length;
      } else if (response && Array.isArray((response as any).data)) {
        dataList = (response as any).data;
        total = (response as any).total || dataList.length;
      }

      setColleges(dataList);
      setTotalPages(Math.ceil(total / limit) || 1);
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to load colleges.");
      setColleges([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, [page, sortBy, sortOrder, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

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

      toast.success("College deleted successfully");

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
    <div className="p-8 max-w-5xl mx-auto flex flex-col gap-4 pb-18">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Colleges</h1>
          <p className="text-zinc-500 text-sm">Manage university's colleges</p>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
        <AddCollegeDialog onCollegeAdded={fetchColleges} />
      </div>

      <div className="flex justify-between items-center bg-zinc-50 p-2">
        <CollegeSearchBar onSearch={handleSearch} />
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

      <div className="fixed bottom-0 left-3/4 -translate-x-1/2 w-full max-w-5xl p-4 flex justify-center z-10">
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
