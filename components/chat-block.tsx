"use client";
import { useUser } from "@clerk/nextjs";
import { GlobeIcon } from "lucide-react";
import { useState } from "react";
import { createThread } from "@/app/chat/actions/actions";
import {
  PromptInput,
  PromptInputButton,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";

interface Model {
  modelId: string;
  name: string;
}[]

export default function ChatBlock({ models }: { models: Model[] }) {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState<string>(models[0].modelId);
  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    localStorage.setItem("model", model);
    localStorage.setItem("prompt", prompt);
    await createThread(model, user?.id as string);
    setPrompt("");
  };
  return (
    <div className="flex flex-col flex-1 h-full justify-center">
      <div className="sticky bottom-0 px-3 md:px-0">
        <div className="p-2 border rounded-2xl bg-gradient-to-b from-border/50 to-muted/20 backdrop-blur-sm">
          <PromptInput
            onSubmit={handleSubmit}
            className="shadow-none border-border/50"
          >
            <PromptInputTextarea
              onChange={(e) => setPrompt(e.target.value)}
              value={prompt}
            />
            <PromptInputToolbar>
              <PromptInputTools>
                <PromptInputButton type="button">
                  <GlobeIcon className="size-4" />
                  <span>Search</span>
                </PromptInputButton>
                <PromptInputModelSelect
                  onValueChange={(value) => {
                    setModel(value);
                  }}
                  value={model}
                >
                  <PromptInputModelSelectTrigger>
                    <PromptInputModelSelectValue />
                  </PromptInputModelSelectTrigger>
                  <PromptInputModelSelectContent>
                    {models.map((model) => (
                      <PromptInputModelSelectItem
                        key={model.modelId}
                        value={model.modelId}
                      >
                        {model.name}
                      </PromptInputModelSelectItem>
                    ))}
                  </PromptInputModelSelectContent>
                </PromptInputModelSelect>
              </PromptInputTools>
              <PromptInputSubmit disabled={!prompt} />
            </PromptInputToolbar>
          </PromptInput>
        </div>
      </div>
    </div>
  );
}
