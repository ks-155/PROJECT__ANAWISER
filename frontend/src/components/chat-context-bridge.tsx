"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAnawiserChat } from "./chat-context";
import type { ChatContext } from "@/lib/assistant";

export function ChatContextBridge(props: Omit<ChatContext, "path">) {
  const { setContext } = useAnawiserChat();
  const path = usePathname();

  useEffect(() => {
    setContext({ ...props, path });
    return () => setContext({ path });
  }, [path, props.productName, props.category, props.prices, props.localPrices, setContext]);

  return null;
}
