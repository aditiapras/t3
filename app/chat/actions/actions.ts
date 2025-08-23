"use server";

import { gateway } from "@ai-sdk/gateway";
import { auth } from "@clerk/nextjs/server";
import { generateText } from "ai";
import { revalidatePath } from "next/cache";
import type { ParamValue } from "next/dist/server/request/params";
import { redirect } from "next/navigation";
import { prisma } from "../../../lib/prisma";

export const createThread = async (model: string, userId?: string) => {
  const create = await prisma.threads.create({
    data: {
      model,
      userId,
    },
    select: {
      threadId: true,
    },
  });

  console.log("thread create with ID:", create.threadId);

  return redirect(`/chat/${create.threadId}`);
};

export const deleteThread = async (
  threadId: string,
  currentPath: ParamValue,
) => {
  await prisma.threads.delete({
    where: {
      threadId,
    },
  });
  console.log("thread deleted with ID:", threadId);
  revalidatePath(`/chat`);
  revalidatePath(`/chat/${threadId}`);

  if (threadId === currentPath) {
    redirect(`/chat`);
  }
};

export const generateTitle = async (threadId: string, prompt: string) => {
  const { text } = await generateText({
    model: gateway("openai/gpt-4o-mini"),
    prompt: `Here are the first messages of the conversation: ${prompt}. Generate a title that accurately represents what this conversation is about based on the messages provided.`,
    system: `
    You are tasked with generating a concise, descriptive title for a chat conversation based on the initial messages. The title should:

1. Be 2-6 words long
2. Capture the main topic or question being discussed
3. Be clear and specific
4. Use title case (capitalize first letter of each major word)
5. Do not include quotation marks or special characters
6. Be professional and appropriate
7. You may use emojis or emoticons if you want to make it more engaging

Examples of good titles:
- Python Data Analysis Help
- React Component Design
- Travel Planning Italy
- Budget Spreadsheet Formula
- Career Change Advice

Generate a title that accurately represents what this conversation is about based on the messages provided.`,
  });

  await prisma.threads.update({
    where: {
      threadId,
    },
    data: {
      title: text,
    },
  });

  revalidatePath(`/chat`);
  revalidatePath(`/chat/${threadId}`);
  return null;
};

export const getTitle = async (threadId: string) => {
  const thread = await prisma.threads.findUnique({
    where: {
      threadId,
    },
    select: {
      title: true,
    },
  });
  if (!thread) return null;
  return thread.title;
};

export const getThread = async () => {
  const { userId } = await auth();
  const thread = await prisma.threads.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      threadId: true,
      title: true,
    },
  });
  return thread;
};

export const getThreadMessage = async (threadId: string) => {
  const threadMessage = await prisma.messages.findMany({
    where: {
      threadId,
    },
    include: {
      parts: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  return threadMessage;
};
