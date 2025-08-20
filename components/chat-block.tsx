"use client";
import { GlobeIcon, MicIcon } from "lucide-react";
import { useState } from "react";
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

import { createThread } from "@/lib/actions";

const models = [
  {
    id: "openai/gpt-oss-120b",
    name: "GPT-OSS-120B",
  },
  {
    id: "openai/gpt-4o-mini",
    name: "GPT-4o Mini",
  },
  {
    id: "openai/gpt-4o",
    name: "GPT-4o",
  },
  {
    id: "alibaba/qwen-3-235b",
    name: "Qwen3 235B A22B Instruct 2507",
  },
  {
    id: "moonshotai/kimi-k2",
    name: "Kimi K2",
  },
];

export default function ChatBlock() {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState<string>(models[0].id);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    localStorage.setItem("model", model);
    localStorage.setItem("prompt", prompt);
    await createThread(model);
    setPrompt("");
  };
  return (
    <div className="flex flex-col flex-1 h-full justify-center">
      <div className="sticky bottom-0 px-3 md:px-0">
        <div className="p-2 border rounded-2xl bg-gradient-to-b from-border/50 to-muted/20 backdrop-blur-sm">
          <PromptInput
            onSubmit={handleSubmit}
            className="shadow-none border-border"
          >
            <PromptInputTextarea
              onChange={(e) => setPrompt(e.target.value)}
              value={prompt}
            />
            <PromptInputToolbar>
              <PromptInputTools>
                <PromptInputButton>
                  <MicIcon size={16} />
                </PromptInputButton>
                <PromptInputButton>
                  <GlobeIcon size={16} />
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
                        key={model.id}
                        value={model.id}
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
