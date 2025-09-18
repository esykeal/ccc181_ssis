import { NavLink } from "react-router-dom";
import {
  School,
  Book,
  User,
  LayoutDashboard,
  FingerprintPattern,
} from "lucide-react";

function Sidebar({ children }: { children: React.ReactNode }) {
  const navItems = [
    { path: "/home", icon: <LayoutDashboard size={20} />, label: "Dashboard" }, // Changed
    { path: "/home/colleges", icon: <School size={20} />, label: "Colleges" }, // Changed
    { path: "/home/programs", icon: <Book size={20} />, label: "Programs" }, // Changed
    { path: "/home/students", icon: <User size={20} />, label: "Students" }, // Changed
  ];

  return (
    <div className="flex min-h-screen">
      {/* Fixed Left Sidebar */}
      <div className="w-64 bg-base-200 border-r border-base-300 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-base-300">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-content p-2 rounded-lg">
              <FingerprintPattern size={24} />
            </div>
            <div className="flex flex-col">
              <p className="text-xl font-bold">SSIS</p>
              <p className="text-xs text-gray-400">lorem ipsum</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded-xl transition text-xl hover:bg-base-300 ${
                  isActive ? "bg-base-300 font-semibold" : ""
                }`
              }
            >
              <span className="text-gray-400">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}

export default Sidebar;
