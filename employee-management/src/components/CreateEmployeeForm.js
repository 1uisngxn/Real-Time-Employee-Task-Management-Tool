import { useState } from "react";

export default function CreateEmployeeForm({ onClose, onSuccess }) {
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "Employee",
    status: "Active",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newEmployee.name || !newEmployee.email) {
      alert("Please enter name and email");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/owner/CreateEmployee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEmployee),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onSuccess();
        onClose();
      } else {
        alert(data.error || "Create failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg p-8 w-[70%] max-w-4xl">
        <h3 className="text-3xl font-bold mb-6 text-gray-800">Create New Employee</h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Row 1: Name + Email */}
          <div className="flex gap-6">
            <div className="flex-1 flex flex-col">
              <label className="text-lg font-medium mb-2">Name</label>
              <input
                type="text"
                placeholder="Enter full name"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                className="border p-3 rounded text-lg"
                required
              />
            </div>
            <div className="flex-1 flex flex-col">
              <label className="text-lg font-medium mb-2">Email</label>
              <input
                type="email"
                placeholder="Enter email address"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                className="border p-3 rounded text-lg"
                required
              />
            </div>
          </div>

          {/* Row 2: Phone + Address */}
          <div className="flex gap-6">
            <div className="flex-1 flex flex-col">
              <label className="text-lg font-medium mb-2">Phone</label>
              <input
                type="text"
                placeholder="Enter phone number"
                value={newEmployee.phone}
                onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                className="border p-3 rounded text-lg"
              />
            </div>
            <div className="flex-1 flex flex-col">
              <label className="text-lg font-medium mb-2">Address</label>
              <input
                type="text"
                placeholder="Enter address"
                value={newEmployee.address}
                onChange={(e) => setNewEmployee({ ...newEmployee, address: e.target.value })}
                className="border p-3 rounded text-lg"
              />
            </div>
          </div>

          {/* Row 3: Role + Status */}
          <div className="flex gap-6">
            <div className="flex-1 flex flex-col">
              <label className="text-lg font-medium mb-2">Role</label>
              <select
                value={newEmployee.role}
                onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                className="border p-3 rounded text-lg"
              >
                <option value="Manager">Manager</option>
                <option value="Employee">Employee</option>
              </select>
            </div>
            <div className="flex-1 flex flex-col">
              <label className="text-lg font-medium mb-2">Status</label>
              <select
                value={newEmployee.status}
                onChange={(e) => setNewEmployee({ ...newEmployee, status: e.target.value })}
                className="border p-3 rounded text-lg"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border rounded-md text-lg text-gray-600 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-md text-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
