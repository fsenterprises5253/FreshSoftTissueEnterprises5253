import React from "react";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, FileText, LogOut } from "lucide-react";
import logo from "@/assets/logo.png";

interface SidebarProps {
  collapsed?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed = false }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("auth");
    navigate("/login");
  };

  return (
    <aside
      className={`flex flex-col h-full bg-white border-r transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >

      {/* Navigation Section */}
      <nav className="flex-1 space-y-2 px-4 mt-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 w-full p-3 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-600"
        >
          <LayoutGrid size={18} />
          {!collapsed && "Dashboard"}
        </button>

        <button
          onClick={() => {
            navigate("/billing");
            window.dispatchEvent(new Event("billing-navigation"));
          }}
          className="flex items-center gap-3 w-full p-3 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-600"
        >
          <FileText size={18} />
          {!collapsed && "Billing"}
        </button>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full p-3 rounded-lg text-gray-700 hover:bg-red-100 hover:text-red-600 transition"
        >
          <LogOut size={18} />
          {!collapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
