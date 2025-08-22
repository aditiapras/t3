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
import { useThreadMessage, useThreads } from "@/hooks/use-thread";
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

export default function ThreadBlock({ threadMessage }: { threadMessage: any }) {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState<string>(models[0].id);
  const { messages, sendMessage, status, setMessages } = useChat();
  const hasInitialized = useRef(false);
  const { id } = useParams();
  const { user } = useUser();
  const { mutateThreads } = useThreads(user?.id as string);
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
          { body: { model: initialModel, threadId: id } },
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
