"use client";

import React, { useEffect, useRef, useState } from "react";
import YouTube, { YouTubeEvent, YouTubeProps } from "react-youtube";
import axios from "axios";

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
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
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

    const queryDB = async () => {
      const DBData = await axios.get("/api/link");
      const allLinks: [{ link: string }] = DBData.data.links;
      console.log(DBData.data.links);
      const arr = [];
      for (const el of allLinks) {
        //@ts-ignore
        console.log([el.link]);
        arr.push(el.link);
      }
      //@ts-ignore
      setRooms(arr);
      setLoading(false);
      return allLinks;
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
    console.log(e.target.getVideoUrl().split("=")[1]);
    socket.send(
      `${
        e.target.getPlayerState() == YT_PLAYING ||
        e.target.getPlayerState() == YT_BUFFERING
      } ${e.target.getCurrentTime()} ${
        e.target.getVideoUrl().split("=")[1]
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

  if (data != dataVar) {
    const parts = data.split(" ");
    if (parts[2] == input) {
      if (parts[3] == slug) {
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
    }
  }

  //@ts-ignore
  if (loading) {
    return <h1>Loading...</h1>;
    //@ts-ignore
  } else if (!rooms.includes(`/room/${slug}?input=${input}`)) {
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
