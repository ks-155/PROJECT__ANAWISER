"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { ChatContext } from "@/lib/assistant";

type Value = {
  context: ChatContext;
  setContext: (ctx: ChatContext) => void;
};

const ChatCtx = createContext<Value | null>(null);

export function AnawiserChatProvider({ children }: { children: React.ReactNode }) {
  const [context, setContext] = useState<ChatContext>({});
  const value = useMemo(() => ({ context, setContext }), [context]);
  return <ChatCtx.Provider value={value}>{children}</ChatCtx.Provider>;
}

export function useAnawiserChat() {
  const ctx = useContext(ChatCtx);
  if (!ctx) throw new Error("AnawiserChatProvider missing");
  return ctx;
}
