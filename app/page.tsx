"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Home() {
  const [roomName, setRoomName] = useState("");
  const [video, setVideo] = useState("");
  const router = useRouter();

  const pushToDB = async (link: string) => {
    try {
      // Send POST request to the API route using Axios
      const response = await axios.post("/api/link", {
        link,
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex flex-col p-4 items-center justify-center h-screen">
      <h1 className="text-xl text-center mb-4">
        Create your own unique room in just a click.
      </h1>
      <input
        type="text"
        placeholder="Name your room"
        className="px-4 mb-4 text-black"
        onChange={(e) => {
          setRoomName(e.target.value);
        }}
      />
      <input
        type="text"
        placeholder="Youtube video link here..."
        className="px-4 mb-4 text-black"
        onChange={(e) => {
          setVideo(e.target.value);
        }}
      />
      <button
        onClick={async () => {
          await pushToDB(
            `/room/${roomName}?input=${video.split("=")[1].split("&")[0]}`
          );
          router.push(
            `/room/${roomName}?input=${video.split("=")[1].split("&")[0]}`
          );
          console.log(
            `/room/${roomName}?input=${video.split("=")[1].split("&")[0]}`
          );
        }}
        className="border rounded px-4 bg-green-700"
      >
        Create a room!
      </button>
    </div>
  );
}
