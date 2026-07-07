"use client";

import { ChatInterface } from "@/components/chat/chat-interface";
import { useAuthStore } from "@/stores/auth-store";

export default function ChatPage() {
  const { user } = useAuthStore();
  
  if (!user) return null;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <ChatInterface />
    </div>
  );
}
