// app/chat/[id]/title-updater.tsx
"use client";
import { useEffect } from "react";
import { useSWRConfig } from "swr";
import { generateTitle } from "@/app/chat/actions/actions";

interface Props {
  threadId: string;
  prompt: string;
  currentTitle: string | null;
}

export default function TitleUpdater({
  threadId,
  prompt,
  currentTitle,
}: Props) {
  const { mutate } = useSWRConfig();

  useEffect(() => {
    // jika judul masih default → generate
    if (currentTitle === "New Thread") {
      (async () => {
        await generateTitle(threadId, prompt);
        mutate("threads");
        mutate(`title-${threadId}`);
      })();
    }
  }, [currentTitle, threadId, prompt, mutate]);

  // komponen ini tidak render apa-apa
  return null;
}
