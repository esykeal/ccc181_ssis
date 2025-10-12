import { useEffect, useState } from "react";
import type { College } from "@/types";
import { Button } from "@/components/ui/button";
import AddCollegeDialog from "./CollegeAddDialog";
import DeleteConfirmationDialog from "./CollegeDeleteConfirmationDialog";
import EditCollegeDialog from "./CollegeEditDialog";
import ErrorDialog from "../Components/ErrorDialog";
import PaginationControls from "../Components/PaginationControls";
import collegeApi from "@/api/collegeApi";

export default function CollegeList() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

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
      const response = await collegeApi.fetchAll(page, limit);

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
  }, [page]);

  const initiateDelete = (code: string) => {
    setCollegeToDelete(code);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
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

  const handleEdit = (college: College) => {
    setCollegeToEdit(college);
    setEditDialogOpen(true);
  };

  if (loading && colleges.length === 0)
    return <p className="text-center p-4">Loading...</p>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Colleges</h1>
          <p className="text-zinc-500 text-sm">Manage university departments</p>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
        <AddCollegeDialog onCollegeAdded={fetchColleges} />
      </div>

      <div className="border rounded-lg overflow-hidden shadow-sm bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 border-b">
            <tr>
              <th className="p-4 font-medium text-zinc-500">Code</th>
              <th className="p-4 font-medium text-zinc-500">Name</th>
              <th className="p-4 font-medium text-zinc-500 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {colleges.length === 0 && !loading ? (
              <tr>
                <td colSpan={3} className="p-4 text-center text-zinc-500">
                  No colleges found.
                </td>
              </tr>
            ) : (
              colleges.map((college) => (
                <tr
                  key={college.id}
                  className="border-b last:border-0 hover:bg-zinc-50"
                >
                  <td className="p-4 font-medium">{college.college_code}</td>
                  <td className="p-4">{college.college_name}</td>
                  <td className="p-4 text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(college)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => initiateDelete(college.college_code)}
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

      <div className="flex justify-center mt-4 border">
        <PaginationControls
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title={`Delete ${collegeToDelete}?`}
        description="Are you sure? This action cannot be undone."
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
