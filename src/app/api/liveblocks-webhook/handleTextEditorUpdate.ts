import { YDocUpdatedEvent } from "@liveblocks/node";
import { liveblocks } from "./route";
import { withProsemirrorDocument } from "@liveblocks/node-prosemirror";

// Triggers once every 60 seconds at most, after text editor content is edited
export async function handleTextEditorUpdate(event: YDocUpdatedEvent) {
  console.log("YDocUpdatedEvent");

  const { roomId } = event.data;

  // Convert the text document to markdown
  const markdown = await withProsemirrorDocument(
    { roomId, client: liveblocks },
    (api) => {
      return api.toMarkdown();
    }
  );

  // Use n8n to do AI magic with the editor's markdown content
  // ...
  // ...
  // Simulate delay...
  await new Promise((resolve) => setTimeout(resolve, 4000));

  return new Response(null, { status: 200 });
}
