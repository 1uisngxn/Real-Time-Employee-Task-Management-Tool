import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

export default function MessageBox({ ownerId, employees }) {
  const [socket, setSocket] = useState(null);
  const [activeEmp, setActiveEmp] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const msgRef = useRef(null);

  useEffect(() => {
    const s = io(SOCKET_URL, { transports: ["websocket"] });
    setSocket(s);

    s.on("connect", () => {
      console.log("Owner socket connected", s.id);
      s.emit("join", { userId: ownerId, role: "owner" });
    });

    // Lấy history khi join room
    s.on("history", ({ room, messages: msgs }) => {
      console.log("📜 history received", msgs);
      setMessages(msgs || []);
    });

    // Nhận tin nhắn mới
    s.on("newMessage", ({ room, message }) => {
      console.log("📩 newMessage", message);
      setMessages((prev) => [...prev, message]);
    });

    return () => s.disconnect();
  }, [ownerId]);

  useEffect(() => {
    if (msgRef.current) {
      msgRef.current.scrollTop = msgRef.current.scrollHeight;
    }
  }, [messages]);

  const openChat = (emp) => {
    setActiveEmp(emp);
    if (socket) {
      setMessages([]);
      socket.emit("joinRoom", { ownerId, empId: emp.id });
    }
  };

  const send = () => {
    if (!input.trim() || !activeEmp) return;
    const payload = {
      ownerId,
      empId: activeEmp.id,
      fromId: ownerId,
      toId: activeEmp.id,
      text: input.trim(),
    };
    socket.emit("sendMessage", payload);
    setInput("");
  };

  return (
    <div className="flex gap-4 h-full">
      {/* Left: employees */}
      <div className="w-1/4 bg-white shadow rounded p-4 overflow-auto">
        <h3 className="font-semibold mb-3">Employees</h3>
        <ul className="space-y-2">
          {employees.map((emp) => (
            <li
              key={emp.id || emp.employeeId}
              className={`p-2 rounded cursor-pointer ${
                activeEmp && (emp.id || emp.employeeId) === activeEmp.id
                  ? "bg-blue-50"
                  : "hover:bg-gray-50"
              }`}
              onClick={() =>
                openChat({ id: emp.id || emp.employeeId, name: emp.name })
              }
            >
              <div className="font-medium">{emp.name}</div>
              <div className="text-xs text-gray-500">{emp.email}</div>
            </li>
          ))}
        </ul>
      </div>

      {/* Right: chat */}
      <div className="flex-1 bg-white shadow rounded p-4 flex flex-col">
        {!activeEmp ? (
          <div className="text-center text-gray-500">
            Select an employee to start chat
          </div>
        ) : (
          <>
            <div className="border-b pb-3 mb-3">
              <div className="font-semibold">{activeEmp.name}</div>
              <div className="text-xs text-gray-500">Chat with employee</div>
            </div>

            <div ref={msgRef} className="flex-1 overflow-auto space-y-3 px-2">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`max-w-2/3 p-3 rounded ${
                    m.fromId === ownerId
                      ? "bg-blue-600 text-white self-end"
                      : "bg-gray-100 text-gray-800 self-start"
                  }`}
                  style={{
                    alignSelf:
                      m.fromId === ownerId ? "flex-end" : "flex-start",
                  }}
                >
                  <div className="text-sm">{m.text}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {m.ts
                      ? new Date(m.ts).toLocaleString()
                      : new Date().toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 border rounded p-2"
                placeholder="Type a message..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") send();
                }}
              />
              <button
                onClick={send}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
