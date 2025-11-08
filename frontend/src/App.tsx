import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/layouts/AppSidebar";

export default function App() {
  return (
    <div className="flex min-h-screen bg-zinc-50">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
