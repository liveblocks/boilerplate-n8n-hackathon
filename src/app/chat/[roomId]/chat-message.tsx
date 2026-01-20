"use client";

import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

type ChatMessageProps = {
  side: "left" | "right";
  name: string;
  avatar?: string;
  content: string;
};

export function ChatMessage({ side, name, avatar, content }: ChatMessageProps) {
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
