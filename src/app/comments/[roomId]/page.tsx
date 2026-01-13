"use client";

import Room from "@/components/room";
import { ClientSideSuspense, useThreads } from "@liveblocks/react/suspense";
import { Loading } from "@/components/loading";
import { Composer, Thread } from "@liveblocks/react-ui";
import { Header } from "@/components/header";

export default function Page() {
  return (
    <Room>
      <Header />
      <div className="m-4">
        <div className="max-w-2xl lg:max-w-7xl w-full mx-auto my-12 flex flex-col gap-4">
          <h1 className="text-2xl font-bold">My comments app</h1>
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="grow">
              <App />
            </div>
            <div className="min-w-[350px]">
              <ClientSideSuspense fallback={<Loading />}>
                <Comments />
              </ClientSideSuspense>
            </div>
          </div>
        </div>
      </div>
    </Room>
  );
}

function App() {
  return (
    <div className="aspect-4/3 border rounded-sm overflow-hidden bg-background">
      <div className="w-full h-full flex items-center justify-center italic text-muted-foreground">
        Your app here
      </div>
    </div>
  );
}

function Comments() {
  const { threads } = useThreads();

  return (
    <div className="flex flex-col gap-3">
      {threads.map((thread) => (
        <Thread
          key={thread.id}
          thread={thread}
          className="shadow-xs border rounded-sm overflow-hidden"
        />
      ))}
      <Composer className="shadow-xs border rounded-sm overflow-hidden" />
    </div>
  );
}
