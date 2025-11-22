import { useEffect, useState } from "react";
import programApi from "@/api/programApi";
import collegeApi from "@/api/collegeApi";
import type { College } from "@/types";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddProgramDialogProps {
  onProgramAdded: () => void;
}

export default function AddProgramDialog({
  onProgramAdded,
}: AddProgramDialogProps) {
  const [open, setOpen] = useState(false);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("");

  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    collegeApi
      .fetchAll(1, 100)
      .then((data) => setColleges(data.data || []))
      .catch((err) =>
        console.error("Failed to load colleges for dropdown", err)
      );
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await programApi.create(code, name, selectedCollege);

      setOpen(false);
      setCode("");
      setName("");
      setSelectedCollege("");
      onProgramAdded();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to add program");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">+ Add Program</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Program</DialogTitle>
          <DialogDescription>
            Link a new academic program to an existing college.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

          {/* Program Code */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="prog-code" className="text-right">
              Code
            </Label>
            <Input
              id="prog-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. BSCS"
              className="col-span-3"
              required
            />
          </div>

          {/* Program Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="prog-name" className="text-right">
              Name
            </Label>
            <Input
              id="prog-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. BS in Computer Science"
              className="col-span-3"
              required
            />
          </div>

          {/* College Dropdown */}
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

                {/* FIX: Added className="max-h-[200px]" to force scrolling */}
                <SelectContent className="max-h-[200px]">
                  {colleges.length === 0 ? (
                    <div className="p-2 text-sm text-zinc-500">
                      No colleges found
                    </div>
                  ) : (
                    colleges.map((college) => (
                      <SelectItem key={college.id} value={college.college_code}>
                        {college.college_code} - {college.college_name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Program"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
