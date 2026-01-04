"use client";

import { useState } from "react";

export default function CreatePage() {
  const [image, setImage] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!image || !prompt) {
      alert("Please upload an image and write a prompt");
      return;
    }

    alert("READY TO UPLOAD IMAGE");
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
          onChange={(e) => setImage(e.target.files[0])}
        />
      </label>

      <br /><br />

      <label>
        Prompt
        <br />
        <textarea
          placeholder="Describe how the image should turn into a video"
          rows={4}
          style={{ width: "100%" }}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </label>

      <br /><br />

      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{ padding: "10px 20px", cursor: "pointer" }}
      >
        {loading ? "Processing..." : "Generate Video"}
      </button>
    </div>
  );
}
