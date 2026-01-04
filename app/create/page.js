"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function CreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    });
  }, [router]);

  if (loading) return <p>Checking login...</p>;
return (
  <div style={{ padding: 40, maxWidth: 600 }}>
    <h1>Create Video</h1>

    <label>
      Upload Image
      <br />
      <input type="file" accept="image/*" />
    </label>

    <br /><br />

    <label>
      Prompt
      <br />
      <textarea
        placeholder="Describe how the image should turn into a video"
        rows={4}
        style={{ width: "100%" }}
      />
    </label>

    <br /><br />

    <button
      style={{
        padding: "10px 20px",
        cursor: "pointer"
      }}
      onClick={() => alert("Next step: upload + AI")}
    >
      Generate Video
    </button>
  </div>
);
