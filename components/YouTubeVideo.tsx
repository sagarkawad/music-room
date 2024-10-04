"use client";

import React from "react";
import YouTube, { YouTubeEvent, YouTubeProps } from "react-youtube";

// Define the type for props, including sendMessage
interface YouTubeVideoProps {
  sendMessage: (time: number) => void;
}

const YouTubeVideo: React.FC<YouTubeVideoProps> = ({ sendMessage }: any) => {
  const onPlayerReady = (event: YouTubeEvent) => {
    // Access the player object and call methods if needed
    event.target.pauseVideo();
    console.log(event.target);
  };

  const onStateChange = (event: YouTubeEvent) => {
    console.log(event.target.playerInfo.currentTime);
    sendMessage(event.target.playerInfo.currentTime);
  };

  const opts: YouTubeProps["opts"] = {
    height: "390",
    width: "640",
    playerVars: {
      autoplay: 1, // Enable autoplay
    },
  };

  return (
    <YouTube
      videoId="cF1Na4AIecM"
      opts={opts}
      onReady={onPlayerReady}
      onStateChange={onStateChange}
    />
  );
};

export default YouTubeVideo;
