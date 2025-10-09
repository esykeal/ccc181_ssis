import { useEffect, useState } from "react";
import api from "@/lib/api";
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

interface AddStudentDialogProps {
  onStudentAdded: () => void;
}

export default function AddStudentDialog({
  onStudentAdded,
}: AddStudentDialogProps) {
  const [open, setOpen] = useState(false);

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

  // 1. Fetch Programs for the dropdown
  useEffect(() => {
    api
      .get("/programs/")
      .then((res) => setPrograms(res.data))
      .catch((err) => console.error("Failed to load programs", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 2. Send Data
      await api.post("/student/", {
        student_id: studentId,
        firstname: firstName,
        lastname: lastName,
        program_code: programCode,
        year: parseInt(year), // Convert string "1" to number 1
        gender: gender,
      });

      // 3. Success Reset
      setOpen(false);
      setStudentId("");
      setFirstName("");
      setLastName("");
      setProgramCode("");
      setYear("");
      setGender("");
      onStudentAdded();
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to add student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">+ Add Student</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>
            Enroll a new student into a program.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

          {/* Student ID */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sid" className="text-right">
              ID Number
            </Label>
            <Input
              id="sid"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="YYYY-NNNN"
              className="col-span-3"
              required
            />
          </div>

          {/* First Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fname" className="text-right">
              First Name
            </Label>
            <Input
              id="fname"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="col-span-3"
              required
            />
          </div>

          {/* Last Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lname" className="text-right">
              Last Name
            </Label>
            <Input
              id="lname"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="col-span-3"
              required
            />
          </div>

          {/* Program Dropdown (Dynamic) */}
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

          {/* Year Level (Static) */}
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

          {/* Gender (Static) */}
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
              {loading ? "Saving..." : "Save Student"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
