import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ListFilter } from "lucide-react";
import type { StudentFilters } from "@/api/studentApi";

interface StudentFilterProps {
  currentFilters: StudentFilters;
  onApplyFilters: (filters: StudentFilters) => void;
}

export default function StudentFilter({
  currentFilters,
  onApplyFilters,
}: StudentFilterProps) {
  const [open, setOpen] = useState(false);
  const [programs, setPrograms] = useState<{ code: string; name: string }[]>(
    []
  );

  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);

  useEffect(() => {
    api
      .get("/programs/")
      .then((res) => {
        const data = res.data.data || res.data;
        if (Array.isArray(data)) {
          setPrograms(
            data.map((p: any) => ({
              code: p.program_code,
              name: p.program_name,
            }))
          );
        }
      })
      .catch((err) => console.error("Failed to load programs", err));
  }, []);

  useEffect(() => {
    if (open) {
      setSelectedPrograms(currentFilters.program || []);
      setSelectedYears(currentFilters.year || []);
      setSelectedGenders(currentFilters.gender || []);
    }
  }, [open, currentFilters]);

  const handleApply = () => {
    onApplyFilters({
      program: selectedPrograms,
      year: selectedYears,
      gender: selectedGenders,
    });
    setOpen(false);
  };

  const handleClear = () => {
    setSelectedPrograms([]);
    setSelectedYears([]);
    setSelectedGenders([]);
  };

  const toggleSelection = (
    list: string[],
    setList: (l: string[]) => void,
    value: string
  ) => {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value));
    } else {
      setList([...list, value]);
    }
  };

  const count =
    (currentFilters.program?.length || 0) +
    (currentFilters.year?.length || 0) +
    (currentFilters.gender?.length || 0);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 border-dashed px-3"
          aria-label="Filter"
        >
          <ListFilter className="h-4 w-4" />

          {count > 0 && (
            <span className="ml-1 rounded-full bg-black text-white text-[10px] h-5 w-5 flex items-center justify-center">
              {count}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Students</DialogTitle>
          <DialogDescription>
            Narrow down the list by Program, Year Level, or Gender.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4 px-1 max-h-[60vh] overflow-y-auto">
          <div className="space-y-3">
            <h4 className="font-medium leading-none">Year Level</h4>
            <div className="flex flex-wrap gap-4">
              {["1", "2", "3", "4"].map((y) => (
                <div key={y} className="flex items-center space-x-2">
                  <Checkbox
                    id={`year-${y}`}
                    checked={selectedYears.includes(y)}
                    onCheckedChange={() =>
                      toggleSelection(selectedYears, setSelectedYears, y)
                    }
                  />
                  <Label htmlFor={`year-${y}`}>{y} Year</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="h-[1px] bg-zinc-100" />

          <div className="space-y-3">
            <h4 className="font-medium leading-none">Gender</h4>
            <div className="flex flex-wrap gap-4">
              {["Male", "Female", "Other"].map((g) => (
                <div key={g} className="flex items-center space-x-2">
                  <Checkbox
                    id={`gender-${g}`}
                    checked={selectedGenders.includes(g)}
                    onCheckedChange={() =>
                      toggleSelection(selectedGenders, setSelectedGenders, g)
                    }
                  />
                  <Label htmlFor={`gender-${g}`}>{g}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="h-[1px] bg-zinc-100" />

          <div className="space-y-3">
            <h4 className="font-medium leading-none">Program</h4>
            <div className="grid grid-cols-2 gap-3">
              {programs.map((prog) => (
                <div key={prog.code} className="flex items-center space-x-2">
                  <Checkbox
                    id={`prog-${prog.code}`}
                    checked={selectedPrograms.includes(prog.code)}
                    onCheckedChange={() =>
                      toggleSelection(
                        selectedPrograms,
                        setSelectedPrograms,
                        prog.code
                      )
                    }
                  />
                  <Label
                    htmlFor={`prog-${prog.code}`}
                    className="text-sm font-normal"
                  >
                    {prog.code}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex sm:justify-between gap-2">
          <Button
            variant="ghost"
            onClick={handleClear}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            Clear Filters
          </Button>
          <Button onClick={handleApply}>Apply Filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
