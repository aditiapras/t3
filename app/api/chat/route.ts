import { gateway } from "@ai-sdk/gateway";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

export async function POST(req: Request) {
  const { messages, model }: { messages: UIMessage[]; model: string } =
    await req.json();

  const result = streamText({
    model: gateway(model),
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
