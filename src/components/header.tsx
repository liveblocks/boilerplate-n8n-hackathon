"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCurrentUser, switchCurrentUser } from "@/lib/user";
import {
  ClientSideSuspense,
  useIsInsideRoom,
  useOthers,
} from "@liveblocks/react/suspense";
import { AI_USER } from "@/app/api/database";

interface User {
  id: string;
  info: {
    name: string;
    color: string;
    avatar: string;
  };
}

export function Header() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const isInsideRoom = useIsInsideRoom();

  useEffect(() => {
    fetch("/api/users/all")
      .then((res) => res.json())
      .then((data: User[]) => {
        // Don't show the AI user in the list
        setUsers(data.filter((user) => user.id !== AI_USER.id));

        const userId = getCurrentUser();
        const user = data.find((u) => u.id === userId);

        if (user) {
          setCurrentUser(user);
          switchCurrentUser(userId);
        }
      })
      .catch((err) => console.error("Failed to fetch users:", err));
  }, []);

  const handleUserChange = (userId: string) => {
    const user = users.find((u) => u.id === userId);

    if (user) {
      switchCurrentUser(userId);
      // Reload the page to update auth
      window.location.reload();
    }
  };

  return (
    <header className="w-full bg-background border-b h-[54px] px-4 flex items-center">
      <div className="container mx-auto flex justify-between items-center">
        <div className="w-[180px]">
          {/* Switch authenticated users */}
          {currentUser ? (
            <>
              <Select
                value={currentUser.id || ""}
                onValueChange={handleUserChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      <img
                        src={user.info.avatar}
                        alt={user.info.name}
                        className="w-5 h-5 rounded-full"
                      />
                      {user.info.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          ) : null}
        </div>

        {/* Inside rooms, show a live avatar stack */}
        <div className="flex items-center">
          {isInsideRoom ? (
            <ClientSideSuspense fallback={null}>
              <LiveAvatars />

              {/* Current user's avatar */}
              <Avatar className="-ml-1">
                <AvatarImage
                  src={currentUser?.info.avatar}
                  alt={currentUser?.info.name}
                />
                <AvatarFallback />
              </Avatar>
            </ClientSideSuspense>
          ) : null}
        </div>
      </div>
    </header>
  );
}

// Every other connected user's avatar
function LiveAvatars() {
  const others = useOthers();

  return others.map((other) => (
    <Avatar key={other.id} className="-ml-1">
      <AvatarImage src={other.info.avatar} alt={other.info.name} />
      <AvatarFallback />
    </Avatar>
  ));
}
