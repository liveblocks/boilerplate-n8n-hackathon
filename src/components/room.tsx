"use client";

import { ReactNode } from "react";
import { useParams } from "next/navigation";
import { RoomProvider } from "@liveblocks/react";
import { LiveMap, LiveList } from "@liveblocks/client";

export default function Room({ children }: { children: ReactNode }) {
  const { roomId } = useParams();

  return (
    <RoomProvider
      id={roomId as string}
      initialPresence={{
        // Used by tldraw
        presence: undefined,
      }}
      initialStorage={{
        // Used by tldraw
        records: new LiveMap(),

        // Used by builder
        blocks: new LiveList([]),
      }}
    >
      {children}
    </RoomProvider>
  );
}
