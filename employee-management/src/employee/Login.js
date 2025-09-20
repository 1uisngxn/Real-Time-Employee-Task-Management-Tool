import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import { query, collection, where, getDocs } from "firebase/firestore";
import bcrypt from "bcryptjs";

export default function EmployeeLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const q = query(collection(db, "employees"), where("username", "==", username));
      const snap = await getDocs(q);

      if (snap.empty) {
        setError("Account not found");
        return;
      }

      const employeeDoc = snap.docs[0];
      const employeeData = employeeDoc.data();

      const isMatch = await bcrypt.compare(password, employeeData.password);
      if (!isMatch) {
        setError("Incorrect password");
        return;
      }

      localStorage.setItem("employee", JSON.stringify({ id: employeeDoc.id, ...employeeData }));
      navigate("/employee/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred while logging in");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="relative bg-white shadow-2xl rounded-2xl px-10 py-12 w-full max-w-md border border-gray-100">
        {/* Back button */}
        <button
          onClick={() => navigate("/chooseRole")}
          className="absolute top-4 left-4 flex items-center text-gray-500 hover:text-blue-600 transition"
        >
          <span className="text-lg mr-1">←</span>
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-lg shadow-md tracking-wide">
            Skipli
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-1">Employee Login</h1>
          <p className="text-sm text-gray-500">Enter your credentials to continue</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-transform transform hover:-translate-y-0.5"
          >
            Login
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-8">
          Secure authentication with username & password.
        </p>
      </div>
    </div>
  );
}
