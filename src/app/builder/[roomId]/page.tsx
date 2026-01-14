"use client";

import Room from "@/components/room";
import { Header } from "@/components/header";
import { ClientSideSuspense, useMutation } from "@liveblocks/react/suspense";
import { Loading } from "@/components/loading";
import { Builder } from "./builder";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { nanoid } from "nanoid";
import { LiveObject } from "@liveblocks/client";

export default function Page() {
  return (
    <Room>
      <div className="inset-0 fixed flex flex-col h-full">
        <Header />
        <div className="container mx-auto mt-12 mb-4 flex flex-col gap-4 grow">
          <h1 className="text-2xl font-bold">Builder</h1>
          <div className="flex flex-row gap-4 grow items-stretch">
            <div className="w-[350px] border bg-background rounded-md">
              <div className="w-full h-full flex items-center justify-center italic text-muted-foreground">
                A sidebar
              </div>
            </div>
            <div className="grow">
              <ClientSideSuspense fallback={<Loading />}>
                <Builder />
              </ClientSideSuspense>
            </div>
          </div>
        </div>
      </div>
    </Room>
  );
}
