import { NextRequest, NextResponse } from "next/server";

// POST - Get or create a chat session
export async function POST(request: NextRequest) {
  try {
    const { roomId, sessionId, metadata } = await request.json();

    if (!roomId || !sessionId) {
      return NextResponse.json(
        { error: "roomId and sessionId are required" },
        { status: 400 }
      );
    }

    // First, try to get the agent session
    const getResponse = await fetch(
      `https://dev.dev-liveblocks5948.workers.dev/v2/rooms/${roomId}/agent-sessions/${sessionId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.LIVEBLOCKS_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    let sessionData;

    // If session exists, get the data
    if (getResponse.ok) {
      sessionData = await getResponse.json();
    }
    // If session doesn't exist (404), create it
    else if (getResponse.status === 404) {
      const createResponse = await fetch(
        `https://dev.dev-liveblocks5948.workers.dev/v2/rooms/${roomId}/agent-sessions`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.LIVEBLOCKS_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ metadata: metadata || {} }),
        }
      );

      if (!createResponse.ok) {
        throw new Error(
          `Failed to create agent session: ${createResponse.statusText}`
        );
      }

      sessionData = await createResponse.json();
    } else {
      // If there's another error, throw it
      throw new Error(`Failed to get agent session: ${getResponse.statusText}`);
    }

    // TODO: Add your custom logic here when a new chat is created
    // For example, you might want to:
    // - Send a webhook to n8n
    // - Initialize the chat with a welcome message
    // - Set up custom metadata
    // - etc.

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error getting/creating chat session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
