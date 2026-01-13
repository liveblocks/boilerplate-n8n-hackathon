"use client";

import Room from "@/components/room";
import { ClientSideSuspense, useThreads } from "@liveblocks/react/suspense";
import { Loading } from "@/components/loading";
import {
  AnchoredThreads,
  FloatingComposer,
  FloatingThreads,
} from "@liveblocks/react-tiptap";
import { Editor } from "@tiptap/react";
import {
  useLiveblocksExtension,
  FloatingToolbar,
  Toolbar,
} from "@liveblocks/react-tiptap";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Icon } from "@liveblocks/react-ui";
import { Placeholder } from "@tiptap/extensions";
import { Header } from "@/components/header";
import { toast } from "sonner";
import "./text-editor.css";

export default function Page() {
  return (
    <Room>
      <Header />
      <div className="m-4">
        <div className="container mx-auto my-12 flex flex-col gap-4">
          <h1 className="text-2xl font-bold">My text editor app</h1>
          <TextEditor />
        </div>
      </div>
    </Room>
  );
}

export function TextEditor() {
  const liveblocks = useLiveblocksExtension({
    offlineSupport_experimental: true,
  });

  const editor = useEditor({
    extensions: [
      liveblocks,
      StarterKit.configure({
        // The Liveblocks extension comes with its own history handling
        undoRedo: false,
      }),
      Placeholder.configure({
        // Styles in text-editor.css
        placeholder: "Write something…",
      }),
    ],
    immediatelyRender: false,
  });

  return (
    <div className="aspect-4/5 border rounded-sm bg-background h-full relative flex flex-col max-w-[1000px] lg:mr-[370px]">
      <div className="p-0.5 border-b h-[40px]">
        {/* Ready-made floating toolbar */}
        <FloatingToolbar editor={editor} />

        {/* A custom toolbar */}
        <Toolbar editor={editor}>
          <Toolbar.BlockSelector />
          <Toolbar.SectionInline />
          <Toolbar.Separator />
          <Toolbar.SectionCollaboration />
          <Toolbar.Separator />
          <Toolbar.Button
            name="Ask AI"
            icon={<Icon.Sparkles />}
            shortcut="CMD-H"
            onClick={() =>
              toast.success("Custom toolbar button—add your own behavior!")
            }
          />
        </Toolbar>
      </div>

      {/* The editor */}
      <div className="grow">
        <EditorContent
          editor={editor}
          className="h-full"
          /* Editor styles in text-editor.css */
        />

        <FloatingComposer editor={editor} />
        <ClientSideSuspense fallback={<Loading />}>
          <Threads editor={editor} />
        </ClientSideSuspense>
      </div>
    </div>
  );
}

// Show sidebar threads on desktop, hover threads on mobile
export function Threads({ editor }: { editor: Editor | null }) {
  const { threads } = useThreads({ query: { resolved: false } });

  return (
    <>
      <div className="w-[350px] absolute top-0 left-full ml-5 hidden md:block">
        {threads.length === 0 ? (
          <div className="pt-2.5 text-sm text-muted-foreground">
            No comments yet
          </div>
        ) : (
          <AnchoredThreads editor={editor} threads={threads} />
        )}
      </div>

      <FloatingThreads
        editor={editor}
        threads={threads}
        className="block lg:hidden"
      />
    </>
  );
}
