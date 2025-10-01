import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { College } from "@/types";
import { Button } from "@/components/ui/button";
import AddCollegeDialog from "./CollegeAddDialog";
import DeleteConfirmationDialog from "./CollegeDeleteConfirmationDialog";

export default function CollegeList() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [collegeToDelete, setCollegeToDelete] = useState<string | null>(null);

  const fetchColleges = () => {
    setLoading(true);
    api
      .get("/colleges/")
      .then((response) => {
        setColleges(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setError("Failed to load colleges.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  const initiateDelete = (code: string) => {
    setCollegeToDelete(code);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!collegeToDelete) return;

    try {
      await api.delete(`/colleges/${collegeToDelete}`);
      setDeleteDialogOpen(false);
      setCollegeToDelete(null);
      fetchColleges();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to delete college");
      setDeleteDialogOpen(false);
    }
  };

  if (loading && colleges.length === 0)
    return <p className="text-center p-4">Loading...</p>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Colleges</h1>
          <p className="text-zinc-500 text-sm">Manage university departments</p>
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
            {colleges.map((college) => (
              <tr
                key={college.id}
                className="border-b last:border-0 hover:bg-zinc-50"
              >
                <td className="p-4 font-medium">{college.college_code}</td>
                <td className="p-4">{college.college_name}</td>
                <td className="p-4 text-right space-x-2">
                  <Button variant="outline" size="sm">
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
            ))}
          </tbody>
        </table>
      </div>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title={`Delete ${collegeToDelete}?`}
        description="Are you sure you want to delete this college? This action cannot be undone."
      />
    </div>
  );
}
