import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // setupToken from query param
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
        navigate("/employee/validate", { state: { email, setupToken } });
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      alert("API error: " + err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-md">
        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-blue-600 mb-6"
        >
          ← <span className="ml-1 text-sm">Back</span>
        </button>

        {/* Title */}
        <h1 className="text-3xl p-3 font-extrabold text-center text-gray-800">
          Sign In
        </h1>
        <p className="text-gray-500 text-center text-base ">
          Please enter your email to sign in
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <label htmlFor="email" className="sr-only">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="Your Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-5 py-3 border rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          >
            Next
          </button>
        </form>

        {/* Extra info */}
        <p className="text-gray-500 text-sm text-center mt-5">
          passwordless authentication methods.
        </p>

        {/* Footer */}
        <p className="text-center text-sm mt-6 text-gray-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
