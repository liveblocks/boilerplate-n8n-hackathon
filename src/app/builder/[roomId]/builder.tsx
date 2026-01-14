"use client";

import { useStorage, useMutation } from "@liveblocks/react/suspense";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LiveObject, shallow } from "@liveblocks/client";
import { nanoid } from "nanoid";
import { Button } from "@/components/ui/button";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { useCallback } from "react";

export function Builder() {
  // Gets a list of block IDs from Storage, more
  // efficient that getting every block as it will
  // only update when a new block is added/removed
  const blockIds = useStorage(
    (root) => root.blocks.map((block) => block.id),
    shallow
  );

  const sensors = useSensors(
    // Drag and drag with mouse
    useSensor(PointerSensor),

    // Press space on a drag handle for accessible dnd
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Adds a new block to Storage
  const addBlock = useMutation(({ storage }) => {
    const blocks = storage.get("blocks");

    const newBlock = new LiveObject({
      id: nanoid(),
      content: "",
    });

    blocks.push(newBlock);
  }, []);

  // Switches the order of two blocks, by their IDs
  const reorderBlocks = useMutation(
    ({ storage }, blockOneId: string, blockTwoId: string) => {
      const blocks = storage.get("blocks");

      const oldIndex = blocks.findIndex(
        (block) => block.get("id") === blockOneId
      );
      const newIndex = blocks.findIndex(
        (block) => block.get("id") === blockTwoId
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        const blocks = storage.get("blocks");
        blocks.move(oldIndex, newIndex);
      }
    },
    []
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        reorderBlocks(active.id as string, over.id as string);
      }
    },
    [reorderBlocks]
  );

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex items-center justify-end">
        <Button onClick={addBlock}>
          <Plus className="h-4 w-4 mr-2" />
          Add Block
        </Button>
      </div>

      <div className="relative grow bg-background border rounded-md">
        <div className="absolute inset-0 overflow-y-scroll p-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={blockIds}
              strategy={verticalListSortingStrategy}
            >
              {blockIds.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center italic text-muted-foreground">
                  Click "Add block" to get started
                </div>
              ) : (
                blockIds.map((blockId) => (
                  <SortableBlock key={blockId} blockId={blockId} />
                ))
              )}
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  );
}

function SortableBlock({ blockId }: { blockId: string }) {
  // Get the current block
  const block = useStorage(
    (root) => root.blocks.find((block) => block.id === blockId),
    shallow
  );

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: blockId });

  // Updates the block's text
  const updateBlockContent = useMutation(
    ({ storage }, content: string) => {
      const blocks = storage.get("blocks");
      const block = blocks.find((b) => b.get("id") === blockId);

      if (block) {
        block.set("content", content);
      }
    },
    [blockId]
  );

  // Deletes the block
  const deleteBlock = useMutation(
    ({ storage }) => {
      const blocks = storage.get("blocks");
      const index = blocks.findIndex((block) => block.get("id") === blockId);

      if (index !== -1) {
        blocks.delete(index);
      }
    },
    [blockId]
  );

  if (!block) {
    return null;
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-4 flex items-center gap-3 rounded-md bg-muted hover:bg-muted/60 mb-2 border border-muted-foreground/5"
    >
      <button
        {...attributes}
        {...listeners}
        className="flex items-center justify-center cursor-grab active:cursor-grabbing mt-1 text-muted-foreground hover:text-foreground active:z-50"
      >
        <span className="sr-only">Drag</span>
        <GripVertical className="h-5 w-5" />
      </button>
      <div className="grow flex items-center">
        <input
          type="text"
          value={block.content}
          onChange={(e) => updateBlockContent(e.target.value)}
          className="placeholder:font-normal w-full bg-transparent border-none outline-none text-lg font-medium mt-1 leading-0"
          placeholder="Enter text…"
        />
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={deleteBlock}
        className="text-destructive hover:text-destructive cursor-pointer"
      >
        <span className="sr-only">Delete</span>
        <Trash2 className="h-5 w-5" />
      </Button>
    </div>
  );
}
