import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import CreateEmployeeForm from "../components/CreateEmployeeForm";
import EmployeeFilterBar from "../components/Search";
import EditEmployeeForm from "../components/EditEmployeeForm";
import ConfirmDeleteModal from "../components/ConfirmDelete";

export default function DashboardPage() {
  const [activePage, setActivePage] = useState("Manage Employee");
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  // create
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // edit
  const [editEmployee, setEditEmployee] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // delete
  const [deleteEmployee, setDeleteEmployee] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [employees, searchQuery, filterRole, filterStatus]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "employees"));
      const employeeArray = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setEmployees(employeeArray);
    } catch (err) {
      console.error("Error fetching employees:", err.message);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "employees", id));
      fetchEmployees();
    } catch (err) {
      console.error("Delete error:", err.message);
    }
  };

  const applyFilters = () => {
    let temp = [...employees];
    if (searchQuery.trim() !== "") {
      const lowerSearch = searchQuery.toLowerCase();
      temp = temp.filter(
        (emp) =>
          emp.name.toLowerCase().includes(lowerSearch) ||
          emp.email.toLowerCase().includes(lowerSearch)
      );
    }
    if (filterRole !== "All") temp = temp.filter((emp) => emp.role === filterRole);
    if (filterStatus !== "All") temp = temp.filter((emp) => emp.status === filterStatus);
    setFilteredEmployees(temp);
  };

  const ManageEmployee = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Manage Employee</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2 border border-blue-600 rounded-md text-blue-600 hover:bg-blue-50 transition"
        >
          + Create Employee
        </button>
      </div>

      {/* Search & Filters */}
      <EmployeeFilterBar
        onSearch={(value) => setSearchQuery(value)}
        role={filterRole}
        status={filterStatus}
        onRoleChange={setFilterRole}
        onStatusChange={setFilterStatus}
        />

      {loading ? (
        <div className="flex justify-center items-center p-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600 border-b-4"></div>
        </div>
      ) : (
        <>
          <p className="mb-3 text-gray-600 font-bold">{filteredEmployees.length} Employee</p>
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
                {(Array.isArray(filteredEmployees) ? filteredEmployees : []).map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50 transition text-gray-700">
                    <td className="p-3 border-b">{emp.name}</td>
                    <td className="p-3 border-b">{emp.email}</td>
                    <td className="p-3 border-b">{emp.phone}</td>
                    <td className="p-3 border-b">{emp.role}</td>
                    <td className="p-3 border-b">
                      <span
                        className={`px-3 py-1 rounded-full text-white font-medium text-sm ${
                          emp.status === "Active" ? "bg-green-500" : "bg-red-500"
                        }`} 
                      >
                        {emp.status}
                      </span>
                    </td>
                    <td className="p-3 border-b flex gap-4">
                      <button
                        onClick={() => { setEditEmployee(emp); setShowEditModal(true); }}
                        className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => { setDeleteEmployee(emp); setShowDeleteModal(true); }}
                        className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredEmployees.length === 0 && !loading && (
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
          handleDelete(deleteEmployee.id);
          setShowDeleteModal(false);
        }}
      />

    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 overflow-y-auto">{activePage === "Manage Employee" && <ManageEmployee />}</div>
      </div>
    </div>
  );
}
