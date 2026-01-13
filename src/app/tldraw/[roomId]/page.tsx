"use client";

import Room from "../../../components/room";
import { Header } from "@/components/header";
import { ClientSideSuspense, useSelf } from "@liveblocks/react/suspense";
import { useStorageStore } from "./useStorageStore";
import { Loading } from "@/components/loading";
import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";

export default function Page() {
  return (
    <Room>
      <div className="inset-0 absolute flex flex-col h-full">
        <Header />
        <div className="grow">
          <ClientSideSuspense fallback={<Loading />}>
            <StorageTldraw />
          </ClientSideSuspense>
        </div>
      </div>
    </Room>
  );
}

function StorageTldraw() {
  // Getting authenticated user info. Doing this using selectors instead
  // of just `useSelf()` to prevent re-renders on Presence changes
  const id = useSelf((me) => me.id);
  const info = useSelf((me) => me.info);

  const store = useStorageStore({
    user: { id, color: info.color, name: info.name },
  });

  return (
    <div style={{ height: "100%", width: "100vw" }}>
      <Tldraw store={store} autoFocus />
    </div>
  );
}
