"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [roomName, setRoomName] = useState("");
  const router = useRouter();

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
      <button
        onClick={() => {
          router.push(`/room/${roomName}`);
        }}
        className="border rounded px-4 bg-green-700"
      >
        Create a room!
      </button>
    </div>
  );
}
