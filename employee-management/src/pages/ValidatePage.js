import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ValidatePage() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const phone = location.state?.phone || "";

  const API_URL = "http://localhost:5000/api/owner";

  // Xác minh OTP
  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/ValidateAccessCode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phone, accessCode: otp }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Login successful!");
        localStorage.setItem("phoneNumber", phone);
        navigate("/dashboard");
      } else {
        alert("Invalid OTP");
      }
    } catch (err) {
      alert("API error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Gửi lại mã OTP
  const handleResend = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/CreateNewAccessCode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phone }),
      });
      const data = await res.json();
      if (data.success) {
        alert("OTP re-sent! (mock: " + data.accessCode + ")");
      } else {
        alert("Error: " + data.message);
      }
    } catch (err) {
      alert("API error: " + err.message);
    } finally {
      setLoading(false);
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
          <h1 className="text-3xl font-extrabold text-gray-800 mb-1">
            Phone Verification
          </h1>
          <p className="text-sm text-gray-500">
            Please enter your code that was sent to your phone
          </p>
        </div>

        {/* Form nhập OTP */}
        <form onSubmit={handleVerify} className="space-y-6">
          <input
            type="text"
            placeholder="Enter your code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold shadow-md transition-transform transform hover:-translate-y-0.5 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-500 text-white hover:bg-orange-600"
            }`}
          >
            {loading ? "Processing..." : "Submit"}
          </button>
        </form>

        {/* Resend Code */}
        <p className="text-sm text-center text-gray-600 mt-6">
          Code not received?{" "}
          <button
            onClick={handleResend}
            disabled={loading}
            className="text-orange-500 font-semibold hover:underline"
          >
            Send again
          </button>
        </p>
      </div>
    </div>
  );
}

export default ValidatePage;
