import type { Program } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

interface ProgramListProps {
  programs: Program[];
  loading: boolean;
  onEdit: (program: Program) => void;
  onDelete: (code: string) => void;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (column: string) => void;
}

export default function ProgramList({
  programs,
  loading,
  onEdit,
  onDelete,
  sortBy,
  sortOrder,
  onSort,
}: ProgramListProps) {
  const getSortIcon = (column: string) => {
    if (sortBy !== column)
      return <ArrowUpDown className="ml-2 h-4 w-4 text-zinc-400" />;
    return sortOrder === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4 text-black" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4 text-black" />
    );
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-zinc-50 border-b">
          <tr>
            {/* Sortable Code Header */}
            <th className="p-4 font-medium text-zinc-500">
              <button
                onClick={() => onSort("program_code")}
                className="flex items-center hover:text-black transition-colors font-medium"
              >
                Code
                {getSortIcon("program_code")}
              </button>
            </th>

            {/* Sortable Name Header */}
            <th className="p-4 font-medium text-zinc-500">
              <button
                onClick={() => onSort("program_name")}
                className="flex items-center hover:text-black transition-colors font-medium"
              >
                Name
                {getSortIcon("program_name")}
              </button>
            </th>

            {/* Sortable College Header */}
            <th className="p-4 font-medium text-zinc-500">
              <button
                onClick={() => onSort("college_code")}
                className="flex items-center hover:text-black transition-colors font-medium"
              >
                College
                {getSortIcon("college_code")}
              </button>
            </th>

            <th className="p-4 font-medium text-zinc-500 text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={4} className="p-8 text-center text-zinc-500">
                Loading programs...
              </td>
            </tr>
          )}

          {!loading && programs.length === 0 && (
            <tr>
              <td colSpan={4} className="p-8 text-center text-zinc-500">
                No programs found.
              </td>
            </tr>
          )}

          {!loading &&
            programs.map((program) => (
              <tr
                key={program.id || program.program_code}
                className="border-b last:border-0 hover:bg-zinc-50"
              >
                <td className="p-4 font-medium">{program.program_code}</td>
                <td className="p-4">{program.program_name}</td>
                <td className="p-4">
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800">
                    {program.college_code}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(program)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(program.program_code)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
