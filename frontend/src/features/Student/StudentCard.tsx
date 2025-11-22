import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, X } from "lucide-react";
import type { Student } from "@/types";

import defaultpfp from "@/assets/default_pfp.jpg";

interface StudentCardProps {
  student: Student | null;
  onClose?: () => void;
  onEdit?: (student: Student) => void;
  onDelete?: (id: string) => void;
}

export function StudenCardDetails({
  student,
  onClose,
  onEdit,
  onDelete,
}: StudentCardProps) {
  if (!student) return null;

  return (
    <Card className="w-full max-w-md mx-auto border shadow-sm relative overflow-hidden">
      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-8 w-8 text-zinc-400 hover:text-black rounded-full z-10"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      <CardHeader className="flex flex-col items-center pt-8 pb-2">
        {/* --- IMAGE DISPLAY LOGIC --- */}
        <Avatar className="h-32 w-32 border-4 border-white shadow-lg mb-4">
          <AvatarImage
            src={student.pfp_url || defaultpfp}
            className="object-cover"
          />
          <AvatarFallback className="text-2xl bg-slate-200">
            {/* 3. Fallback to Initials if all else fails */}
            {student.firstname[0]}
            {student.lastname[0]}
          </AvatarFallback>
        </Avatar>

        <CardTitle className="text-2xl font-bold text-center">
          {student.firstname} {student.lastname}
        </CardTitle>
        <div className="text-sm text-muted-foreground font-mono bg-zinc-100 px-2 py-0.5 rounded mt-1">
          {student.student_id}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 px-8">
        <div className="grid grid-cols-3 gap-4 text-center py-4 border-t border-b">
          <div>
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">
              Program
            </Label>
            <div className="font-medium text-lg text-blue-700">
              {student.program_code}
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">
              Year
            </Label>
            <div className="font-medium text-lg">{student.year}</div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">
              Gender
            </Label>
            <div className="font-medium text-lg">{student.gender}</div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-2 p-4 bg-zinc-50/50 mt-2">
        {onEdit && (
          <Button
            variant="outline"
            size="sm"
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 gap-2"
            onClick={() => onEdit(student)}
          >
            <Pencil className="h-3.5 w-3.5" /> Edit
          </Button>
        )}

        {onDelete && (
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 gap-2"
            onClick={() => onDelete(student.student_id)}
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
