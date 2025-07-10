"use client"; // Required because we're using a client-only hook (via Room)

import Room from "@/components/editor/Room";

export default function DocumentPage() {
  return (
    <Room>
      <div>
        <h1>Collaborative Editor</h1>
        <p>This Is your actual editor</p>
      </div>
    </Room>
  );
}
