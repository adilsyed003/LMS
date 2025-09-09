import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";

export default function DropzoneSection({
  file,
  setFile,
  setPreview,
  preview,
  handleUpload,
  uploadMutation,
}) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      const selected = acceptedFiles[0];
      if (!selected) return;
      if (!(selected.type === "image/png" || selected.type === "image/jpeg")) {
        alert("Only PNG or JPG allowed");
        return;
      }
      if (selected.size > 2 * 1024 * 1024) {
        alert("File must be under 2MB");
        return;
      }
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    },
    [setFile, setPreview]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/png": [], "image/jpeg": [] },
    multiple: false,
  });

  return (
    <div className="flex flex-col md:flex-row items-center gap-6">
      <div
        {...getRootProps()}
        className={`w-[320px] h-[220px] flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer transition bg-gray-50 hover:bg-gray-100 ${
          isDragActive ? "border-purple-500 bg-purple-50" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        {!preview ? (
          <>
            <svg width="64" height="64" fill="none" viewBox="0 0 64 64">
              <rect width="64" height="64" rx="12" fill="#F3F4F6" />
              <path
                d="M20 44V36L32 28L44 36V44"
                stroke="#A78BFA"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="32" cy="32" r="4" fill="#A78BFA" />
            </svg>
            <p className="mt-2 text-gray-500 text-center text-sm font-medium">
              Drag & drop or click to select image
              <br />
              <span className="text-xs">
                (PNG/JPG, max 2MB, recommended 750x422px)
              </span>
            </p>
          </>
        ) : (
          <img
            src={preview}
            alt="preview"
            className="rounded shadow object-cover w-full h-full"
            style={{ maxHeight: 200, maxWidth: 300 }}
          />
        )}
      </div>
      <div className="flex flex-col gap-2 w-full max-w-xs">
        {/* <Button
          onClick={handleUpload}
          disabled={!file || uploadMutation.status === "pending"}
          className="w-full"
        >
          {uploadMutation.status === "pending" ? "Uploading..." : "Upload File"}
        </Button> */}
        {file && <span className="text-xs text-gray-500">{file.name}</span>}
      </div>
    </div>
  );
}
