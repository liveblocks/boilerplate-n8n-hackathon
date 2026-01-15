"use client";

import { LiveblocksProvider } from "@liveblocks/react/suspense";
import { ReactNode } from "react";
import { getCurrentUser } from "@/lib/user";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      <Toaster />
      <LiveblocksProvider
        // @ts-ignore - hidden config option
        baseUrl="https://dev.dev-liveblocks5948.workers.dev/"
        throttle={16}
        authEndpoint={async (room) => {
          // Use localStorage as a demo login system
          const userId = getCurrentUser();

          const response = await fetch("/api/liveblocks-auth", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ room, userId }),
          });

          return await response.json();
        }}
        // Get users' info from their ID
        resolveUsers={async ({ userIds }) => {
          const searchParams = new URLSearchParams(
            userIds.map((userId) => ["userIds", userId])
          );
          const response = await fetch(`/api/users?${searchParams}`);

          if (!response.ok) {
            throw new Error("Problem resolving users");
          }

          const users = await response.json();
          return users;
        }}
        // Find a list of users that match the current search term
        resolveMentionSuggestions={async ({ text }) => {
          const response = await fetch(
            `/api/users/search?text=${encodeURIComponent(text)}`
          );

          if (!response.ok) {
            throw new Error("Problem resolving mention suggestions");
          }

          const userIds = await response.json();
          return userIds;
        }}
        // resolveRoomsInfo={async ({ roomIds }) => {
        //
        // }}
      >
        {children}
      </LiveblocksProvider>
    </>
  );
}
