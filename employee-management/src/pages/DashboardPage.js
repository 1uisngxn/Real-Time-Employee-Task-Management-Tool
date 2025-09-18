import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function Dashboard() {
  const [activePage, setActivePage] = useState("Manage Employee");
  const [employees, setEmployees] = useState([
    { id: 1, name: "Employee 1", email: "123@gmail.com", status: "Active" },
    { id: 2, name: "Employee 2", email: "456@gmail.com", status: "Active" },
  ]);

  const handleDelete = (id) => {
    setEmployees(employees.filter((e) => e.id !== id));
  };

  // ManageEmployee UI gom vào Dashboard luôn
  const ManageEmployee = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Employee</h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 border rounded-md text-blue-600 hover:bg-blue-50 transition">
            + Create Employee
          </button>
          <button className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100 transition">
            🔍 Filter
          </button>
        </div>
      </div>

      <p className="mb-3 text-gray-600">{employees.length} Employee</p>

      <table className="w-full bg-white border rounded-lg shadow-sm overflow-hidden">
        <thead>
          <tr className="bg-gray-100 text-left text-gray-600 text-sm uppercase">
            <th className="p-3 border">Employee Name</th>
            <th className="p-3 border">Email</th>
            <th className="p-3 border">Status</th>
            <th className="p-3 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id} className="hover:bg-gray-50 transition text-gray-700">
              <td className="p-3 border">{emp.name}</td>
              <td className="p-3 border">{emp.email}</td>
              <td className="p-3 border">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  {emp.status}
                </span>
              </td>
              <td className="p-3 border flex gap-2">
                <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(emp.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 overflow-y-auto">
          {activePage === "Manage Employee" && <ManageEmployee />}
          {activePage === "Manage Task" && (
            <div className="p-6 text-gray-600">📋 Manage Task Page (coming soon...)</div>
          )}
          {activePage === "Message" && (
            <div className="p-6 text-gray-600">💬 Message Page (coming soon...)</div>
          )}
        </div>
      </div>
    </div>
  );
}
