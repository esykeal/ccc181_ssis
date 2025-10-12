import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Building2, BookOpen, Users } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <aside className="w-64 min-h-screen bg-white border-r flex flex-col">
      <div className="h-16 flex items-center gap-2 px-6 border-b">
        <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold">
          S
        </div>
        <span className="font-bold text-xl text-zinc-800">My SIS</span>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4 px-2">
          Menu
        </p>

        <Button
          asChild
          variant={path === "/" ? "secondary" : "ghost"}
          className="w-full justify-start gap-3"
        >
          <Link to="/">
            <Home className="h-4 w-4" />
            Dashboard
          </Link>
        </Button>

        <Button
          asChild
          variant={path === "/colleges" ? "secondary" : "ghost"}
          className="w-full justify-start gap-3"
        >
          <Link to="/colleges">
            <Building2 className="h-4 w-4" />
            Colleges
          </Link>
        </Button>

        <Button
          asChild
          variant={path === "/programs" ? "secondary" : "ghost"}
          className="w-full justify-start gap-3"
        >
          <Link to="/programs">
            <BookOpen className="h-4 w-4" />
            Programs
          </Link>
        </Button>

        <Button
          asChild
          variant={path === "/students" ? "secondary" : "ghost"}
          className="w-full justify-start gap-3"
        >
          <Link to="/students">
            <Users className="h-4 w-4" />
            Students
          </Link>
        </Button>
      </nav>
    </aside>
  );
}
