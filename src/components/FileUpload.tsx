"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function FileUpload() {
  const _router = useRouter();
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // TODO: Read file as text, POST to /api/analyze, save to localStorage, redirect
    setUploading(true);
    setUploading(false);
  }

  return (
    <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
      <input
        type="file"
        accept=".csv,.json"
        onChange={handleFile}
        className="hidden"
        id="file-input"
      />
      <label htmlFor="file-input" className="cursor-pointer text-gray-400 hover:text-white">
        {uploading ? "Analyzing..." : "Click to upload CSV or JSON"}
      </label>
    </div>
  );
}
