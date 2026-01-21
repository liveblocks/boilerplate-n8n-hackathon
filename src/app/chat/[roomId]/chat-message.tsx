"use client";

import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { AI_USER } from "@/app/api/database";
import { useUser, useSelf } from "@liveblocks/react";

type ChatMessageProps = {
  content: string;
};

export function AiChatMessage({ content }: ChatMessageProps) {
  return (
    <ChatMessage
      side="left"
      name={AI_USER.info.name}
      avatar={AI_USER.info.avatar}
      content={content}
      isUser={false}
    />
  );
}

export function HumanChatMessage({
  content,
  userId,
}: ChatMessageProps & { userId: string }) {
  const currentUser = useSelf();
  const { user } = useUser(userId);

  if (!currentUser) {
    return null;
  }

  return (
    <ChatMessage
      side={currentUser.id === userId ? "right" : "left"}
      name={user?.name || "Loading…"}
      avatar={user?.avatar || ""}
      content={content}
      isUser={true}
    />
  );
}

export function ChatMessage({
  side,
  name,
  avatar,
  content,
  isUser,
}: {
  isUser: boolean;
  name: string;
  avatar?: string;
  content: string;
  side: "left" | "right";
}) {
  const isRight = side === "right";

  return (
    <div
      className={`flex gap-2 items-start ${
        isRight ? "flex-row justify-end" : "flex-row"
      }`}
    >
      {!isRight && (
        <Avatar className="size-8 shrink-0 mt-1">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{name?.[0] || "U"}</AvatarFallback>
        </Avatar>
      )}

      <Message from={isRight ? "user" : "assistant"}>
        <MessageContent className="gap-1.5 rounded-lg bg-secondary px-4 py-3">
          <div className="text-xs text-muted-foreground">{name}</div>
          <MessageResponse>{content}</MessageResponse>
        </MessageContent>
      </Message>

      {isRight && (
        <Avatar className="size-8 shrink-0 mt-1">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{name?.[0] || "U"}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

export function ThinkingMessage() {
  return (
    <div className="flex gap-2 items-start flex-row">
      <Avatar className="size-8 shrink-0 mt-1">
        <AvatarImage src={AI_USER.info.avatar} alt={AI_USER.info.name} />
        <AvatarFallback>{AI_USER.info.name?.[0] || "A"}</AvatarFallback>
      </Avatar>

      <Message from="assistant">
        <MessageContent className="gap-1.5 rounded-lg bg-secondary px-4 py-3">
          <div className="text-xs text-muted-foreground">{AI_USER.info.name}</div>
          <div className="text-sm">
            <Shimmer duration={1}>Thinking…</Shimmer>
          </div>
        </MessageContent>
      </Message>
    </div>
  );
}
