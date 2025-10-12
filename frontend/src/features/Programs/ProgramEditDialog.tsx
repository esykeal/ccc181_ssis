import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { Program, College } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditProgramDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  program: Program | null;
  onProgramUpdated: () => void;
}

export default function EditProgramDialog({
  open,
  onOpenChange,
  program,
  onProgramUpdated,
}: EditProgramDialogProps) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("");

  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/colleges/")
      .then((res) => setColleges(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (program) {
      setCode(program.program_code);
      setName(program.program_name);
      setSelectedCollege(program.college_code);
      setError("");
    }
  }, [program, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!program) return;

    setLoading(true);
    setError("");

    try {
      await api.put(`/programs/${program.program_code}`, {
        program_code: code,
        program_name: name,
        college_code: selectedCollege,
      });

      onOpenChange(false);
      onProgramUpdated();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update program");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Program</DialogTitle>
          <DialogDescription>
            Update program details and college affiliation.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-prog-code" className="text-right">
              Code
            </Label>
            <Input
              id="edit-prog-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="col-span-3"
              required
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-prog-name" className="text-right">
              Name
            </Label>
            <Input
              id="edit-prog-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              required
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">College</Label>
            <div className="col-span-3">
              <Select
                onValueChange={setSelectedCollege}
                value={selectedCollege}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a college..." />
                </SelectTrigger>
                <SelectContent>
                  {colleges.map((college) => (
                    <SelectItem key={college.id} value={college.college_code}>
                      {college.college_code} - {college.college_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
