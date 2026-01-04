"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function CreatePage() {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const login = async () => {
    const email = prompt("Enter your email to login");
    if (!email) return;

    const { error } = await supabase.auth.signInWithOtp({
      email,
    });

    if (error) {
      alert("Login failed");
    } else {
      alert("Check your email for login link");
    }
  };

  const handleUpload = async () => {
    if (!user) {
      setStatus("Not logged in");
      return;
    }

    if (!file) {
      setStatus("No file selected");
      return;
    }

    setStatus("Uploading...");

    const ext = file.name.split(".").pop();
    const path = `${user.id}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("IMAGES")
      .upload(path, file);

    if (error) {
      console.error(error);
      setStatus("Upload failed");
    } else {
      setStatus("Upload successful ✅");
    }
  };

  return (
    <div style={{ padding: 40, maxWidth: 600 }}>
      <h1>Create Video</h1>

      {!user && (
        <button onClick={login} style={{ marginBottom: 20 }}>
          Login
        </button>
      )}

      {user && <p>Logged in as: {user.email}</p>}

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
