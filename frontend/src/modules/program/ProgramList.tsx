import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { Program } from "@/types";
import { Button } from "@/components/ui/button";
import DeleteConfirmationDialog from "./ProgramDeleteConfirmationDialog";

export default function ProgramList() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Delete State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<string | null>(null);

  const fetchPrograms = () => {
    setLoading(true);
    api
      .get("/programs/") // Note: backend route is /programs/
      .then((response) => {
        setPrograms(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("API Error:", err);
        setError("Failed to load programs.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  // Delete Logic
  const initiateDelete = (code: string) => {
    setProgramToDelete(code);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!programToDelete) return;
    try {
      await api.delete(`/programs/${programToDelete}`);
      setDeleteDialogOpen(false);
      setProgramToDelete(null);
      fetchPrograms();
    } catch (err: any) {
      console.error(err);
      // Backend will return error if students are enrolled
      alert(err.response?.data?.error || "Failed to delete program");
      setDeleteDialogOpen(false);
    }
  };

  if (loading && programs.length === 0)
    return <p className="text-center p-4">Loading programs...</p>;
  if (error) return <p className="text-center text-red-500 p-4">{error}</p>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Programs</h1>
          <p className="text-zinc-500 text-sm">Manage academic courses</p>
        </div>
        {/* Placeholder Button until we build the Dialog */}
        <Button onClick={() => alert("Add Dialog coming next!")}>
          + Add Program
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden shadow-sm bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 border-b">
            <tr>
              <th className="p-4 font-medium text-zinc-500">Code</th>
              <th className="p-4 font-medium text-zinc-500">Name</th>
              <th className="p-4 font-medium text-zinc-500">College</th>
              <th className="p-4 font-medium text-zinc-500 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {programs.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-zinc-500">
                  No programs found.
                </td>
              </tr>
            ) : (
              programs.map((program) => (
                <tr
                  key={program.id}
                  className="border-b last:border-0 hover:bg-zinc-50"
                >
                  <td className="p-4 font-medium">{program.program_code}</td>
                  <td className="p-4">{program.program_name}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200">
                      {program.college_code}
                    </span>
                  </td>
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
                      onClick={() => initiateDelete(program.program_code)}
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
        title={`Delete ${programToDelete}?`}
        description="Are you sure? This cannot be undone."
      />
    </div>
  );
}
