import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export function MasterLayout() {
  return (
    <div className="min-h-screen">
      <Sidebar>
        <Outlet />
      </Sidebar>
    </div>
  );
}
