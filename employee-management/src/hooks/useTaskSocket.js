import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

let socket; // share single socket instance across hook calls

export default function useTaskSocket(onTaskUpdated) {
  const cbRef = useRef(onTaskUpdated);
  cbRef.current = onTaskUpdated;

  useEffect(() => {
    // tạo socket 1 lần
    if (!socket) {
      socket = io("http://localhost:5000", {
        transports: ["websocket", "polling"],
      });
    }

    const taskUpdateHandler = (task) => {
      if (cbRef.current) cbRef.current(task);
    };

    socket.on("connect", () => {
      console.log("socket connected:", socket.id);
    });

    socket.on("task:update", taskUpdateHandler);

    return () => {
      socket.off("task:update", taskUpdateHandler);
      // don't disconnect global socket here to allow reuse across components
    };
  }, []);
}
