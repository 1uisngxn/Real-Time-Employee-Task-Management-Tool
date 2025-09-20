import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ManageEmployee from "../components/ManageEmployee";
import ManageTask from "../components/ManageTask";
import MessageBox from "../admin/MessageBox";
import { db } from "../firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";

export default function OwnerDashboard() {
  const [activePage, setActivePage] = useState("Manage Employee");
  const [employees, setEmployees] = useState([]);
  const ownerId = localStorage.getItem("ownerId") || "owner_default";

  useEffect(() => {
    // List Employee
    const unsub = onSnapshot(collection(db, "employees"), (snap) => {
      setEmployees(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header />

        <div className="flex-1 overflow-y-auto p-6">
          {activePage === "Manage Employee" && (
            <ManageEmployee employees={employees} />
          )}
          {activePage === "Manage Task" && <ManageTask />}
          {activePage === "Message" && (
            <MessageBox ownerId={ownerId} employees={employees} /> 
          )}
        </div>
      </div>
    </div>
  );
}
