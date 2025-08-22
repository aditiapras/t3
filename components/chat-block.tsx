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

const models = [
  {
    id: "openai/gpt-oss-120b",
    name: "GPT-OSS-120B",
  },
  {
    id: "openai/gpt-5",
    name: "GPT-5",
  },
  {
    id: "openai/gpt-5-nano",
    name: "GPT-5 nano",
  },
  {
    id: "openai/gpt-5-mini",
    name: "GPT-5 mini",
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
    id: "anthropic/claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet",
  },
  {
    id: "anthropic/claude-3.7-sonnet",
    name: "Claude 3.7 Sonnet",
  },
  {
    id: "anthropic/claude-sonnet-4",
    name: "Claude Sonnet 4",
  },
  {
    id: "alibaba/qwen-3-235b",
    name: "Qwen3 235B Instruct",
  },
  {
    id: "alibaba/qwen3-coder",
    name: "Qwen3 Coder",
  },
  {
    id: "deepseek/deepseek-r1",
    name: "DeepSeek R1",
  },
  {
    id: "deepseek/deepseek-v1",
    name: "DeepSeek V3.1",
  },
  {
    id: "moonshotai/kimi-k2",
    name: "Kimi K2",
  },
];

export default function ChatBlock() {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState<string>(models[0].id);
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
