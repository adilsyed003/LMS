import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";

export default function VideoDropzone({ video, onUpload, uploadMutation }) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      const selected = acceptedFiles[0];
      if (!selected) return;
      if (!(selected.type === "video/mp4" || selected.type === "video/webm")) {
        alert("Only MP4 or WEBM allowed");
        return;
      }
      if (selected.size > 50 * 1024 * 1024) {
        alert("File must be under 50MB");
        return;
      }
      onUpload(selected);
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "video/mp4": [], "video/webm": [] },
    multiple: false,
  });

  return (
    <div className="flex flex-col md:flex-row items-center gap-6">
      <div
        {...getRootProps()}
        className={`w-[320px] h-[120px] flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer transition bg-gray-50 hover:bg-gray-100 ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        {!video.file ? (
          <>
            <svg width="48" height="48" fill="none" viewBox="0 0 48 48">
              <rect width="48" height="48" rx="8" fill="#F3F4F6" />
              <path
                d="M16 32V24L24 18L32 24V32"
                stroke="#60A5FA"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="24" cy="24" r="3" fill="#60A5FA" />
            </svg>
            <p className="mt-2 text-gray-500 text-center text-sm font-medium">
              Drag & drop or click to select video
              <br />
              <span className="text-xs">(MP4/WEBM, max 50MB)</span>
            </p>
          </>
        ) : (
          <span className="text-xs text-gray-500">{video.file.name}</span>
        )}
      </div>
      <div className="flex flex-col gap-2 w-full max-w-xs">
        <Button
          onClick={() => uploadMutation.mutate(video.file)}
          disabled={!video.file || uploadMutation.status === "pending"}
          className="w-full"
        >
          {uploadMutation.status === "pending"
            ? "Uploading..."
            : "Upload Video"}
        </Button>
        {video.url && (
          <span className="text-xs text-green-600">Video uploaded!</span>
        )}
      </div>
    </div>
  );
}
