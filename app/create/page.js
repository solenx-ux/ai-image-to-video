"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function CreatePage() {
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState("");

  const handleUpload = async () => {
    try {
      setStatus("Uploading...");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setStatus("Not logged in");
        return;
      }

      if (!file) {
        setStatus("No file selected");
        return;
      }

      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("IMAGES")
        .upload(filePath, file, {
          upsert: false,
        });

      if (uploadError) {
        console.error(uploadError);
        setStatus("Upload failed");
        return;
      }

      setStatus("Upload successful ✅");
    } catch (err) {
      console.error(err);
      setStatus("Unexpected error");
    }
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

      <button onClick={handleUpload}>Upload Image</button>

      <p>{status}</p>
    </div>
  );
}
