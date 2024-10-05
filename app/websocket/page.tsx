"use client";

import React, { useEffect, useState } from "react";
import YouTube, { YouTubeEvent, YouTubeProps } from "react-youtube";

const YouTubeFrame: React.FC = () => {
  useEffect(() => {
    // Create a new WebSocket connection to the server
    const socket = new WebSocket("http://localhost:8080");

    socket.onopen = () => {
      console.log("WebSocket connection established");

      // Now you can send data
      const data = "true 2";
      socket.send(data);
    };

    // When a message is received from the server
    socket.onmessage = (event) => {
      console.log(event.data);
    };
  }, []);

  const YT_LOADING = -1;
  const YT_BUFFERING = 3;
  const YT_PLAYING = 1;
  const YT_PAUSED = 2;

  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);

  // Event handler for when the video is ready
  const onVideoReady: YouTubeProps["onReady"] = (event) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo(); // Example: Start the video in paused mode
  };

  const frameCheck = (e: YouTubeEvent) => {
    setIsPlaying(e.target.getPlayerState() == YT_PLAYING);
    setTime(e.target.getCurrentTime());
  };

  const checkState = () => {
    console.log(time, isPlaying);
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

  return (
    <div>
      <h2>YouTube Video Frame</h2>
      <YouTube
        videoId="dQw4w9WgXcQ"
        opts={opts}
        onReady={onVideoReady}
        onStateChange={frameCheck}
      />
      <button onClick={checkState}>check state</button>
    </div>
  );
};

export default YouTubeFrame;
