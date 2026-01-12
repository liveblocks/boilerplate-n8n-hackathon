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
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("/api/users/all")
      .then((res) => res.json())
      .then((data: User[]) => {
        setUsers(data);

        const userId = getCurrentUser();
        setCurrentUserId(userId);

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
    <header className="w-full bg-background border-b">
      <div className="container mx-auto px-4 py-3 flex justify-end items-center">
        <div className="flex items-center gap-3 w-[200px]">
          <Select value={currentUserId || ""} onValueChange={handleUserChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select user" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.info.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Avatar>
            <AvatarImage
              src={currentUser?.info.avatar}
              alt={currentUser?.info.name}
            />
            <AvatarFallback />
          </Avatar>
        </div>
      </div>
    </header>
  );
}
