import { useEffect, useState } from "react";
import api from "@/lib/api";
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
} from "@/components/ui/dialog";

interface EditCollegeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  college: College | null; // The college we are editing
  onCollegeUpdated: () => void; // Refresh the list after success
}

export default function EditCollegeDialog({
  open,
  onOpenChange,
  college,
  onCollegeUpdated,
}: EditCollegeDialogProps) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 1. Sync form with the college prop whenever it changes
  useEffect(() => {
    if (college) {
      setCode(college.college_code);
      setName(college.college_name);
      setError(""); // Clear old errors
    }
  }, [college, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!college) return;

    setLoading(true);
    setError("");

    try {
      // 2. Send PUT request
      // URL uses the ORIGINAL code (to find it)
      // Body uses the NEW state (to update it)
      await api.put(`/colleges/${college.college_code}`, {
        college_code: code,
        college_name: name,
      });

      // 3. Success
      onOpenChange(false);
      onCollegeUpdated();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update college");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit College</DialogTitle>
          <DialogDescription>
            Make changes to the college details here. Click save when you're
            done.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-code" className="text-right">
              Code
            </Label>
            <Input
              id="edit-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-name" className="text-right">
              Name
            </Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              required
            />
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
