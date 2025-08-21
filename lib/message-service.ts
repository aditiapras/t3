import type { Prisma } from "@/app/generated/prisma";
import { prisma } from "@/lib/prisma";

export interface MessagePartData {
  type: "text" | "reasoning";
  text: string;
  reasoning?: string;
}

export interface CreateMessageData {
  role: "user" | "assistant";
  content: string;
  model: string;
  threadId: string;
  status: string;
  tokens?: number;
  tokensPerSecond?: number;
  parts?: MessagePartData[];
}

// Using namespace instead of class to avoid static-only class lint warning
export namespace MessageService {
  /**
   * Creates a message with its parts in a single optimized transaction
   * Prevents N+1 queries and ensures data consistency
   */
  export async function createMessageWithParts(data: CreateMessageData) {
    const { parts, ...messageData } = data;

    return await prisma.$transaction(async (tx) => {
      // Create the message first
      const message = await tx.messages.create({
        data: {
          ...messageData,
          updatedAt: new Date(),
        },
      });

      // Create message parts if they exist
      if (parts && parts.length > 0) {
        const partsData: Prisma.MessagePartsCreateManyInput[] = parts.map(
          (part) => ({
            messageId: message.messageId,
            type: part.type,
            text: part.text,
            reasoning: part.reasoning || "",
            status: "completed",
            updatedAt: new Date(),
          }),
        );

        await tx.messageParts.createMany({
          data: partsData,
        });
      }

      // Return the complete message with parts
      return await tx.messages.findUnique({
        where: { messageId: message.messageId },
        include: {
          parts: {
            orderBy: { createdAt: "asc" },
          },
        },
      });
    });
  }

  /**
   * Creates message parts for assistant responses
   * Handles both text and reasoning content
   */
  export function createAssistantMessageParts(
    text: string,
    reasoningText?: string,
  ): MessagePartData[] {
    const parts: MessagePartData[] = [];

    // Always create a text part for the main response
    if (text) {
      parts.push({
        type: "text",
        text: text,
      });
    }

    // Create a reasoning part if reasoning text exists
    if (reasoningText) {
      parts.push({
        type: "reasoning",
        text: reasoningText,
        reasoning: reasoningText,
      });
    }

    return parts;
  }

  /**
   * Creates message parts for user messages
   */
  export function createUserMessageParts(
    userParts: Array<{ type: string; text?: string }>,
  ): MessagePartData[] {
    return userParts
      .filter((part) => part.type === "text" && part.text)
      .map((part) => ({
        type: "text" as const,
        text: part.text || "",
      }));
  }

  /**
   * Batch create multiple messages with their parts
   * Useful for bulk operations
   */
  export async function createMultipleMessagesWithParts(
    messages: CreateMessageData[],
  ) {
    return await prisma.$transaction(async () => {
      const results = [];

      for (const messageData of messages) {
        const result = await createMessageWithParts(messageData);
        results.push(result);
      }

      return results;
    });
  }
}
