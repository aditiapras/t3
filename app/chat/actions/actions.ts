"use server";

import { gateway } from "@ai-sdk/gateway";
import { generateText } from "ai";
import { revalidatePath } from "next/cache";
import type { ParamValue } from "next/dist/server/request/params";
import { redirect } from "next/navigation";
import { prisma } from "../../../lib/prisma";

export const createThread = async (model: string) => {
  const create = await prisma.threads.create({
    data: {
      model,
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
    prompt,
    system: `\n
          - you will generate a short title based on the first message a user begins a conversation with
          - ensure it is not more than 8 words long
          - the title should be a summary of the user's message
          - do not use quotes or colons
          - do not make the title too generic or too short
          - you can use emojis or emoticons if you want
          - if you use emojis, always put emoji at the start of the title`,
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
  const thread = await prisma.threads.findMany({
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

export const getThreadMessage = async(threadId: string) => {
  const threadMessage = await prisma.messages.findMany({
    where: {
      threadId,
    },
    include:{
      parts:true
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  return threadMessage;
};