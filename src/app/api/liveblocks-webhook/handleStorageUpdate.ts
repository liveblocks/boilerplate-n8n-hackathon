import { LiveObject, StorageUpdatedEvent } from "@liveblocks/node";
import { liveblocks } from "../liveblocks-auth/route";
import { nanoid } from "nanoid";

// Triggers once every 60 seconds at most, after Storage (tldraw/builder) content is edited
// Some off this logic may be handled by n8n instead, e.g. getStorageDocument, mutateStorage
export async function handleStorageUpdate(event: StorageUpdatedEvent) {
  console.log("StorageUpdatedEvent");

  const { roomId } = event.data;

  // Get the drawing as JSON
  const drawingJson = await liveblocks.getStorageDocument(roomId, "json");

  // Use n8n to do AI magic with the canvas's JSON content
  // ...
  // ...
  // Simulate delay...
  await new Promise((resolve) => setTimeout(resolve, 4000));

  // Optionally edit the document (tldraw)
  // await liveblocks.mutateStorage(roomId, ({ root }) => {
  //   const records = root.get("records");
  //   const id = `shape:${nanoid()}`;
  //   records.set(id, rectangle(id));
  // });

  // Optionally edit the document (builder)
  // await liveblocks.mutateStorage(roomId, ({ root }) => {
  //   const blocks = root.get("blocks");
  //
  //   const newBlock = new LiveObject({
  //     id: nanoid(),
  //     content: "Hello world",
  //   });
  //
  //   blocks.push(newBlock);
  // });

  return new Response(null, { status: 200 });
}

// Example tldraw shape
const rectangle = (id: string) => ({
  id,
  x: 60,
  y: 90,
  rotation: 0,
  isLocked: false,
  opacity: 1,
  meta: {},
  type: "geo",
  props: {
    w: 128,
    h: 128,
    geo: "rectangle",
    dash: "draw",
    growY: 0,
    url: "",
    scale: 1,
    color: "blue",
    labelColor: "blue",
    fill: "none",
    size: "m",
    font: "draw",
    align: "middle",
    verticalAlign: "middle",
    richText: {
      type: "doc",
      content: [
        {
          type: "paragraph",
        },
      ],
    },
  },
  parentId: "page:page",
  index: "a1",
  typeName: "shape",
});
