"use client";

import React, { useEffect, useRef, useState } from "react";
import YouTube, { YouTubeEvent, YouTubeProps } from "react-youtube";

import { useSearchParams } from "next/navigation";

let socket: any = null;
const yt = { current: null };
const YT_LOADING = -1;
const YT_BUFFERING = 3;
const YT_PLAYING = 1;
const YT_PAUSED = 2;

// const YT = {
//   current: {
//     getPlayerState: Function,
//     pauseVideo: Function,
//   },
// };

const page = ({ params }: { params: { slug: string } }) => {
  const [data, setData] = useState("");
  const isSeekingRef = useRef(false);
  let dataVar;
  const { slug: slug } = params;
  const searchParams = useSearchParams();
  const input = searchParams.get("input");

  useEffect(() => {
    // Create a new WebSocket connection to the server
    socket = new WebSocket("http://localhost:8080");

    socket.onopen = () => {
      console.log("WebSocket connection established");

      // Now you can send data
      // const data = "true 2";
      // socket.send(data);
    };

    // When a message is received from the server
    socket.onmessage = (event: any) => {
      console.log(event.data);
      setData(event.data);
      dataVar = event.data;
    };
  }, []);

  // Event handler for when the video is ready
  const onVideoReady: YouTubeProps["onReady"] = (event) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo(); // Example: Start the video in paused mode

    yt.current = event.target;
  };

  const frameCheck = (e: YouTubeEvent) => {
    socket.send(
      `${
        e.target.getPlayerState() == YT_PLAYING ||
        e.target.getPlayerState() == YT_BUFFERING
      } ${e.target.getCurrentTime()}`
    );
  };

  // Options for the YouTube player (optional)
  const opts: YouTubeProps["opts"] = {
    height: "390",
    width: "640",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  if (data != dataVar) {
    const parts = data.split(" ");
    if (parts[0] == "true") {
      //@ts-ignore
      yt.current.playVideo();

      if (!isSeekingRef.current) {
        isSeekingRef.current = true;
        //@ts-ignore
        yt.current.seekTo(Number(data[1]), true);
      }
    } else if (parts[0] == "false") {
      //@ts-ignore
      yt.current.pauseVideo();
    }
  }

  return (
    <div>
      <div>
        <h1>This is the room - {slug}</h1>
        <p>The video link is - {input}</p>
      </div>
      <h2>YouTube Video Frame</h2>

      <YouTube
        videoId={input}
        opts={opts}
        onReady={onVideoReady}
        onStateChange={frameCheck}
      />

      <h2>{data}</h2>
    </div>
  );
};

export default page;
