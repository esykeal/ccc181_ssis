import type { College } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

interface CollegeListProps {
  colleges: College[];
  loading: boolean;
  onEdit: (college: College) => void;
  onDelete: (code: string) => void;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (column: string) => void;
}

export default function CollegeList({
  colleges,
  loading,
  onEdit,
  onDelete,
  sortBy,
  sortOrder,
  onSort,
}: CollegeListProps) {
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
            <th className="p-4 font-medium text-zinc-500">
              <button
                onClick={() => onSort("college_code")}
                className="flex items-center hover:text-black transition-colors font-medium"
              >
                Code
                {getSortIcon("college_code")}
              </button>
            </th>

            <th className="p-4 font-medium text-zinc-500">
              <button
                onClick={() => onSort("college_name")}
                className="flex items-center hover:text-black transition-colors font-medium"
              >
                Name
                {getSortIcon("college_name")}
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
              <td colSpan={3} className="p-8 text-center text-zinc-500">
                Loading data...
              </td>
            </tr>
          )}

          {!loading && Array.isArray(colleges) && colleges.length === 0 && (
            <tr>
              <td colSpan={3} className="p-8 text-center text-zinc-500">
                No colleges found.
              </td>
            </tr>
          )}

          {!loading && !Array.isArray(colleges) && (
            <tr>
              <td colSpan={3} className="p-8 text-center text-red-500">
                Error: Invalid data received from server.
              </td>
            </tr>
          )}

          {!loading &&
            Array.isArray(colleges) &&
            colleges.map((college) => (
              <tr
                key={college.id || college.college_code}
                className="border-b last:border-0 hover:bg-zinc-50"
              >
                <td className="p-4 font-medium">{college.college_code}</td>
                <td className="p-4">{college.college_name}</td>
                <td className="p-4 text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(college)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(college.college_code)}
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
