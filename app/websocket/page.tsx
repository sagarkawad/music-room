"use client";

import { useEffect, useState } from "react";
import YouTubeVideo from "@/components/YouTubeVideo";

const WebSocketComponent: React.FC = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [timeValue, setTimeValue] = useState(0);

  useEffect(() => {
    // Establish WebSocket connection
    const ws = new WebSocket("https://music-room-t1yl.onrender.com/");

    ws.onopen = () => {
      console.log("Connected to WebSocket");
    };

    ws.onmessage = (event: MessageEvent) => {
      console.log(event.data);
      setTimeValue(event.data);
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
    <div className="flex flex-col justify-center items-center h-screen">
      <YouTubeVideo sendMessage={sendMessage} />
      <h1 className="mt-4">{timeValue}</h1>
    </div>
  );
};

export default WebSocketComponent;
