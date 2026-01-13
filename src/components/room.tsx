"use client";

import { ReactNode } from "react";
import { useParams } from "next/navigation";
import { RoomProvider } from "@liveblocks/react";

export default function Room({ children }: { children: ReactNode }) {
  const { roomId } = useParams();

  return (
    <RoomProvider
      id={roomId as string}
      initialPresence={{}}
      initialStorage={{}}
    >
      {children}
    </RoomProvider>
  );
}
