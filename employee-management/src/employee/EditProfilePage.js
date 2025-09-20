import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Get employee from localStorage
  const savedEmployee = localStorage.getItem("employee");
  const employee = savedEmployee ? JSON.parse(savedEmployee) : null;
  const userId = employee?.id || null;

  useEffect(() => {
    async function fetchProfile() {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "employees", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfile(docSnap.data());
        }
      } catch (err) {
        console.error("❌ Lỗi lấy profile:", err);
      }

      setLoading(false);
    }
    fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      const docRef = doc(db, "employees", userId);
      await updateDoc(docRef, profile);

      // Update from localStorage
      localStorage.setItem(
        "employee",
        JSON.stringify({ id: userId, ...profile })
      );

      navigate("/employee/dashboard");
    } catch (err) {
      console.error("❌ Lỗi lưu profile:", err);
    }
    setSaving(false);
  };

  // Loading
  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">Loading...</div>
    );
  }

  // Check login
  if (!userId) {
    return (
      <div className="p-6 text-center text-red-600">
        Bạn chưa đăng nhập!
      </div>
    );
  }

  // Load form edit
  return (
    <div className="p-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 transition"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-1" />
          Quay lại
        </button>
      </div>

      {/* Card */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Edit Profile
        </h2>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={profile.phone || ""}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-blue-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </div>
  );
}
