"use client";
import React from "react";
import { Button } from "../ui/button";
import { PlusCircle, Send } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

function ChatInterface() {
  const {
    input,
    handleInputChange,
    handleSubmit,
    messages,
    status,
    setMessages,
  } = useChat();

  // Development flag to control message saving
  const ENABLE_MESSAGE_SAVING = false;
  const supabase = createClient();
  const saveMessage = (message: string, role: string) => {
    //TODO: Save message to database
    if (!ENABLE_MESSAGE_SAVING) return;

    try {
      const { error } = await supabase.from("chat_messages").insert([
        {
          session_id: chatSessionId,
          content,
          role,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;
    } catch (error) {
      console.error("Error saving message:", error);
      toast.error("Failed to save message");
    }
    console.log(message, role);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pb-3 pt-2 border-b rounded-lg border-white bg-secondary/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-primary hidden sm:block">
            AI Agent
          </h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 text-xs bg-primary text-white ml-auto"
        >
          <PlusCircle className="h-3.5 w-3.5" />
          New Chat
        </Button>
      </div>

      <div className="border-t border-gray-100 p-4">
        <div className="space-y-3">
          <form onSubmit={handleMessageSubmit} className="flex gap-2">
            <input
              className="focus:ring-primary flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm focus:border-transparent focus:ring-2 focus:outline-none"
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder={"Ask your agent anything..."}
            />
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 rounded-full px-4 py-2 text-sm text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              disabled={status === "streaming" || status === "submitted"}
            >
              {status === "streaming" ? (
                "AI is replying..."
              ) : status === "submitted" ? (
                "AI is thinking..."
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;
