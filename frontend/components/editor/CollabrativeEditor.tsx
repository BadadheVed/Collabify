"use client";

import {
  useLiveblocksExtension,
  FloatingToolbar,
} from "@liveblocks/react-tiptap";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export function Editor() {
  const liveblocks = useLiveblocksExtension();

  const editor = useEditor({
    extensions: [
      liveblocks,
      StarterKit.configure({
        history: false, // Liveblocks manages history for multiplayer
      }),
    ],
    editorProps: {
      attributes: {
        class: "min-h-[300px] p-4 border border-gray-300 rounded-md",
      },
    },
  });

  if (!editor) return <div>Loading editor...</div>;

  return (
    <div className="space-y-4">
      <EditorContent editor={editor} />
      <FloatingToolbar editor={editor} />
    </div>
  );
}
