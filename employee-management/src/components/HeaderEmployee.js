import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDownIcon, UserIcon } from "@heroicons/react/24/outline";

export default function HeaderEmployee() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [employee, setEmployee] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 🔎 Lấy thông tin employee từ localStorage (do đã lưu khi login)
    const savedEmployee = localStorage.getItem("employee");
    if (savedEmployee) {
      setEmployee(JSON.parse(savedEmployee));
    }
  }, []);

  const handleLogout = () => {
    // ❌ Xóa session login
    localStorage.removeItem("employee");
    navigate("/employee/login");
  };

  return (
    <header className="flex items-center justify-between bg-white shadow px-6 py-4">
      <div className="text-xl font-bold text-gray-800">Employee Dashboard</div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center space-x-2 hover:bg-gray-50 px-3 py-2 rounded-lg transition"
        >
          <div className="p-2 bg-gray-100 rounded-full border border-gray-300">
            <UserIcon className="w-5 h-5 text-gray-600" />
          </div>
          <span className="hidden md:block text-gray-800 font-medium">
            {/* ✅ Ưu tiên username -> name -> fallback Khách */}
            {employee?.username || employee?.name || "Khách"}
          </span>
          <ChevronDownIcon
            className={`w-4 h-4 text-gray-500 transition-transform ${
              dropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-lg z-50 overflow-hidden">
            <button
              onClick={() => navigate("/edit-profile")}
              className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100"
            >
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
