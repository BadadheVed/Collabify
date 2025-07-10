"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { useParams } from "next/navigation";

export default function Room({ children }: { children: ReactNode }) {
  const params = useParams();
  const roomId = params?.id;

  if (!roomId || typeof roomId !== "string") {
    return <div>Invalid room ID.</div>; // Optional fallback
  }

  return (
    <LiveblocksProvider publicApiKey="pk_dev_dpl3txGQOrAjvuXbvpX-CKhyvrAGr5PNGQ1XzNwdj3s1LI90Q5ZFyTqe86QwLN5-">
      <RoomProvider id={roomId}>
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
