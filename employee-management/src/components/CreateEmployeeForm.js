import { useState } from "react";
import { collection, addDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function CreateEmployeeForm({ onClose, onSuccess }) {
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "Staff",
    status: "Active",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newEmployee.name || !newEmployee.email) {
      alert("Please enter name and email");
      return;
    }
    try {
      await addDoc(collection(db, "employees"), {
        ...newEmployee,
        createdAt: new Date().toISOString(),
        employeeId: doc(collection(db, "employees")).id,
      });
      onSuccess(); // reload danh sách
      onClose();   // đóng modal
    } catch (err) {
      console.error("Error creating employee:", err.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg p-8 w-[70%] max-w-4xl">
        {/* Title */}
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
                <option value="Staff">Staff</option>
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
              className="px-6 py-3 bg-blue-600 text-white rounded-md text-lg hover:bg-blue-700 transition"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
