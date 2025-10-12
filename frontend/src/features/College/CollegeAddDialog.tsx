import { useState } from "react";
import api from "@/lib/api";
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

interface AddCollegeDialogProps {
  onCollegeAdded: () => void;
}

export default function AddCollegeDialog({
  onCollegeAdded,
}: AddCollegeDialogProps) {
  const [open, setOpen] = useState(false);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");

  const [codeError, setCodeError] = useState("");
  const [nameError, setNameError] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // 1. HANDLER FOR CODE (No spaces, No numbers)
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCode(val);

    if (val && !/^[A-Za-z]+$/.test(val)) {
      setCodeError("Code cannot contain spaces, numbers, or symbols.");
    } else {
      setCodeError("");
    }
  };

  // 2. HANDLER FOR NAME (No numbers)
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);

    if (val && !/^[A-Za-z\s]+$/.test(val)) {
      setNameError("Name cannot contain numbers or symbols.");
    } else {
      setNameError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (codeError || nameError) return;

    setLoading(true);
    setSubmitError("");

    try {
      await api.post("/colleges/", {
        college_code: code,
        college_name: name,
      });

      setOpen(false);
      setCode("");
      setName("");
      setCodeError("");
      setNameError("");
      onCollegeAdded();
    } catch (err: any) {
      setSubmitError(err.response?.data?.error || "Failed to add college");
    } finally {
      setLoading(false);
    }
  };

  const isSaveDisabled =
    loading || !!codeError || !!nameError || !code || !name;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">+ Add College</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New College</DialogTitle>
          <DialogDescription>
            Enter the details for the new college below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {submitError && (
            <p className="text-sm text-red-500 font-medium">{submitError}</p>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="code" className="text-right">
              Code
            </Label>
            <div className="col-span-3">
              <Input
                id="code"
                value={code}
                onChange={handleCodeChange}
                placeholder="e.g. CCS"
                className={
                  codeError ? "border-red-500 focus-visible:ring-red-500" : ""
                }
                required
              />
              {codeError && (
                <p className="text-xs text-red-500 mt-1">{codeError}</p>
              )}
            </div>
          </div>

          {/* NAME FIELD */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <div className="col-span-3">
              <Input
                id="name"
                value={name}
                onChange={handleNameChange}
                placeholder="e.g. College of Computer Studies"
                className={
                  nameError ? "border-red-500 focus-visible:ring-red-500" : ""
                }
                required
              />
              {nameError && (
                <p className="text-xs text-red-500 mt-1">{nameError}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSaveDisabled}>
              {loading ? "Saving..." : "Save College"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
