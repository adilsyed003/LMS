import React from "react";
import ReactPlayer from "react-player";

export default function CustomPlayer({ url }: { url: string }) {
  return (
    <div className="flex justify-center">
      <ReactPlayer
        src={url}
        controls
        width="800px" // ✅ custom width
        height="450px" // ✅ custom height
        playbackRate={1.0}
        // config prop removed because 'file' is not a valid property
      />
    </div>
  );
}
