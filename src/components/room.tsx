"use client";

import { ReactNode } from "react";
import { useParams } from "next/navigation";
import { RoomProvider } from "@liveblocks/react";
import { LiveMap } from "@liveblocks/client";

export default function Room({ children }: { children: ReactNode }) {
  const { roomId } = useParams();

  return (
    <RoomProvider
      id={roomId as string}
      // Initial values used by tldraw
      initialPresence={{ presence: undefined }}
      initialStorage={{ records: new LiveMap() }}
    >
      {children}
    </RoomProvider>
  );
}
