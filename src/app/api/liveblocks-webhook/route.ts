import { WebhookHandler } from "@liveblocks/node";
import { Liveblocks as LiveblocksNode } from "@liveblocks/node";
import { handleCommentCreated } from "./handleCommentCreated";
import { handleTextEditorUpdate } from "./handleTextEditorUpdate";
import { handleTldrawUpdate } from "./handleTldrawUpdate";

// Add your webhook secret key from a project's webhooks dashboard
const webhookHandler = new WebhookHandler(
  process.env.LIVEBLOCKS_WEBHOOK_SECRET_KEY as string
);

// Add your secret key from a project's API keys dashboard
export const liveblocks = new LiveblocksNode({
  secret: process.env.LIVEBLOCKS_SECRET_KEY as string,
});

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

    // When the text editor content is edited
    if (event.type === "ydocUpdated") {
      return await handleTextEditorUpdate(event);
    }

    // When the storage (tldraw in this app) content is edited
    if (event.type === "storageUpdated") {
      return await handleTldrawUpdate(event);
    }
  } catch (err) {
    console.error(err);
    return new Response(`Error with ${event.type} event: ${err}`, {
      status: 500,
    });
  }

  return new Response(null, { status: 200 });
}
