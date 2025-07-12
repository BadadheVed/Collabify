"use client";

import { ClientSideSuspense, useThreads } from "@liveblocks/react/suspense";
import {
  FloatingComposer,
  FloatingThreads,
  useLiveblocksExtension,
} from "@liveblocks/react-tiptap";
import Highlight from "@tiptap/extension-highlight";
import { Image } from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import Youtube from "@tiptap/extension-youtube";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { EditorView } from "prosemirror-view";
import { useEffect, useState, useCallback } from "react"; // Added useCallback
import { DocumentSpinner } from "../primitives/Spinner";
import { CustomTaskItem } from "./CustomTaskItem";
import { StaticToolbar, SelectionToolbar } from "./Toolbars";
import styles from "./TextEditor.module.css";
import { Avatars } from "./Avatars";
import { useSearchParams } from "next/navigation";
import { axiosInstance } from "@/axiosSetup/axios";
import { toast, useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TextEditor() {
  return (
    <ClientSideSuspense fallback={<DocumentSpinner />}>
      <Editor />
    </ClientSideSuspense>
  );
}

// Collaborative text editor with simple rich text and live cursors
export function Editor() {
  const [mounted, setMounted] = useState(false);
  const liveblocks = useLiveblocksExtension();
  const searchParams = useSearchParams();
  const docId = searchParams.get("documentId");

  // Set up editor with plugins, and place user info into Yjs awareness and cursors
  const editor = useEditor({
    // Add this to prevent SSR issues
    immediatelyRender: false,
    editorProps: {
      attributes: {
        // Add styles to editor element
        class: styles.editor,
      },
    },
    extensions: [
      liveblocks,
      StarterKit.configure({
        blockquote: {
          HTMLAttributes: {
            class: "tiptap-blockquote",
          },
        },
        code: {
          HTMLAttributes: {
            class: "tiptap-code",
          },
        },
        codeBlock: {
          languageClassPrefix: "language-",
          HTMLAttributes: {
            class: "tiptap-code-block",
            spellcheck: false,
          },
        },
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: {
            class: "tiptap-heading",
          },
        },
        // The Collaboration extension comes with its own history handling
        history: false,
        horizontalRule: {
          HTMLAttributes: {
            class: "tiptap-hr",
          },
        },
        listItem: {
          HTMLAttributes: {
            class: "tiptap-list-item",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "tiptap-ordered-list",
          },
        },
        paragraph: {
          HTMLAttributes: {
            class: "tiptap-paragraph",
          },
        },
      }),
      Highlight.configure({
        HTMLAttributes: {
          class: "tiptap-highlight",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "tiptap-image",
        },
      }),
      Link.configure({
        HTMLAttributes: {
          class: "tiptap-link",
        },
      }),
      Placeholder.configure({
        placeholder: "Start writing…",
        emptyEditorClass: "tiptap-empty",
      }),
      CustomTaskItem,
      TaskList.configure({
        HTMLAttributes: {
          class: "tiptap-task-list",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Typography,
      Youtube.configure({
        modestBranding: true,
        HTMLAttributes: {
          class: "tiptap-youtube",
        },
      }),
    ],
  });

  const { threads } = useThreads();

  // Wrap saveDocument in useCallback to prevent unnecessary re-renders
  const saveDocument = useCallback(async () => {
    try {
      if (!editor || !docId || editor.isDestroyed) return; // Added editor.isDestroyed check

      const content = editor.getJSON();
      toast({
        title: `Saving Document`,
      });

      const res = await axiosInstance.patch(
        `/documents/save/${docId}`,
        content
      );

      console.log(res.data);
      toast({
        title: `Document Saved`,
        description: "All changes have been saved successfully.",
      });
    } catch (error) {
      console.error("Failed to save document", error);
      toast({
        title: "Error saving document ❌",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  }, [editor, docId, toast]);

  // Ensure component only renders after client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch document content
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        if (!docId || !editor) return;
        const res = await axiosInstance.get(`/documents/get/${docId}`);
        const docContent = res.data?.document?.content;
        if (docContent) {
          editor.commands.setContent(docContent);
        }
      } catch (error) {
        console.error("Failed to load document:", error);
      }
    };
    fetchDocument();
  }, [editor, docId]);

  // Keyboard shortcut for saving (Ctrl+S)
  useEffect(() => {
    const handlekeydown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        // Check if editor is still valid before saving
        if (editor && !editor.isDestroyed) {
          saveDocument();
        }
      }
    };

    window.addEventListener("keydown", handlekeydown);
    return () => window.removeEventListener("keydown", handlekeydown);
  }, [editor, docId, saveDocument]); // Added saveDocument to dependencies

  // Auto-save interval (every 2 minutes)
  useEffect(() => {
    if (!editor || !docId) return;

    const interval = setInterval(
      () => {
        // Check if editor is still valid before saving
        if (editor && !editor.isDestroyed) {
          saveDocument();
        }
      },
      2 * 60 * 1000
    );

    return () => clearInterval(interval);
  }, [editor, docId, saveDocument]); // Added saveDocument to dependencies

  // Save on beforeunload (page refresh/close)
  useEffect(() => {
    if (!editor || !docId) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Only save if editor is still valid
      if (editor && !editor.isDestroyed) {
        saveDocument();
      }
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // REMOVED: saveDocument(); - This was causing the DOM manipulation error
    };
  }, [editor, docId, saveDocument]); // Added saveDocument to dependencies

  // Clean up editor on unmount
  useEffect(() => {
    return () => {
      if (editor && !editor.isDestroyed) {
        editor.destroy();
      }
    };
  }, [editor]);

  // Don't render until mounted on client
  if (!mounted) {
    return <DocumentSpinner />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.editorHeader}>
        <StaticToolbar editor={editor} />
        <Button
          onClick={saveDocument}
          variant="outline"
          size="sm"
          className="ml-2 flex items-center gap-1"
        >
          <Save className="w-4 h-4" />
          Save
        </Button>
        <Avatars />
      </div>
      <div className={styles.editorPanel}>
        <SelectionToolbar editor={editor} />
        <EditorContent editor={editor} className={styles.editorContainer} />
        <FloatingComposer editor={editor} style={{ width: 350 }} />
        <FloatingThreads threads={threads} editor={editor} />
      </div>
    </div>
  );
}

// Prevents a matchesNode error on hot reloading
EditorView.prototype.updateState = function updateState(state) {
  // @ts-ignore
  if (!this.docView) return;
  // @ts-ignore
  this.updateStateInner(state, this.state.plugins != state.plugins);
};
