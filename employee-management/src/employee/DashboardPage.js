import { useState, useEffect } from "react";
import Sidebar from "../components/SidebarEmployee";
import Header from "../components/HeaderEmployee";
import { db } from "../firebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import EmployeeChat from "../employee/EmployeeChat"; // ✅ import chat

export default function EmployeeDashboard() {
  const [activePage, setActivePage] = useState("Manage Task");
  const [employee, setEmployee] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // 🔎 Lấy employee từ localStorage sau khi login
    const savedEmployee = localStorage.getItem("employee");
    if (savedEmployee) {
      const emp = JSON.parse(savedEmployee);
      setEmployee(emp);

      // ✅ Lấy tasks assign cho employee này
      const q = query(
        collection(db, "tasks"),
        where("assigneeId", "==", emp.id) // ⚡️ field trùng với ManageTask
      );
      const unsub = onSnapshot(q, (snapshot) => {
        setTasks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      });
      return () => unsub();
    }
  }, []);

  // ✅ Mark task Done
  const markDone = async (taskId) => {
    const ref = doc(db, "tasks", taskId);
    await updateDoc(ref, { status: "done", doneAt: serverTimestamp() });
  };

  // ✅ Reset task về pending
  const resetTask = async (taskId) => {
    const ref = doc(db, "tasks", taskId);
    await updateDoc(ref, { status: "Pending", doneAt: null });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <Header employee={employee} />

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activePage === "Manage Task" && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                My Tasks
              </h2>

              <div className="space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white shadow p-4 rounded flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-semibold text-lg">{task.title}</h3>
                      <p className="text-gray-600">{task.description}</p>
                      <p
                        className={`text-sm font-medium ${
                          task.status === "done"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        Status: {task.status}
                      </p>

                      {task.status === "done" && task.doneAt && (
                        <p className="text-xs text-gray-500">
                          Done at:{" "}
                          {task.doneAt.toDate().toLocaleString()}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {task.status === "Pending" && (
                        <button
                          onClick={() => markDone(task.id)}
                          className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                        >
                          Done
                        </button>
                      )}
                      {task.status === "done" && (
                        <button
                          onClick={() => resetTask(task.id)}
                          className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {tasks.length === 0 && (
                  <p className="text-gray-500">
                    You don&apos;t have any tasks assigned yet.
                  </p>
                )}
              </div>
            </div>
          )}

          {activePage === "Message" && employee && (
            <div className="h-full">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                Message
              </h2>
              <EmployeeChat employee={employee} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
