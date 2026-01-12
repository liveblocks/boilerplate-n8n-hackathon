"use client";

import { ReactNode } from "react";
import { useParams } from "next/navigation";
import { ClientSideSuspense, RoomProvider } from "@liveblocks/react";
import { Loading } from "@/components/loading";

export default function Room({ children }: { children: ReactNode }) {
  const { roomId } = useParams();

  return (
    <RoomProvider
      id={roomId as string}
      initialPresence={{}}
      initialStorage={{}}
    >
      <ClientSideSuspense fallback={<Loading />}>{children}</ClientSideSuspense>
    </RoomProvider>
  );
}
