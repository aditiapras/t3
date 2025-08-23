import type { UIMessage } from "ai";
import type { Metadata } from "next";
import { getThreadMessage, getTitle } from "@/app/chat/actions/actions";
import { getModels } from "@/app/settings/actions";
import ThreadBlock from "@/components/thread-block";

type Props = {
  params: {
    id: string;
  };
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  // fetch data
  const title = await getTitle(id);
  console.log("title call from page");

  return {
    title: title || "Loading...",
  };
}

interface DbMessage {
  messageId: string;
  model: string;
  role: string;
  parts: Array<{
    type: string;
    text: string;
  }>;
}

interface Model {
  modelId: string;
  name: string;
}

async function getModelsData() {
  const models = await getModels();
  const formatModels = models.map((model: Model) => ({
    modelId: model.modelId,
    name: model.name,
  }));
  return formatModels;
}

async function getThreadMessageData(id: string) {
  const threadMessage = await getThreadMessage(id);
  return threadMessage;
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const [models, threadMessage] = await Promise.all([
    getModelsData(),
    getThreadMessageData(id),
  ]);
  const transformedMessages: UIMessage[] = (threadMessage ?? []).map(
    (dbMessage: DbMessage) => ({
      id: dbMessage.messageId,
      model: dbMessage.model,
      role: dbMessage.role as "user" | "assistant" | "system",
      parts: dbMessage.parts.map((part: { type: string; text: string }) => {
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
    }),
  );

  return (
    <div className="flex flex-1 flex-col gap-4 relative">
      <div className="max-w-4xl mx-auto relative size-full h-full">
        <ThreadBlock threadMessage={transformedMessages} models={models} />
      </div>
    </div>
  );
}
