import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("owner"); // clear session
    navigate("/chooseRole"); // redirect
  };

  return (
    <div className="flex justify-between items-center bg-white shadow px-6 py-3 relative">
      {/* Logo / Title Left */}
      <div className="text-xl font-bold text-orange-500">Skipli</div>

      {/* Right */}
      <div className="flex items-center space-x-6">
        <button className="text-gray-600 hover:text-blue-600 transition">
          🔔
        </button>

        {/* Avatar + Dropdown */}
        <div className="relative">
          <div
            onClick={() => setOpenMenu(!openMenu)}
            className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:shadow-md transition"
          >
            👤
          </div>

          {openMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-2 z-50">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-red-500 hover:text-white transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
