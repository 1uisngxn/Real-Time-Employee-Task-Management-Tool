import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function LoginPage() {
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const API_URL = "http://localhost:5000/api/owner"; // backend chạy ở 5000

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/CreateNewAccessCode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phone }),
      });
      const data = await res.json();
      if (data.success) {
        alert("OTP sent! (mock: " + data.accessCode + ")");
        // ✅ chuyển sang trang ValidatePage, truyền phone qua state
        navigate("/validate", { state: { phone } });
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      alert("API error: " + err.message);
    }
  };

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
          <h1 className="text-3xl font-extrabold text-gray-800 mb-1">Sign In</h1>
          <p className="text-sm text-gray-500">
            Please enter your phone number to sign in
          </p>
        </div>

        {/* Form nhập số điện thoại */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-orange-600 transition-transform transform hover:-translate-y-0.5"
          >
            Next
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-8">
          Passwordless authentication methods.
        </p>

        <p className="text-sm text-center text-gray-600 mt-4">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-orange-500 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
