import { useEffect, useState } from "react";
import api from "@/lib/api";
import studentApi from "@/api/studentApi";
import type { Student, Program } from "@/types";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from "lucide-react";

import defaultpfp from "@/assets/default_pfp.jpg";

interface EditStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
  onStudentUpdated: () => void;
}

export default function EditStudentDialog({
  open,
  onOpenChange,
  student,
  onStudentUpdated,
}: EditStudentDialogProps) {
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
          const data = res.data.data || res.data;
          setPrograms(Array.isArray(data) ? data : []);
        })
        .catch((err) => console.error("Failed to load programs", err));
    }
  }, [open]);

  useEffect(() => {
    if (student && open) {
      setStudentId(student.student_id);
      setFirstName(student.firstname);
      setLastName(student.lastname);
      setProgramCode(student.program_code);
      setYear(student.year.toString());
      setGender(student.gender);

      setPreviewUrl(student.pfp_url || null);
      setSelectedFile(null);
      setError("");
    }
  }, [student, open]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl !== student?.pfp_url) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, student]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;

    setLoading(true);
    setError("");

    try {
      await studentApi.update(
        student.student_id,
        studentId,
        firstName,
        lastName,
        programCode,
        parseInt(year),
        gender,
        selectedFile
      );

      onStudentUpdated();
      onOpenChange(false);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to update student");
    } finally {
      setLoading(false);
    }
  };

  if (!student) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
          <DialogDescription>
            Update student details. Click the photo to change it.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="flex flex-col items-center justify-center gap-3">
            <label
              htmlFor="edit-picture-upload"
              className="group relative cursor-pointer"
            >
              <Avatar className="h-28 w-28 border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors bg-white">
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
                id="edit-picture-upload"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
            </label>
            <p className="text-xs text-muted-foreground">Change Photo</p>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>ID Number</Label>
              <Input
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>First Name</Label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label>Last Name</Label>
                <Input
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
                      {prog.program_code || prog.code}
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
                    <SelectValue placeholder="Year..." />
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
                    <SelectValue placeholder="Gender..." />
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

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
