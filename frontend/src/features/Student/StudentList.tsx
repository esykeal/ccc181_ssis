import type { Student } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

interface StudentListProps {
  students: Student[];
  loading: boolean;
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (column: string) => void;
  onRowClick?: (student: Student) => void;
}

export default function StudentList({
  students,
  loading,
  onEdit,
  onDelete,
  sortBy,
  sortOrder,
  onSort,
  onRowClick,
}: StudentListProps) {
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
                onClick={() => onSort("student_id")}
                className="flex items-center hover:text-black transition-colors font-medium"
              >
                ID
                {getSortIcon("student_id")}
              </button>
            </th>

            <th className="p-4 font-medium text-zinc-500">
              <button
                onClick={() => onSort("lastname")}
                className="flex items-center hover:text-black transition-colors font-medium"
              >
                Full Name
                {getSortIcon("lastname")}
              </button>
            </th>

            <th className="p-4 font-medium text-zinc-500">
              <button
                onClick={() => onSort("program_code")}
                className="flex items-center hover:text-black transition-colors font-medium"
              >
                Program
                {getSortIcon("program_code")}
              </button>
            </th>

            <th className="p-4 font-medium text-zinc-500">
              <button
                onClick={() => onSort("year")}
                className="flex items-center hover:text-black transition-colors font-medium"
              >
                Year
                {getSortIcon("year")}
              </button>
            </th>

            <th className="p-4 font-medium text-zinc-500">
              <button
                onClick={() => onSort("gender")}
                className="flex items-center hover:text-black transition-colors font-medium"
              >
                Gender
                {getSortIcon("gender")}
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
              <td colSpan={6} className="p-8 text-center text-zinc-500">
                Loading students...
              </td>
            </tr>
          )}

          {!loading && students.length === 0 && (
            <tr>
              <td colSpan={6} className="p-8 text-center text-zinc-500">
                No students found.
              </td>
            </tr>
          )}

          {!loading &&
            students.map((student) => (
              <tr
                key={student.id || student.student_id}
                className="border-b last:border-0 hover:bg-zinc-50 cursor-pointer transition-colors"
                onClick={() => onRowClick && onRowClick(student)}
              >
                <td className="p-4 font-medium font-mono">
                  {student.student_id}
                </td>
                <td className="p-4">
                  {student.lastname}, {student.firstname}
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800">
                    {student.program_code}
                  </span>
                </td>
                <td className="p-4">{student.year}</td>
                <td className="p-4">{student.gender}</td>

                <td className="p-4 text-right space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(student);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(student.student_id);
                    }}
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
