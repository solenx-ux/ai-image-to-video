"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/create")}
      style={{ padding: "10px 16px", cursor: "pointer" }}
    >
      Create video
    </button>
  );
}
