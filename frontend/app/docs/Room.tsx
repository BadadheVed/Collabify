"use client";

import { ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { RoomProvider } from "@liveblocks/react/suspense";
import { ClientSideSuspense } from "@liveblocks/react";
import { DocumentSpinner } from "./primitives/Spinner"; // You can customize this
import { DashboardLayout } from "@/components/layout/dashboard-layout";
type RoomProps = {
  children: ReactNode;
};

export function Room({ children }: RoomProps) {
  const searchParams = useSearchParams();

  // Extract teamId and documentId from URL
  const documentId = searchParams.get("documentId");
  const teamId = searchParams.get("teamId");

  if (!documentId || !teamId) {
    throw new Error("Missing teamId or roomId in URL");
  }

  // Build unique room ID
  const roomId = `collabify:team:${teamId}:doc:${documentId}`;

  return (
    <RoomProvider
      id={roomId}
      initialPresence={{
        cursor: null,
      }}
    >
      <ClientSideSuspense fallback={<DocumentSpinner />}>
        {children}
      </ClientSideSuspense>
    </RoomProvider>
  );
}
