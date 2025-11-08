import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Building2, BookOpen, Users, LogOut, User } from "lucide-react";
import { useAuthContext } from "@/features/Auth/AuthContext";

export function AppSidebar() {
  const location = useLocation();
  const path = location.pathname;
  const { auth, logout } = useAuthContext();

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

      {/* FOOTER */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="h-8 w-8 bg-zinc-100 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-zinc-500" />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">
              {auth.user?.username || "User"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {auth.user?.email}
            </p>
          </div>
        </div>

        <Button
          onClick={logout}
          variant="outline"
          className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
