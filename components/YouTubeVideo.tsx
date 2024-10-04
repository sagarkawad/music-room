"use client";

import React from "react";
import YouTube, { YouTubeEvent, YouTubeProps } from "react-youtube";
import { useRef } from "react";

// Define the type for props, including sendMessage
interface YouTubeVideoProps {
  sendMessage: (time: number) => void;
  timeValue: string;
}

// Define the YouTube Player Interface
interface YouTubePlayer {
  seekTo(seconds: number, allowSeekAhead: boolean): void;
}

const YouTubeVideo: React.FC<YouTubeVideoProps> = ({
  sendMessage,
  timeValue,
}) => {
  const playerRef = useRef<YouTubePlayer | null>(null);

  const onPlayerReady = (event: YouTubeEvent) => {
    // Access the player object and call methods if needed
    event.target.pauseVideo();
    console.log(event.target);
    playerRef.current = event.target;
  };

  const onStateChange = (event: YouTubeEvent) => {
    console.log(event.target.playerInfo.currentTime);
    sendMessage(event.target.playerInfo.currentTime);
    skipToTime(timeValue);
  };

  const skipToTime = (timeInSeconds: string) => {
    if (playerRef.current) {
      playerRef.current.seekTo(parseInt(timeInSeconds), true); // true for seconds
      console.log("tis", timeInSeconds);
    }
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
      // onPlaybackRateChange={onStateChange}
    />
  );
};

export default YouTubeVideo;
