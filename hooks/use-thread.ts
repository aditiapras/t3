// hooks/useThreads.ts

import type { UIMessage } from "ai";
import useSWRImmutable from "swr/immutable";
import { getThread, getThreadMessage } from "@/app/chat/actions/actions";

// fetcher-nya langsung panggil server action
const fetcher = () => getThread();
const fetcherMessage = (threadId: string) => getThreadMessage(threadId);

export function useThreads() {
  const { data, error, isLoading, mutate } = useSWRImmutable(
    "threads",
    fetcher
  );

  return {
    threads: data ?? [],
    isLoading,
    isError: error,
    mutateThreads: mutate,
  };
}

export function useThreadMessage(threadId: string) {
  const { data, error, isLoading, mutate } = useSWRImmutable(
    threadId,
    fetcherMessage
  );

  // Transform database messages to UIMessage format for useChat compatibility
  const transformedMessages: UIMessage[] = (data ?? []).map(
    (dbMessage: any) => ({
      id: dbMessage.messageId,
      role: dbMessage.role as "user" | "assistant" | "system",
      parts: dbMessage.parts.map((part: any) => {
        if (part.type === "text") {
          return {
            type: "text" as const,
            text: part.text,
          };
        } else if (part.type === "reasoning") {
          return {
            type: "reasoning" as const,
            text: part.text,
          };
        }
        return {
          type: "text" as const,
          text: part.text || "",
        };
      }),
    })
  );

  return {
    messages: transformedMessages,
    isLoading,
    isError: error,
    mutateMessages: mutate,
  };
}
