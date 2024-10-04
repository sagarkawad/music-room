"use client";

import { useEffect, useState } from "react";
import YouTubeVideo from "@/components/YouTubeVideo";

const WebSocketComponent: React.FC = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Establish WebSocket connection
    const ws = new WebSocket("ws://localhost:8080/");

    ws.onopen = () => {
      console.log("Connected to WebSocket");
    };

    ws.onmessage = (event: MessageEvent) => {
      console.log(event.data);
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket");
    };

    setSocket(ws);

    // Clean up the WebSocket connection on component unmount
    return () => ws.close();
  }, []);

  const sendMessage = (time: number) => {
    if (socket) {
      socket.send(time + "");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <YouTubeVideo sendMessage={sendMessage} />
    </div>
  );
};

export default WebSocketComponent;
