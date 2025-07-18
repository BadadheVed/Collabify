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
import { useEffect, useState, useCallback, useRef } from "react";
import { DocumentSpinner } from "../primitives/Spinner";
import { CustomTaskItem } from "./CustomTaskItem";
import { StaticToolbar, SelectionToolbar } from "./Toolbars";
import styles from "./TextEditor.module.css";
import { Avatars } from "./Avatars";
import { useSearchParams } from "next/navigation";
import { axiosInstance } from "@/axiosSetup/axios";
import { toast, useToast } from "@/hooks/use-toast";
import {
  Bot,
  Save,
  Send,
  X,
  User,
  Minimize2,
  Maximize2,
  Copy,
  Edit,
  FileText,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: string;
}

interface ApiResponse {
  response: string;
}

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
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [isAiPanelMinimized, setIsAiPanelMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>("");
  const [copiedButtons, setCopiedButtons] = useState<Set<string>>(new Set());
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);

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

  // Chat functions
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (): Promise<void> => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Get current editor content for context
      const editorContent = editor?.getText() || "";

      // Call the Gemini API - removed unnecessary JSON.stringify wrapper
      const response = await axiosInstance.post("/documents/gemini", {
        message: inputValue,
        context: {
          documentContent: editorContent,
          documentId: docId,
        },
      });

      const data: ApiResponse = response.data;

      const aiMessage: Message = {
        id: Date.now() + 1,
        text: data.response || "Sorry, I couldn't process your request.",
        sender: "ai",
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "Sorry, there was an error processing your request. Please try again.",
        sender: "ai",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = (): void => {
    setMessages([]);
  };

  // New functions for copy and edit features
  const copyToClipboard = async (
    text: string,
    buttonId: string
  ): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedButtons((prev) => new Set([...Array.from(prev), buttonId]));
      setTimeout(() => {
        setCopiedButtons((prev) => {
          const newSet = new Set(prev);
          newSet.delete(buttonId);
          return newSet;
        });
      }, 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
      toast({
        title: "Copy failed",
        description: "Could not copy text to clipboard",
        variant: "destructive",
      });
    }
  };

  const copyToEditor = (text: string): void => {
    if (!editor) return;

    // Insert text at current cursor position
    editor.commands.insertContent(text);
    toast({
      title: "Content added",
      description: "AI response has been added to your document",
    });
  };

  const startEditing = (message: Message): void => {
    setEditingMessageId(message.id);
    setEditingText(message.text);
  };

  const saveEdit = (): void => {
    if (!editingMessageId || !editingText.trim()) return;

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === editingMessageId ? { ...msg, text: editingText } : msg
      )
    );

    setEditingMessageId(null);
    setEditingText("");
  };

  const cancelEdit = (): void => {
    setEditingMessageId(null);
    setEditingText("");
  };

  const handleEditKeyPress = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      saveEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  // Wrap saveDocument in useCallback to prevent unnecessary re-renders
  const saveDocument = useCallback(async () => {
    try {
      if (!editor || !docId || editor.isDestroyed) return;

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

  // Chat panel effects
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isAiPanelOpen && !isAiPanelMinimized) {
      inputRef.current?.focus();
    }
  }, [isAiPanelOpen, isAiPanelMinimized]);

  // Focus edit textarea when editing starts
  useEffect(() => {
    if (editingMessageId && editTextareaRef.current) {
      editTextareaRef.current.focus();
    }
  }, [editingMessageId]);

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
  }, [editor, docId, saveDocument]);

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
  }, [editor, docId, saveDocument]);

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
    };
  }, [editor, docId, saveDocument]);

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
        <Button
          onClick={() => setIsAiPanelOpen(true)}
          variant="outline"
          size="sm"
          className="ml-2 flex items-center gap-1 bg-grey-800"
        >
          <Bot className="w-4 h-4" />
          Ask AI
        </Button>
        <Avatars />
      </div>

      <div className={styles.editorPanel} ref={editorContainerRef}>
        <SelectionToolbar editor={editor} />
        <EditorContent editor={editor} className={styles.editorContainer} />
        <FloatingComposer editor={editor} style={{ width: 350 }} />
        <FloatingThreads threads={threads} editor={editor} />

        {/* AI Chat Panel - positioned relative to editor */}
        {isAiPanelOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex items-center justify-center">
            <div
              className="bg-white rounded-lg shadow-2xl w-[600px] flex flex-col"
              style={{ maxHeight: "90vh" }}
            >
              {/* Header */}
              <div className="bg-blue-600 text-white p-4 flex items-center justify-between rounded-t-lg">
                <div className="flex items-center space-x-2">
                  <Bot className="w-6 h-6" />
                  <h2 className="text-lg font-semibold">AI Assistant</h2>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsAiPanelMinimized(!isAiPanelMinimized)}
                    className="p-1 hover:bg-blue-700 rounded"
                    title={isAiPanelMinimized ? "Maximize" : "Minimize"}
                  >
                    {isAiPanelMinimized ? (
                      <Maximize2 className="w-4 h-4" />
                    ) : (
                      <Minimize2 className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => setIsAiPanelOpen(false)}
                    className="p-1 hover:bg-blue-700 rounded"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Content */}
              {!isAiPanelMinimized && (
                <div className="flex flex-col flex-1 min-h-0">
                  {/* Messages Area */}
                  <div
                    className="flex-1 overflow-y-auto p-4 space-y-4"
                    style={{ maxHeight: "65vh" }}
                  >
                    {messages.length === 0 && (
                      <div className="text-center text-gray-500 mt-8">
                        <Bot className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p>
                          Hi! I'm your AI assistant. Ask me anything about your
                          document or any other questions you have.
                        </p>
                      </div>
                    )}

                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-lg px-4 py-2 rounded-lg ${
                            message.sender === "user"
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          <div className="flex items-start space-x-2">
                            {message.sender === "ai" && (
                              <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            )}
                            {message.sender === "user" && (
                              <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              {editingMessageId === message.id ? (
                                <div className="space-y-2">
                                  <textarea
                                    ref={editTextareaRef}
                                    value={editingText}
                                    onChange={(e) =>
                                      setEditingText(e.target.value)
                                    }
                                    onKeyPress={handleEditKeyPress}
                                    className="w-full p-2 border rounded text-gray-800 text-sm resize-none"
                                    rows={3}
                                  />
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={saveEdit}
                                      className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                                    >
                                      Save
                                    </button>
                                    <button
                                      onClick={cancelEdit}
                                      className="px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <p className="text-sm whitespace-pre-wrap">
                                    {message.text}
                                  </p>
                                  <p className="text-xs opacity-70 mt-1">
                                    {message.timestamp}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action buttons for AI messages */}
                          {message.sender === "ai" &&
                            editingMessageId !== message.id && (
                              <div className="flex items-center justify-end space-x-2 mt-2 pt-2 border-t border-gray-200">
                                <button
                                  onClick={() =>
                                    copyToClipboard(
                                      message.text,
                                      `copy-${message.id}`
                                    )
                                  }
                                  className="p-1 hover:bg-gray-200 rounded text-gray-600 hover:text-gray-800"
                                  title="Copy to clipboard"
                                >
                                  {copiedButtons.has(`copy-${message.id}`) ? (
                                    <Check className="w-3 h-3 text-green-600" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                                <button
                                  onClick={() => copyToEditor(message.text)}
                                  className="p-1 hover:bg-gray-200 rounded text-gray-600 hover:text-gray-800"
                                  title="Copy to editor"
                                >
                                  <FileText className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => startEditing(message)}
                                  className="p-1 hover:bg-gray-200 rounded text-gray-600 hover:text-gray-800"
                                  title="Edit message"
                                >
                                  <Edit className="w-3 h-3" />
                                </button>
                              </div>
                            )}

                          {/* Action buttons for user messages */}
                          {message.sender === "user" &&
                            editingMessageId !== message.id && (
                              <div className="flex items-center justify-end space-x-2 mt-2 pt-2 border-t border-blue-500/30">
                                <button
                                  onClick={() => startEditing(message)}
                                  className="p-1 hover:bg-blue-700 rounded text-blue-200 hover:text-white"
                                  title="Edit message"
                                >
                                  <Edit className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                        </div>
                      </div>
                    ))}

                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 text-gray-800 max-w-lg px-4 py-2 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Bot className="w-4 h-4" />
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="border-t bg-gray-50 p-4 rounded-b-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <button
                        onClick={clearChat}
                        className="text-xs text-gray-500 hover:text-gray-700"
                        disabled={messages.length === 0}
                      >
                        Clear Chat
                      </button>
                    </div>
                    <div className="flex space-x-2">
                      <textarea
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          setInputValue(e.target.value)
                        }
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={2}
                        disabled={isLoading}
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isLoading}
                        className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
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
