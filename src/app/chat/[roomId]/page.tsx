"use client";

import { useState } from "react";
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
  ClientSideSuspense,
  useOthers,
} from "@liveblocks/react/suspense";
import { Loading } from "@/components/loading";
import {
  AiChatMessage,
  HumanChatMessage,
  ThinkingMessage,
} from "./chat-message";
import { useAgentSession } from "@liveblocks/react";
import { sendMessageToN8n } from "./sendMessageToN8n";
import type { AgentSessionMessage } from "./types";

export default function Page() {
  return (
    <Room>
      <Header />
      <div className="m-4">
        <div className="container mx-auto my-12 flex flex-col gap-4 max-w-4xl">
          <h1 className="text-2xl font-bold">AI Chat</h1>
          <ClientSideSuspense
            fallback={
              <div className="fixed inset-0 flex items-center justify-center">
                <Loading />
              </div>
            }
          >
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

  // Add a chat switcher if you like
  const [sessionId, setSessionId] = useState("chat-session-1");

  // Get chat messages from the agent session
  const { messages } = useAgentSession(sessionId);

  // Search through connected users and see if there's an AI thinking
  const others = useOthers();
  const aiIsThinking = others.some(
    (other) => other.presence.agentState === "thinking"
  );

  if (!messages) {
    return <Loading />;
  }

  // This will be automatically typed by Liveblocks in future
  const typedMessages = messages as AgentSessionMessage[];

  return (
    <div className="flex flex-col h-[600px] border rounded-lg overflow-hidden bg-background">
      {/* Messages area */}
      <Conversation>
        <ConversationContent>
          {typedMessages.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <ConversationEmptyState />
              </div>
          ) : (
            <>
              {typedMessages.map(({ id, data: { userId, content } }) =>
                userId ? (
                  <HumanChatMessage
                    key={id}
                    userId={userId}
                    content={content}
                  />
                ) : (
                  <AiChatMessage key={id} content={content} />
                )
              )}
              {aiIsThinking && <ThinkingMessage />}
            </>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {/* Input area */}
      <div className="border-t p-4 bg-background">
        <PromptInput
          onSubmit={({ text }) =>
            sendMessageToN8n({
              message: text,
              roomId: roomId as string,
              sessionId,
              userId: currentUser.id,
            })
          }
        >
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
