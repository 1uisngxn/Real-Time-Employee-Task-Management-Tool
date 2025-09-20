import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // lấy setupToken từ query (nếu có)
  const query = new URLSearchParams(location.search);
  const setupToken = query.get("setupToken");

  const API_URL = "http://localhost:5000/api/employee";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/LoginEmail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        alert("OTP sent to email!");
        // chuyển sang trang nhập OTP, kèm theo setupToken (nếu có)
        navigate("/employee/validate", { state: { email, setupToken } });
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      alert("API error: " + err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Next
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
