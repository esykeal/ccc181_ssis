import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ListFilter, Loader2 } from "lucide-react";
import type { StudentFilters } from "@/api/studentApi";

interface StudentFilterProps {
  currentFilters: StudentFilters;
  onApplyFilters: (filters: StudentFilters) => void;
}

interface Program {
  code: string;
  name: string;
}

const YEAR_LEVELS = ["1", "2", "3", "4"];
const GENDERS = ["Male", "Female", "Other"];

export default function StudentFilter({
  currentFilters,
  onApplyFilters,
}: StudentFilterProps) {
  const [open, setOpen] = useState(false);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);

  useEffect(() => {
    if (!open || programs.length > 0) return;

    const fetchPrograms = async () => {
      setLoading(true);
      try {
        const res = await api.get("/programs/");
        const data = res.data.data || res.data;

        if (Array.isArray(data)) {
          const formatted = data.map((p: any) => ({
            code: p.program_code || p.code,
            name: p.program_name || p.name,
          }));
          setPrograms(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch programs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [open, programs.length]);

  useEffect(() => {
    if (open) {
      setSelectedPrograms(currentFilters.program || []);
      setSelectedYears(currentFilters.year || []);
      setSelectedGenders(currentFilters.gender || []);
    }
  }, [open, currentFilters]);

  const toggleArrayValue = <T,>(array: T[], value: T): T[] => {
    return array.includes(value)
      ? array.filter((item) => item !== value)
      : [...array, value];
  };

  const handleApply = () => {
    const newFilters: StudentFilters = {
      program: selectedPrograms.length ? selectedPrograms : undefined,
      year: selectedYears.length ? selectedYears : undefined,
      gender: selectedGenders.length ? selectedGenders : undefined,
    };

    onApplyFilters(newFilters);
    setOpen(false);
  };

  const handleClear = () => {
    setSelectedPrograms([]);
    setSelectedYears([]);
    setSelectedGenders([]);
  };

  const activeFilterCount = [
    ...(currentFilters.program || []),
    ...(currentFilters.year || []),
    ...(currentFilters.gender || []),
  ].length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="relative gap-2 border px-3"
          aria-label="Filter students"
        >
          <ListFilter className="h-4 w-4" />
          Filter
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs text-white">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Students</DialogTitle>
        </DialogHeader>

        <div className="max-h-[60vh] space-y-6 overflow-y-auto py-4 px-1">
          <div className="space-y-3">
            <h4 className="font-medium">Year Level</h4>
            <div className="flex flex-wrap gap-3">
              {YEAR_LEVELS.map((year) => (
                <div key={year} className="flex items-center gap-2">
                  <Checkbox
                    id={`year-${year}`}
                    checked={selectedYears.includes(year)}
                    onCheckedChange={() =>
                      setSelectedYears((prev) => toggleArrayValue(prev, year))
                    }
                  />
                  <Label htmlFor={`year-${year}`} className="cursor-pointer">
                    Year {year}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-border" />

          <div className="space-y-3">
            <h4 className="font-medium">Gender</h4>
            <div className="flex flex-wrap gap-3">
              {GENDERS.map((gender) => (
                <div key={gender} className="flex items-center gap-2">
                  <Checkbox
                    id={`gender-${gender}`}
                    checked={selectedGenders.includes(gender)}
                    onCheckedChange={() =>
                      setSelectedGenders((prev) =>
                        toggleArrayValue(prev, gender)
                      )
                    }
                  />
                  <Label
                    htmlFor={`gender-${gender}`}
                    className="cursor-pointer"
                  >
                    {gender}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-border" />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Program</h4>
              {loading && (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>

            {programs.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {programs.map((prog) => (
                  <div key={prog.code} className="flex items-center gap-2">
                    <Checkbox
                      id={`prog-${prog.code}`}
                      checked={selectedPrograms.includes(prog.code)}
                      onCheckedChange={() =>
                        setSelectedPrograms((prev) =>
                          toggleArrayValue(prev, prog.code)
                        )
                      }
                    />
                    <Label
                      htmlFor={`prog-${prog.code}`}
                      className="cursor-pointer text-sm"
                      title={prog.name}
                    >
                      {prog.code}
                    </Label>
                  </div>
                ))}
              </div>
            ) : !loading ? (
              <p className="text-sm text-muted-foreground">No programs found</p>
            ) : null}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClear}
            disabled={
              !selectedPrograms.length &&
              !selectedYears.length &&
              !selectedGenders.length
            }
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            Clear all
          </Button>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleApply}>Apply filters</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
