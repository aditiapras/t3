"use server";

import { gateway } from "@ai-sdk/gateway";
import { generateText } from "ai";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";

export const createThread = async (model: string) => {
  const create = await prisma.threads.create({
    data: {
      model,
    },
    select:{
      threadId: true,
    }
  });

  console.log("thread create with ID:", create.threadId);

  return redirect(`/chat/${create.threadId}`);
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
})

await prisma.threads.update({
    where: {
        id: threadId,
    },
    data: {
        title: text,
    },
})

  revalidatePath(`/chat`);
  revalidatePath(`/chat/${threadId}`);
  return null;
};

export const getTitle = async (threadId: string) => {
    const thread = await prisma.threads.findUnique({
        where: {
            threadId: threadId,
        },
        select:{
            title: true,
        }
    })
    console.log("thread title:", thread?.title);
    if (!thread) return null
    return thread.title
}
