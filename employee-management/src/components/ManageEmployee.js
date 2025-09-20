import { useEffect, useState } from "react";
import CreateEmployeeForm from "./CreateEmployeeForm";
import EmployeeFilterBar from "./Search";
import EditEmployeeForm from "./EditEmployeeForm";
import ConfirmDeleteModal from "./ConfirmDelete";

export default function ManageEmployee({ employees: employeesProp }) {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteEmployee, setDeleteEmployee] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // fetch nếu không có props
  useEffect(() => {
    if (employeesProp && employeesProp.length >= 0) {
      setEmployees(employeesProp);
      setLoading(false);
    } else {
      fetchEmployees();
    }
  }, [employeesProp]);

  useEffect(() => {
    applyFilters();
  }, [employees, searchQuery, filterRole, filterStatus]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/owner/GetEmployees");
      const data = await res.json();
      if (res.ok) setEmployees(data.employees || []);
      else setEmployees([]);
    } catch (err) {
      console.error("Fetch employees error:", err);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;
    try {
      const res = await fetch("http://localhost:5000/api/owner/DeleteEmployee", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId: id }),
      });
      const data = await res.json();
      if (res.ok && data.success) fetchEmployees();
      else alert(data.error || "Delete failed");
    } catch (err) {
      console.error("Delete employee error:", err);
      alert("Server error during delete");
    }
  };

  const applyFilters = () => {
    let temp = [...employees];
    if (searchQuery.trim() !== "") {
      const lowerSearch = searchQuery.toLowerCase();
      temp = temp.filter(
        (emp) =>
          emp.name?.toLowerCase().includes(lowerSearch) ||
          emp.email?.toLowerCase().includes(lowerSearch)
      );
    }
    if (filterRole !== "All") temp = temp.filter((emp) => emp.role === filterRole);
    if (filterStatus !== "All") temp = temp.filter((emp) => emp.status === filterStatus);
    setFilteredEmployees(temp);
  };

  return (
    <div className="p-6">
      {/* header + button */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Manage Employee</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2 border border-blue-600 rounded-md text-blue-600 hover:bg-blue-50 transition"
        >
          + Create Employee
        </button>
      </div>

      {/* filter bar */}
      <EmployeeFilterBar
        onSearch={(value) => setSearchQuery(value)}
        role={filterRole}
        status={filterStatus}
        onRoleChange={setFilterRole}
        onStatusChange={setFilterStatus}
      />

      {/* table */}
      {loading ? (
        <div className="flex justify-center items-center p-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600 border-b-4"></div>
        </div>
      ) : (
        <>
          <p className="mb-3 text-gray-600 font-bold">
            {filteredEmployees.length} Employee
          </p>
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="w-full bg-white border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-gray-600 text-sm uppercase">
                  <th className="p-3 border-b">Name</th>
                  <th className="p-3 border-b">Email</th>
                  <th className="p-3 border-b">Phone</th>
                  <th className="p-3 border-b">Role</th>
                  <th className="p-3 border-b">Status</th>
                  <th className="p-3 border-b">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp) => (
                  <tr
                    key={emp.employeeId || emp.id}
                    className="hover:bg-gray-50 transition text-gray-700"
                  >
                    <td className="p-3 border-b">{emp.name}</td>
                    <td className="p-3 border-b">{emp.email}</td>
                    <td className="p-3 border-b">{emp.phone}</td>
                    <td className="p-3 border-b">{emp.role}</td>
                    <td className="p-3 border-b">{emp.status}</td>
                    <td className="p-3 border-b flex gap-4">
                      <button
                        onClick={() => {
                          setEditEmployee(emp);
                          setShowEditModal(true);
                        }}
                        className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setDeleteEmployee(emp);
                          setShowDeleteModal(true);
                        }}
                        className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredEmployees.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center p-4 text-gray-500">
                      No employees found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* modals */}
      {showCreateModal && (
        <CreateEmployeeForm
          onClose={() => setShowCreateModal(false)}
          onSuccess={fetchEmployees}
        />
      )}
      {showEditModal && editEmployee && (
        <EditEmployeeForm
          employee={editEmployee}
          onClose={() => setShowEditModal(false)}
          onSuccess={fetchEmployees}
        />
      )}
      <ConfirmDeleteModal
        visible={showDeleteModal}
        itemName={deleteEmployee?.name}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          handleDelete(deleteEmployee.employeeId || deleteEmployee.id);
          setShowDeleteModal(false);
        }}
      />
    </div>
  );
}
