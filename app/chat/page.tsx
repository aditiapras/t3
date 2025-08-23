import type { Metadata } from "next";
import ChatBlock from "@/components/chat-block";
import { getModels } from "../settings/actions";

export const metadata: Metadata = {
  title: "Chat",
  description: "Chat with AI",
};

async function getModelsData() {
  try {
    const models = await getModels();
    const formatModels = models.map((model) => ({
      modelId: model.modelId,
      name: model.name,
    }));
    return formatModels;
  } catch (error) {
    console.error('Error fetching models:', error);
    return [];
  }
}

export default async function page() {
  const models = await getModelsData();
  return (
    <div className="flex flex-1 flex-col gap-4 relative">
      <div className="max-w-4xl mx-auto relative size-full h-full">
        <ChatBlock models={models} />
      </div>
    </div>
  );
}
