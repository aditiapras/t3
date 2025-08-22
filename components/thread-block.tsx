"use client";
import { useChat } from "@ai-sdk/react";
import { useUser } from "@clerk/nextjs";
import { GlobeIcon, MicIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { generateTitle } from "@/app/chat/actions/actions";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Loader } from "@/components/ai-elements/loader";
import { Message, MessageContent } from "@/components/ai-elements/message";
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
import { Response } from "@/components/ai-elements/response";
import { useThreads } from "@/hooks/use-thread";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "./ai-elements/reasoning";

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

export default function ThreadBlock({ threadMessage }: { threadMessage: any }) {
  const [prompt, setPrompt] = useState("");

  // Get the model from the last message, fallback to first model in array
  const getDefaultModel = () => {
    if (threadMessage && threadMessage.length > 0) {
      const lastMessage = threadMessage[threadMessage.length - 1];
      if (lastMessage?.model) {
        return lastMessage.model;
      }
    }
    return models[0].id;
  };

  const [model, setModel] = useState<string>(getDefaultModel());
  const { messages, sendMessage, status, setMessages } = useChat();
  const hasInitialized = useRef(false);
  const { id } = useParams();
  const { mutateThreads } = useThreads();
  // const { messages: threadMessage, isLoading: isLoadingThreadMessage } = useThreadMessage(id as string);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      sendMessage({ text: prompt }, { body: { model, threadId: id } });
      setPrompt("");
    }
  };

  useEffect(() => {
    if (!hasInitialized.current) {
      mutateThreads();
      const initialMessage = localStorage.getItem("prompt");
      const initialModel = localStorage.getItem("model");
      if (initialMessage && initialModel && id) {
        setPrompt(initialMessage);
        setModel(initialModel);
        sendMessage(
          { text: initialMessage },
          { body: { model: initialModel, threadId: id } }
        );
        generateTitle(id as string, initialMessage).then(() => {
          mutateThreads();
        });
        setPrompt("");
      }
      hasInitialized.current = true;
      localStorage.removeItem("prompt");
      localStorage.removeItem("model");
    }
  }, [sendMessage, id, mutateThreads]);

  // Load existing thread messages when threadMessage data is available
  const hasLoadedMessages = useRef(false);

  useEffect(() => {
    if (
      threadMessage &&
      threadMessage.length > 0 &&
      !hasLoadedMessages.current
    ) {
      setMessages(threadMessage);
      hasLoadedMessages.current = true;
    }
  }, [threadMessage, setMessages]);

  // Reset the loaded flag when thread ID changes
  useEffect(() => {
    hasLoadedMessages.current = false;
  }, []);

  // if (isLoadingThreadMessage) {
  //   return null
  // }

  return (
    <div className="flex flex-col flex-1 h-full justify-center">
      <Conversation>
        <ConversationContent>
          {messages.map((message) => (
            <Message from={message.role} key={message.id}>
              <MessageContent>
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case "text": // we don't use any reasoning or tool calls in this example
                      return (
                        <Response key={`${message.id}-${i}`}>
                          {part.text}
                        </Response>
                      );
                    case "reasoning": // we don't use any reasoning or tool calls in this example
                      return (
                        <Reasoning key={`${message.id}-${i}`}>
                          <ReasoningTrigger />
                          <ReasoningContent>{part.text}</ReasoningContent>
                        </Reasoning>
                      );
                    default:
                      return null;
                  }
                })}
              </MessageContent>
            </Message>
          ))}
          {status === "streaming" && <Loader className="px-4" />}
        </ConversationContent>
        <ConversationScrollButton className="absolute top-4 left-[50%] translate-x-[-50%] rounded-full" />
      </Conversation>
      <div className="sticky bottom-0 px-3 md:px-0">
        <div className="p-2 border rounded-t-2xl bg-gradient-to-b from-border/50 to-muted/20 backdrop-blur-md">
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
              <PromptInputSubmit disabled={!prompt || !model} />
            </PromptInputToolbar>
          </PromptInput>
        </div>
      </div>
    </div>
  );
}
