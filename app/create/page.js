"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function CreatePage() {
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const uploadImage = async () => {
    if (!file) {
      alert("Please select an image");
      return;
    }

    setLoading(true);
    setMessage("");

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error } = await supabase.storage
      .from("images")
      .upload(filePath, file);

    if (error) {
      console.error(error);
      setMessage("Upload failed");
    } else {
      setMessage("Image uploaded successfully");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: 40, maxWidth: 600 }}>
      <h1>Create Video</h1>

      <label>
        Upload Image
        <br />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </label>

      <br />
      <br />

      <label>
        Prompt
        <br />
        <textarea
          rows={4}
          style={{ width: "100%" }}
          placeholder="Describe how the image should turn into a video"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </label>

      <br />
      <br />

      <button onClick={uploadImage} disabled={loading}>
        {loading ? "Uploading..." : "Upload Image"}
      </button>

      <br />
      <br />

      {message && <p>{message}</p>}
    </div>
  );
}
