"use client";

import type { PropsWithChildren } from "react";
import { LiveblocksProvider } from "@liveblocks/react";
import { axiosInstance } from "@/axiosSetup/axios";
function getDocumentIdFromRoomId(roomId: string): string | null {
  const parts = roomId.split("doc:");
  return parts.length === 2 ? parts[1] : null;
}
type Props = {
  children: React.ReactNode;
};
export function Providers({ children }: Props) {
  return (
    <LiveblocksProvider
      
      authEndpoint={async (roomId) => {
        if (!roomId) {
          throw new Error("Missing roomId");
        }

        const documentId = getDocumentIdFromRoomId(roomId);
        if (!documentId) {
          throw new Error("Invalid roomId format");
        }

        const res = await axiosInstance.post("/liveblocks/auth", {
          documentId,
        });

        return res.data; // Must match Liveblocks spec
      }}
      // 👥 Resolve presence user info by IDs
      resolveUsers={async ({ userIds }) => {
        const res = await axiosInstance.get("/liveblocks/LiveUsers", {
          params: { userIds },
        });

        return res.data; // [{ id, info: { name, avatar } }]
      }}
      // ✍️ Optional @mention suggestions
      resolveMentionSuggestions={async ({ text }) => {
        const res = await axiosInstance.get("/liveblocks/searchUsers", {
          params: { text },
        });

        return res.data; // [{ id, info: { name, avatar } }]
      }}
    >
      {children}
    </LiveblocksProvider>
  );
}
