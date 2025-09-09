// import React, { useRef, useState } from "react";
// import ReactPlayer from "react-player";

// interface CustomPlayerProps {
//   url: string;
//   width?: string;
//   height?: string;
// }

// export default function CustomPlayer({
//   url,
//   width = "800px",
//   height = "450px",
// }: CustomPlayerProps) {
//   const playerRef = useRef<null>(null);
//   const [playing, setPlaying] = useState(false);
//   const [volume, setVolume] = useState(0.8);
//   const [played, setPlayed] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [fullscreen, setFullscreen] = useState(false);

//   const handlePlayPause = () => {
//     setPlaying(!playing);
//   };

//   const handleVolumeChange = (newVolume: number) => {
//     setVolume(newVolume);
//   };

//   // const handleSeek = (newPlayed: number) => {
//   //   if (playerRef.current) {
//   //     playerRef.current.seekTo(newPlayed, "fraction");
//   //     setPlayed(newPlayed);
//   //   }
//   // };

//   const handleProgress = (state: {
//     played: number;
//     playedSeconds: number;
//     loaded: number;
//     loadedSeconds: number;
//   }) => {
//     setPlayed(state.played);
//   };

//   const handleDuration = (duration: number) => {
//     setDuration(duration);
//   };

//   const handleFullscreen = () => {
//     const elem = document.getElementById("custom-player-container");
//     if (!fullscreen) {
//       if (elem && elem.requestFullscreen) elem.requestFullscreen();
//       setFullscreen(true);
//     } else {
//       if (document.exitFullscreen) document.exitFullscreen();
//       setFullscreen(false);
//     }
//   };

//   const formatTime = (time: number) => {
//     const minutes = Math.floor(time / 60);
//     const seconds = Math.floor(time % 60);
//     return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
//   };

//   return (
//     <div
//       id="custom-player-container"
//       className="relative flex flex-col items-center bg-gray-100 rounded-lg group"
//       style={{
//         width: fullscreen ? "100vw" : width,
//         height: fullscreen ? "100vh" : height,
//       }}
//     >
//       <ReactPlayer
//         ref={playerRef}
//         url={url}
//         playing={playing}
//         volume={volume}
//         onProgress={handleProgress}
//         onDuration={handleDuration}
//         width="100%"
//         height="100%"
//         style={{ borderRadius: "12px", background: "#222" }}
//       />
//       {/* Center Play/Pause Button */}
//       <button
//         className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-4 shadow-lg group-hover:flex"
//         onClick={handlePlayPause}
//         style={{ zIndex: 10 }}
//       >
//         {playing ? (
//           <svg width="32" height="32" viewBox="0 0 32 32" fill="#222">
//             <rect x="8" y="8" width="5" height="16" />
//             <rect x="19" y="8" width="5" height="16" />
//           </svg>
//         ) : (
//           <svg width="32" height="32" viewBox="0 0 32 32" fill="#222">
//             <polygon points="10,8 26,16 10,24" />
//           </svg>
//         )}
//       </button>
//       {/* Controls Bar */}
//       <div
//         className="absolute bottom-0 left-0 w-full flex items-center justify-between px-6 py-4 bg-gradient-to-t from-black/90 to-transparent text-white group-hover:flex"
//         style={{ zIndex: 10 }}
//       >
//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => handleSeek(Math.max(played - 0.1, 0))}
//             title="Back 6s"
//             className="p-2"
//           >
//             <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
//               <polygon points="17,7 9,12 17,17" />
//               <rect x="6" y="7" width="2" height="10" />
//             </svg>
//           </button>
//           <button onClick={handlePlayPause} title="Play/Pause" className="p-2">
//             {playing ? (
//               <svg
//                 width="24"
//                 height="24"
//                 viewBox="0 0 32 32"
//                 fill="currentColor"
//               >
//                 <rect x="8" y="8" width="5" height="16" />
//                 <rect x="19" y="8" width="5" height="16" />
//               </svg>
//             ) : (
//               <svg
//                 width="24"
//                 height="24"
//                 viewBox="0 0 32 32"
//                 fill="currentColor"
//               >
//                 <polygon points="10,8 26,16 10,24" />
//               </svg>
//             )}
//           </button>
//           <button
//             onClick={() => handleSeek(Math.min(played + 0.1, 1))}
//             title="Forward 6s"
//             className="p-2"
//           >
//             <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
//               <polygon points="7,7 15,12 7,17" />
//               <rect x="16" y="7" width="2" height="10" />
//             </svg>
//           </button>
//         </div>
//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => handleVolumeChange(Math.max(volume - 0.1, 0))}
//             title="Volume Down"
//             className="p-2"
//           >
//             <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
//               <polygon points="3,9 7,9 11,5 11,19 7,15 3,15" />
//               <rect x="15" y="10" width="2" height="4" />
//             </svg>
//           </button>
//           <span>{Math.round(volume * 100)}%</span>
//           <button
//             onClick={() => handleVolumeChange(Math.min(volume + 0.1, 1))}
//             title="Volume Up"
//             className="p-2"
//           >
//             <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
//               <polygon points="3,9 7,9 11,5 11,19 7,15 3,15" />
//               <rect x="15" y="8" width="2" height="8" />
//             </svg>
//           </button>
//         </div>
//         <div className="flex items-center gap-4">
//           <button onClick={handleFullscreen} title="Fullscreen" className="p-2">
//             {fullscreen ? (
//               <svg
//                 width="24"
//                 height="24"
//                 viewBox="0 0 24 24"
//                 fill="currentColor"
//               >
//                 <path d="M9 9H5V5h4V3H3v6h2V5h4V3zm6 0h4V5h-4V3h6v6h-2V5h-4V3zm-6 6H5v4h4v2H3v-6h2v4h4v2zm6 0h4v4h-4v2h6v-6h-2v4h-4v2z" />
//               </svg>
//             ) : (
//               <svg
//                 width="24"
//                 height="24"
//                 viewBox="0 0 24 24"
//                 fill="currentColor"
//               >
//                 <path d="M3 3h6v2H5v4H3V3zm12 0h6v6h-2V5h-4V3zm-6 12H3v6h6v-2H5v-4H3zm12 0h6v6h-6v-2h4v-4h2z" />
//               </svg>
//             )}
//           </button>
//         </div>
//       </div>
//       {/* Timeline Overlay */}
//       <div
//         className="absolute bottom-0 left-0 w-full px-6 py-2 bg-gradient-to-t from-black/90 to-transparent text-white group-hover:flex"
//         style={{ zIndex: 5 }}
//       >
//         <input
//           type="range"
//           min="0"
//           max={duration}
//           value={played * duration}
//           onChange={(e) => handleSeek(parseFloat(e.target.value) / duration)}
//           className="w-full appearance-none bg-gray-300 h-1 rounded focus:outline-none"
//         />
//         <div className="flex justify-between text-xs mt-1">
//           <span>{formatTime(played * duration)}</span>
//           <span>{formatTime(duration)}</span>
//         </div>
//       </div>
//     </div>
//   );
// }
