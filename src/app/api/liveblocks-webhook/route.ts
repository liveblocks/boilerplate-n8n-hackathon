import { WebhookHandler } from "@liveblocks/node";
import { handleCommentCreated } from "./handleCommentCreated";
import { handleTextEditorUpdate } from "./handleTextEditorUpdate";
import { handleStorageUpdate } from "./handleStorageUpdate";

// NOTE: This file is not needed if you're using ONLY n8n with your webhooks.

// Add your webhook secret key from a project's webhooks dashboard
const webhookHandler = new WebhookHandler(
  process.env.LIVEBLOCKS_WEBHOOK_SECRET_KEY as string
);

export async function POST(request: Request) {
  const body = await request.json();
  const headers = request.headers;

  // Verify if this is a real webhook request
  let event;
  try {
    event = webhookHandler.verifyRequest({
      headers: headers,
      rawBody: JSON.stringify(body),
    });
  } catch (err) {
    console.error(err);
    return new Response("Could not verify webhook call", { status: 400 });
  }

  try {
    // When a new comment has been created
    if (event.type === "commentCreated") {
      return await handleCommentCreated(event);
    }

    // When text editor content is edited
    if (event.type === "ydocUpdated") {
      return await handleTextEditorUpdate(event);
    }

    // When Storage (tldraw/builder) content is edited
    if (event.type === "storageUpdated") {
      return await handleStorageUpdate(event);
    }
  } catch (err) {
    console.error(err);
    return new Response(`Error with ${event.type} event: ${err}`, {
      status: 500,
    });
  }

  return new Response(null, { status: 200 });
}
