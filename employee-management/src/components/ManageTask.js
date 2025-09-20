import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function ManageTask() {
  const [tasks, setTasks] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // ✅ Load tasks từ Firebase khi vào trang
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const querySnapshot = await getDocs(collection(db, "tasks"));
    const taskList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setTasks(taskList);
  };

  // ✅ Add new task vào Firestore
  const handleAddTask = async (task) => {
    const docRef = await addDoc(collection(db, "tasks"), {
      ...task,
      status: "Pending",
      createdAt: new Date(),
    });
    setTasks([...tasks, { id: docRef.id, ...task, status: "Pending" }]);
  };

  // ✅ Toggle status
  const handleToggle = async (task) => {
    const taskRef = doc(db, "tasks", task.id);
    const newStatus = task.status === "Pending" ? "Completed" : "Pending";
    await updateDoc(taskRef, { status: newStatus });
    setTasks(
      tasks.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
    );
  };

  // ✅ Delete task
  const handleDelete = async (taskId) => {
    await deleteDoc(doc(db, "tasks", taskId));
    setTasks(tasks.filter((t) => t.id !== taskId));
  };

  // ✅ Modal CreateTask
  const CreateTask = ({ onClose, onAdd }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [assignee, setAssignee] = useState("");
    const [employees, setEmployees] = useState([]);

    // Load employees từ Firestore
    useEffect(() => {
      const fetchEmployees = async () => {
        const querySnapshot = await getDocs(collection(db, "employees"));
        const empList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEmployees(empList);
      };
      fetchEmployees();
    }, []);

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!title.trim() || !assignee.trim()) {
        alert("Title and Assignee are required!");
        return;
      }

      const selectedEmp = employees.find((emp) => emp.id === assignee);

      const newTask = {
        title,
        description,
        assigneeId: selectedEmp.id,
        assigneeName: selectedEmp.name,
      };

      onAdd(newTask);
      onClose();
    };

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
          <h2 className="text-xl font-bold mb-4">Create Task</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border p-2 rounded"
            />

            {/* ✅ Select Assignee */}
            <select
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">-- Select Employee --</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Manage Task</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2 border border-blue-600 rounded-md text-blue-600 hover:bg-blue-50 transition"
        >
          + Create Task
        </button>
      </div>

      {/* Task List */}
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="w-full bg-white border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600 text-sm uppercase">
              <th className="p-3 border-b">Title</th>
              <th className="p-3 border-b">Description</th>
              <th className="p-3 border-b">Assignee</th>
              <th className="p-3 border-b">Status</th>
              <th className="p-3 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr
                key={task.id}
                className="hover:bg-gray-50 transition text-gray-700"
              >
                <td className="p-3 border-b">{task.title}</td>
                <td className="p-3 border-b">{task.description}</td>
                <td className="p-3 border-b">{task.assigneeName}</td>
                <td className="p-3 border-b">
                  <span
                    className={`px-3 py-1 rounded-full text-white font-medium text-sm ${
                      task.status === "Completed"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="p-3 border-b flex gap-2">
                  <button
                    onClick={() => handleToggle(task)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                  >
                    Toggle
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {tasks.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="text-center p-4 text-gray-500 italic"
                >
                  No tasks available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showCreateModal && (
        <CreateTask
          onClose={() => setShowCreateModal(false)}
          onAdd={handleAddTask}
        />
      )}
    </div>
  );
}
