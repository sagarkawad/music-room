"use client";

import React, { useEffect, useRef, useState } from "react";
import YouTube, { YouTubeEvent, YouTubeProps } from "react-youtube";
import axios from "axios";

import { useSearchParams } from "next/navigation";

let socket: any = null;
const yt = {
  current: {
    playVideo: Function,
    pauseVideo: Function,
    seekTo: (n: Number, f: Boolean) => {},
    getCurrentTime: () => {
      return Number;
    },
  },
};
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
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [link, setLink] = useState("");
  const isSeekingRef = useRef(false);
  let dataVar;
  const { slug: slug } = params;
  const searchParams = useSearchParams();
  const input = searchParams.get("input");

  useEffect(() => {
    // Create a new WebSocket connection to the server
    socket = new WebSocket("ws://localhost:8080/yt-data");

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

    const queryDB = async () => {
      try {
        const DBData = await axios.post("/api/getlink", {
          link: `/room/${slug}?input=${input}`,
        });
        console.log(DBData.data.existingLink.link);
        setLink(DBData.data.existingLink.link);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    };

    queryDB();
  }, []);

  // Event handler for when the video is ready
  const onVideoReady: YouTubeProps["onReady"] = (event) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo(); // Example: Start the video in paused mode

    yt.current = event.target;
  };

  const frameCheck = (e: YouTubeEvent) => {
    console.log(e.target.getVideoUrl().split("v")[1].split("=")[1]);
    socket.send(
      `${
        e.target.getPlayerState() == YT_PLAYING ||
        e.target.getPlayerState() == YT_BUFFERING
      } ${e.target.getCurrentTime()} ${
        e.target.getVideoUrl().split("v")[1].split("=")[1]
      } ${slug}`
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

  // if (data != dataVar) {
  //   const parts = data.split(" ");
  //   if (parts[2] == input) {
  //     if (parts[3] == slug) {
  //       if (parts[0] == "true") {
  //         yt.current.playVideo();

  //         if (!isSeekingRef.current) {
  //           isSeekingRef.current = true;

  //           yt.current.seekTo(Number(data[1]), true);
  //         } else {
  //           isSeekingRef.current = false;
  //         }
  //       } else if (parts[0] == "false") {
  //         yt.current.pauseVideo();
  //       }
  //     }
  //   }
  // }

  function debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout | null = null;

    return function (...args: Parameters<T>) {
      // Clear the previous timer if it exists
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Set a new timer
      timeoutId = setTimeout(() => {
        //@ts-ignore
        func.apply(this, args); // Call the function with the provided context and arguments
      }, delay);
    };
  }

  // Function to seek the video
  const seekVideo = (time: number) => {
    yt.current.seekTo(time, true); // Seek to the specified time
  };

  // Create a debounced version of the seekVideo function
  const debouncedSeekVideo = debounce(seekVideo, 200); // 500ms delay

  // Flag to determine if the video should stay paused
  let isPausedOnSeek = false;

  // Inside your event handler or wherever you're processing the data
  if (data !== dataVar) {
    const parts = data.split(" ");

    if (parts[2] === input && parts[3] === slug) {
      const shouldPlay = parts[0] === "true";
      const targetTime = Number(parts[1]);

      // Check if the user is seeking
      const currentTime = yt.current.getCurrentTime();
      const threshold = 3; // seconds

      //@ts-ignore
      if (Math.abs(currentTime - targetTime) > threshold) {
        // Pause the video immediately when seeking
        yt.current.pauseVideo();
        isPausedOnSeek = true; // Set flag indicating video is paused on seek

        // Use the debounced function to seek
        debouncedSeekVideo(targetTime);
      } else {
        // If the user is not seeking, just play or pause the video based on the command
        if (shouldPlay) {
          yt.current.playVideo();
          isPausedOnSeek = false; // Reset flag if video is playing
        } else {
          yt.current.pauseVideo();
          isPausedOnSeek = true; // Set flag indicating video is paused
        }
      }

      // If the video is paused due to a seek, ensure it stays paused until a play command
      if (isPausedOnSeek && shouldPlay) {
        yt.current.pauseVideo(); // Ensure the video remains paused if it was paused on seek
      }
    }
  }

  //@ts-ignore
  if (loading) {
    return <h1>Loading...</h1>;
    //@ts-ignore
  } else if (link != `/room/${slug}?input=${input}`) {
    return <h1>no such room found!</h1>;
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
