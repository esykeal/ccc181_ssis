import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { Program } from "@/types";
import { Button } from "@/components/ui/button";
import AddProgramDialog from "./ProgramAddDialog";
import DeleteConfirmationDialog from "./ProgramDeleteConfirmationDialog";
import EditProgramDialog from "./ProgramEditDialog";
import ErrorDialog from "@/features/Components/ErrorDialog";

export default function ProgramList() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<string | null>(null);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [programToEdit, setProgramToEdit] = useState<Program | null>(null);

  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchPrograms = () => {
    setLoading(true);
    api
      .get("/programs/")
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
      setDeleteDialogOpen(false);

      const msg = err.response?.data?.error || "Failed to delete program";

      setErrorMessage(msg);
      setErrorDialogOpen(true);
    }
  };

  const handleEdit = (program: Program) => {
    setProgramToEdit(program);
    setEditDialogOpen(true);
  };

  if (loading && programs.length === 0)
    return <p className="text-center p-4">Loading programs...</p>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Programs</h1>
          <p className="text-zinc-500 text-sm">Manage academic courses</p>
        </div>
        <AddProgramDialog onProgramAdded={fetchPrograms} />
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
            {programs.map((program) => (
              <tr
                key={program.id}
                className="border-b last:border-0 hover:bg-zinc-50"
              >
                <td className="p-4 font-medium">{program.program_code}</td>
                <td className="p-4">{program.program_name}</td>
                <td className="p-4">
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800">
                    {program.college_code}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(program)}
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
            ))}
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
