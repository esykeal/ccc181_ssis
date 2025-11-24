import { useEffect, useState } from "react";
import api from "@/lib/api";
import studentApi from "@/api/studentApi";
import type { Program } from "@/types";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Upload } from "lucide-react";

import defaultpfp from "@/assets/default_pfp.jpg";

interface AddStudentDialogProps {
  onStudentAdded: () => void;
}

export default function AddStudentDialog({
  onStudentAdded,
}: AddStudentDialogProps) {
  const [open, setOpen] = useState(false);

  const [studentId, setStudentId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [programCode, setProgramCode] = useState("");
  const [year, setYear] = useState("");
  const [gender, setGender] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      api
        .get("/programs/")
        .then((res) => {
          if (res.data && Array.isArray(res.data.data)) {
            setPrograms(res.data.data);
          } else if (Array.isArray(res.data)) {
            setPrograms(res.data);
          } else {
            setPrograms([]);
          }
        })
        .catch((err) => console.error("Failed to load programs", err));
    }
  }, [open]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File Picker Opened and Changed!");
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File is too large. Please select an image under 5MB.");
        return;
      }
      setError("");
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setStudentId("");
    setFirstName("");
    setLastName("");
    setProgramCode("");
    setYear("");
    setGender("");
    setSelectedFile(null);
    setPreviewUrl(null);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Submitting with file:", selectedFile);

      await studentApi.create(
        studentId,
        firstName,
        lastName,
        programCode,
        parseInt(year),
        gender,
        selectedFile
      );

      setOpen(false);
      resetForm();
      onStudentAdded();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to add student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add Student
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>
            Enroll a new student. Click the photo to upload.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="py-4 space-y-6">
          <div className="flex flex-col items-center justify-center gap-3">
            <label
              htmlFor="picture-upload"
              className="group relative cursor-pointer"
            >
              <Avatar className="h-32 w-32 border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors bg-white">
                <AvatarImage
                  src={previewUrl || defaultpfp}
                  className="object-cover"
                />
                <AvatarFallback>IMG</AvatarFallback>
              </Avatar>

              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload className="h-8 w-8 text-white" />
              </div>

              <input
                id="picture-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
            </label>

            <p className="text-xs text-muted-foreground">Tap to upload photo</p>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="sid">ID Number</Label>
              <Input
                id="sid"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="YYYY-NNNN"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fname">First Name</Label>
                <Input
                  id="fname"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lname">Last Name</Label>
                <Input
                  id="lname"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Program</Label>
              <Select
                onValueChange={setProgramCode}
                value={programCode}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select program..." />
                </SelectTrigger>
                <SelectContent
                  className="max-h-[240px] overflow-y-auto"
                  position="popper"
                  sideOffset={4}
                >
                  {programs.map((prog: any) => (
                    <SelectItem
                      key={prog.program_code || prog.code}
                      value={prog.program_code || prog.code}
                    >
                      {prog.program_code || prog.code}{" "}
                      {prog.program_name ? `- ${prog.program_name}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Year</Label>
                <Select onValueChange={setYear} value={year} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1st Year</SelectItem>
                    <SelectItem value="2">2nd Year</SelectItem>
                    <SelectItem value="3">3rd Year</SelectItem>
                    <SelectItem value="4">4th Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Gender</Label>
                <Select onValueChange={setGender} value={gender} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Student"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
