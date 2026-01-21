"use server";

import { nanoid } from "nanoid";
import type { CreateMessagePayload } from "./types";

export async function sendMessageToN8n({
  message,
  roomId,
  sessionId,
  userId,
}: {
  message: string;
  roomId: string;
  sessionId: string;
  userId: string;
}) {
  await createAgentSessionIfNotExist(roomId, sessionId);

  try {
    // Add message to agent session
    const messageId = nanoid();
    const messagePayload: CreateMessagePayload = {
      id: messageId,
      timestamp: Date.now(),
      data: {
        id: messageId,
        userId,
        content: message,
      },
    };

    const messageResponse = await fetch(
      `https://dev.dev-liveblocks5948.workers.dev/v2/rooms/${roomId}/agent-sessions/${sessionId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.LIVEBLOCKS_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messagePayload),
      }
    );

    if (!messageResponse.ok) {
      throw new Error(
        `Failed to add message to agent session: ${messageResponse.statusText}`
      );
    }

    // Connect to n8n webhook
    await fetch(process.env.N8N_WEBHOOK_URL as string, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roomId, sessionId }),
    });
  } catch (error) {
    throw new Error(`Problem sending message to n8n: ${error}`);
  }
}

async function createAgentSessionIfNotExist(roomId: string, sessionId: string) {
  if (!roomId || !sessionId) {
    throw new Error("roomId and sessionId are required");
  }

  try {
    const getSessionData = await (
      await fetch(
        `https://dev.dev-liveblocks5948.workers.dev/v2/rooms/${roomId}/agent-sessions/${sessionId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.LIVEBLOCKS_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      )
    ).json();

    if (getSessionData.status === 404) {
      await fetch(
        `https://dev.dev-liveblocks5948.workers.dev/v2/rooms/${roomId}/agent-sessions`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.LIVEBLOCKS_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId,
            timestampe: new Date().toISOString(),
            metadata: {},
          }),
        }
      );
    }
  } catch (error) {
    throw new Error(`Error creating session: ${error}`);
  }
}
