import { gateway } from "@ai-sdk/gateway";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { MessageService } from "@/lib/message-service";

export async function POST(req: Request) {
  const {
    messages,
    model,
    threadId,
  }: { messages: UIMessage[]; model: string; threadId: string } =
    await req.json();

  const lastMessage = messages[messages.length - 1];
  if (lastMessage && lastMessage.role === "user" && threadId) {
    try {
      // Extract text content from UIMessage parts
      let userMessageContent = "";
      const userParts: Array<{ type: string; text?: string }> = [];

      // UIMessage has parts array structure
      if (lastMessage.parts && Array.isArray(lastMessage.parts)) {
        for (const part of lastMessage.parts) {
          if (part.type === "text" && part.text) {
            userMessageContent += part.text;
            userParts.push({ type: "text", text: part.text });
          }
        }
      }

      // Create message parts for database
      const messageParts = MessageService.createUserMessageParts(userParts);

      await MessageService.createMessageWithParts({
        role: "user",
        content: userMessageContent,
        model,
        threadId,
        status: "completed",
        parts: messageParts,
      });

      console.log("✅ User message saved successfully");
    } catch (error) {
      console.error(`❌ Failed to create user message: ${error}`);
    }
  }

  const result = streamText({
    model: gateway(model),
    messages: convertToModelMessages(messages),
    system:
      "You are a helpful assistant named jipi-q (read jipi kyu). Always answer in a polite and professional manner. With Friendly, courious, empathetic, and helpful personality.",
    onFinish: async ({ text, usage, reasoningText }) => {
      if (threadId && text) {
        try {
          // Create assistant message parts
          const assistantParts = MessageService.createAssistantMessageParts(
            text,
            reasoningText,
          );

          await MessageService.createMessageWithParts({
            role: "assistant",
            content: text,
            model,
            threadId,
            status: "completed",
            tokens: usage?.totalTokens,
            tokensPerSecond: usage?.totalTokens ? usage.totalTokens / 1000 : 0,
            parts: assistantParts,
          });

          console.log("✅ Assistant message saved successfully");
        } catch (error) {
          console.error(`❌ Failed to create assistant message: ${error}`);
        }
      }
    },
  });

  return result.toUIMessageStreamResponse({
    sendReasoning: true,
    sendSources: true,
  });
}
