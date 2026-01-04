"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function CreatePage() {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [message, setMessage] = useState("");
  const [videoUrl, setVideoUrl] = useState(null);

  // Get logged-in user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  // Upload handler
  async function handleUpload() {
    if (!file || !user) {
      setMessage("Missing file or user");
      return;
    }

    setMessage("Uploading image...");

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    // 1. Upload image
    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(fileName, file);

    if (uploadError) {
      setMessage(uploadError.message);
      return;
    }

    // 2. Insert video row and GET ID
    const { data, error } = await supabase
      .from("videos")
      .insert({
        user_id: user.id,
        image_path: fileName,
        status: "uploaded",
      })
      .select()
      .single();

    if (error) {
      setMessage(error.message);
      return;
    }

    const videoId = data.id;

    // 3. Set processing
    await supabase
      .from("videos")
      .update({ status: "processing" })
      .eq("id", videoId);

    setMessage("Processing video...");

    // 4. Fake AI generation
    fakeGenerateVideo(videoId);
  }

  // Fake AI generator
  async function fakeGenerateVideo(videoId) {
    await new Promise((r) => setTimeout(r, 5000));

    const demoVideo =
      "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4";

    await supabase
      .from("videos")
      .update({
        status: "done",
        video_url: demoVideo,
      })
      .eq("id", videoId);

    setVideoUrl(demoVideo);
    setMessage("Video ready ✅");
  }

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
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <textarea
        placeholder="Describe how the image should turn into a video"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ width: 400, height: 100 }}
      />

      <br /><br />

      <button onClick={handleUpload}>Upload Image</button>

      <p>{message}</p>

      {videoUrl && (
        <video
          src={videoUrl}
          controls
          width="400"
          style={{ marginTop: 20 }}
        />
      )}
    </div>
  );
}
