import { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function EditEmployeeForm({ employee, onClose, onSuccess }) {
  const [updatedEmployee, setUpdatedEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "Employee",
    status: "Active",
  });

  useEffect(() => {
    if (employee) {
      setUpdatedEmployee({
        name: employee.name || "",
        email: employee.email || "",
        phone: employee.phone || "",
        address: employee.address || "",
        role: employee.role || "Employee",
        status: employee.status || "Active",
      });
    }
  }, [employee]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!updatedEmployee.name || !updatedEmployee.email) {
      alert("Please enter name and email");
      return;
    }

    if (!employee?.employeeId) {
      alert("Employee ID missing!");
      console.error("❌ employeeId is undefined in employee object:", employee);
      return;
    }

    try {
      await updateDoc(doc(db, "employees", employee.employeeId), {
        ...updatedEmployee,
      });

      console.log("✅ Employee updated:", updatedEmployee);

      if (typeof onSuccess === "function") onSuccess(); // reload danh sách
      if (typeof onClose === "function") onClose();     // đóng modal
    } catch (err) {
      console.error("❌ Error updating employee:", err);
      alert("Update failed: " + err.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h3 className="text-lg font-bold mb-4">Edit Employee</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Name"
            value={updatedEmployee.name}
            onChange={(e) =>
              setUpdatedEmployee({ ...updatedEmployee, name: e.target.value })
            }
            className="border p-2 rounded"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={updatedEmployee.email}
            onChange={(e) =>
              setUpdatedEmployee({ ...updatedEmployee, email: e.target.value })
            }
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Phone"
            value={updatedEmployee.phone}
            onChange={(e) =>
              setUpdatedEmployee({ ...updatedEmployee, phone: e.target.value })
            }
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Address"
            value={updatedEmployee.address}
            onChange={(e) =>
              setUpdatedEmployee({ ...updatedEmployee, address: e.target.value })
            }
            className="border p-2 rounded"
          />
          <select
            value={updatedEmployee.role}
            onChange={(e) =>
              setUpdatedEmployee({ ...updatedEmployee, role: e.target.value })
            }
            className="border p-2 rounded"
          >
            <option value="Manager">Manager</option>
            <option value="Employee">Employee</option>
          </select>
          <select
            value={updatedEmployee.status}
            onChange={(e) =>
              setUpdatedEmployee({ ...updatedEmployee, status: e.target.value })
            }
            className="border p-2 rounded"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
