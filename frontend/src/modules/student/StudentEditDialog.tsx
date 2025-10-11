import { useEffect, useState } from "react";
import api from "@/lib/api";
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
  // Form Fields
  const [studentId, setStudentId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [programCode, setProgramCode] = useState("");
  const [year, setYear] = useState("");
  const [gender, setGender] = useState("");

  // Data for Dropdown
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 1. Fetch Programs List
  useEffect(() => {
    api
      .get("/programs/")
      .then((res) => setPrograms(res.data))
      .catch((err) => console.error(err));
  }, []);

  // 2. Pre-fill Form when "student" prop changes
  useEffect(() => {
    if (student) {
      setStudentId(student.student_id);
      setFirstName(student.firstname);
      setLastName(student.lastname);
      setProgramCode(student.program_code);
      setYear(student.year.toString()); // Convert number to string for Select
      setGender(student.gender);
      setError("");
    }
  }, [student, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;

    setLoading(true);
    setError("");

    try {
      // 3. Send PUT Request
      // URL: Use the ORIGINAL ID to find the record
      // BODY: Send the NEW ID (in case they changed it)
      await api.put(`/student/${student.student_id}`, {
        student_id: studentId,
        firstname: firstName,
        lastname: lastName,
        program_code: programCode,
        year: parseInt(year),
        gender: gender,
      });

      // 4. Success
      onOpenChange(false);
      onStudentUpdated();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
          <DialogDescription>
            Update student records and program enrollment.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

          {/* Student ID */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-sid" className="text-right">
              ID Number
            </Label>
            <Input
              id="edit-sid"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="col-span-3"
              required
            />
          </div>

          {/* First Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-fname" className="text-right">
              First Name
            </Label>
            <Input
              id="edit-fname"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="col-span-3"
              required
            />
          </div>

          {/* Last Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-lname" className="text-right">
              Last Name
            </Label>
            <Input
              id="edit-lname"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="col-span-3"
              required
            />
          </div>

          {/* Program Dropdown */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Program</Label>
            <div className="col-span-3">
              <Select
                onValueChange={setProgramCode}
                value={programCode}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select program..." />
                </SelectTrigger>
                <SelectContent>
                  {programs.map((prog) => (
                    <SelectItem key={prog.id} value={prog.program_code}>
                      {prog.program_code} - {prog.program_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Year Level */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Year</Label>
            <div className="col-span-3">
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
          </div>

          {/* Gender */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Gender</Label>
            <div className="col-span-3">
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
