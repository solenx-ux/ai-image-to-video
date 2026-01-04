"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function CreatePage() {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const uploadImage = async () => {
    setMessage("");

    if (!user) {
      setMessage("Not logged in");
      return;
    }

    if (!file) {
      setMessage("No file selected");
      return;
    }

    const filePath = `images/${user.id}/${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error(error);
      setMessage(error.message);
      return;
    }

    setMessage("Upload successful");
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Create Video</h1>

      {user ? (
        <p>Logged in as: {user.email}</p>
      ) : (
        <p>Not logged in</p>
      )}

      <input
        type="file"
        accept="image/png,image/jpeg"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <textarea
        placeholder="Describe how the image should turn into a video"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={4}
        cols={50}
      />

      <br /><br />

      <button onClick={uploadImage}>Upload Image</button>

      <p>{message}</p>
    </div>
  );
}
