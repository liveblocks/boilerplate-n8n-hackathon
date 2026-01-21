"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Room from "@/components/room";
import { Header } from "@/components/header";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import {
  useSelf,
  useOthers,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { Loading } from "@/components/loading";
import { AiChatMessage, HumanChatMessage } from "./chat-message";
import { useAgentSession } from "@liveblocks/react";

export default function Page() {
  return (
    <Room>
      <Header />
      <div className="m-4">
        <div className="container mx-auto my-12 flex flex-col gap-4 max-w-4xl">
          <h1 className="text-2xl font-bold">AI Chat</h1>
          <ClientSideSuspense fallback={<Loading />}>
            <ChatApp />
          </ClientSideSuspense>
        </div>
      </div>
    </Room>
  );
}

function ChatApp() {
  const { roomId } = useParams();
  const currentUser = useSelf();

  const { messages } = useAgentSession(roomId as string);
  console.log("messages", messages);

  const fakeMessages: Array<{
    id: string;
    role: "user" | "assistant";
    content: string;
    userId?: string;
  }> = [
    {
      id: "1",
      role: "user",
      content: "Hello! How can you help me today?",
      userId: currentUser.id, // Current user
    },
    {
      id: "2",
      role: "assistant",
      content:
        "Hello! I'm here to help you with any questions or tasks you might have. What would you like to know?",
    },
    {
      id: "3",
      role: "user",
      content: "Can you explain what AI is?",
      userId: "jody.hekla@example.com", // Other user
    },
    {
      id: "4",
      role: "assistant",
      content:
        "AI, or Artificial Intelligence, refers to computer systems that can perform tasks typically requiring human intelligence. This includes things like understanding language, recognizing patterns, making decisions, and learning from experience.",
    },
    {
      id: "5",
      role: "user",
      content: "That's helpful, thanks!",
      userId: currentUser.id, // Current user
    },
    {
      id: "6",
      role: "assistant",
      content:
        "You're welcome! Feel free to ask me anything else you'd like to know.",
    },
  ];

  return (
    <div className="flex flex-col h-[600px] border rounded-lg overflow-hidden bg-background">
      {/* Messages area */}
      <Conversation>
        <ConversationContent>
          {fakeMessages.length === 0 ? (
            <ConversationEmptyState />
          ) : (
            fakeMessages.map(({ userId, content, id }) =>
              userId ? (
                <HumanChatMessage
                  key={id}
                  userId={userId}
                  content={content}
                />
              ) : (
                <AiChatMessage key={id} content={content} />
              )
            )
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {/* Input area */}
      <div className="border-t p-4 bg-background">
        <PromptInput onSubmit={async (message) => {}}>
          <PromptInputBody>
            <PromptInputTextarea placeholder="Type your message..." />
          </PromptInputBody>
          <PromptInputFooter>
            <div />
            <PromptInputSubmit />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
