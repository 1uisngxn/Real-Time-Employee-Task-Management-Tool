import { useNavigate } from "react-router-dom";

export default function ChooseRole() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="bg-white shadow-2xl rounded-2xl px-10 py-12 w-full max-w-md border border-gray-100">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="px-5 py-2 rounded-xl bg-orange-500 text-white font-bold text-lg shadow-md tracking-wide">
            Skipli
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-1">
            Select Role
          </h1>
          <p className="text-sm text-gray-500">
            Please choose your role to continue
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-orange-600 transition-transform transform hover:-translate-y-0.5"
          >
            Sign in as Owner
          </button>

          <button
            onClick={() => navigate("/employee/login")}
            className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-green-600 transition-transform transform hover:-translate-y-0.5"
          >
            Sign in as Employee
          </button>
        </div>
      </div>
    </div>
  );
}
