// EmployeeChat.js
import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

export default function EmployeeChat({ employee }) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const msgRef = useRef(null);

  const ownerId = localStorage.getItem("ownerId") || "owner_default";

  useEffect(() => {
    const s = io(SOCKET_URL, { transports: ["websocket"] });
    setSocket(s);

    s.on("connect", () => {
      console.log("✅ Employee socket connected", s.id);
      s.emit("join", { userId: employee.id, role: "employee" });
      s.emit("joinRoom", { ownerId, empId: employee.id });
    });

    s.on("history", ({ room, messages: msgs }) => {
      console.log("📜 history received", msgs);
      setMessages(msgs || []);
    });

    s.on("newMessage", ({ room, message }) => {
      console.log("📩 newMessage", message);
      setMessages((prev) => [...prev, message]);
    });

    return () => s.disconnect();
  }, [employee?.id]);

  useEffect(() => {
    if (msgRef.current) {
      msgRef.current.scrollTop = msgRef.current.scrollHeight;
    }
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    socket.emit("sendMessage", {
      ownerId,
      empId: employee.id,
      fromId: employee.id,
      toId: ownerId,
      text: input.trim(),
    });
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-white p-4 rounded shadow">
      <div className="font-semibold mb-2">Chat with Owner</div>

      <div ref={msgRef} className="flex-1 overflow-auto space-y-3 mb-3">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`max-w-2/3 p-2 rounded ${
              m.fromId === employee.id
                ? "bg-blue-600 text-white self-end"
                : "bg-gray-100 text-gray-800 self-start"
            }`}
            style={{
              alignSelf: m.fromId === employee.id ? "flex-end" : "flex-start",
            }}
          >
            <div>{m.text}</div>
            <div className="text-xs text-gray-400 mt-1">
              {m.ts
                ? new Date(m.ts).toLocaleString()
                : new Date().toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
          className="flex-1 border rounded p-2"
          placeholder="Type..."
        />
        <button
          onClick={send}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
