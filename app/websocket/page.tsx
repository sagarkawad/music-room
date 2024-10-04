"use client";

import { useEffect, useState } from "react";

const WebSocketComponent: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Establish WebSocket connection
    const ws = new WebSocket("ws://localhost:8080/");

    ws.onopen = () => {
      console.log("Connected to WebSocket");
    };

    ws.onmessage = (event: MessageEvent) => {};

    ws.onclose = () => {
      console.log("Disconnected from WebSocket");
    };

    setSocket(ws);

    // Clean up the WebSocket connection on component unmount
    return () => ws.close();
  }, []);

  const sendMessage = () => {
    if (socket) {
      socket.send(message);
    }
  };

  return (
    <div>
      <input
        type="text"
        className="text-black"
        onChange={(e) => {
          setMessage(e.target.value);
        }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default WebSocketComponent;
