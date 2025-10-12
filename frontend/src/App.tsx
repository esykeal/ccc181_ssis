import { Outlet } from "react-router-dom";
import Sidebar from "@/layouts/Sidebar";

export default function App() {
  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
