"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function addModel(formData: FormData) {
  const model = formData.get("model") as string;
  const modelId = formData.get("modelId") as string;
  const description = formData.get("description") as string;
  const provider = formData.get("provider") as string;
  const supportImage = formData.get("supportImage") as string;
  const supportFile = formData.get("supportFile") as string;
  const supportWebSearch = formData.get("supportWebSearch") as string;
  const hasReasoning = formData.get("hasReasoning") as string;
  const isPremium = formData.get("isPremium") as string;
  const freeModel = formData.get("freeModel") as string;

  try {
    await prisma.models.create({
      data: {
        name: model,
        modelId: modelId,
        description: description,
        provider: provider,
        supportImage: supportImage === "on",
        supportFile: supportFile === "on",
        supportWebSearch: supportWebSearch === "on",
        supportReasoning: hasReasoning === "on",
        isPremium: isPremium === "on",
        freeModel: freeModel === "on",
      },
    });
  } catch (error) {
    console.log(error);
  }

  revalidatePath("/settings");
  return;
}

export async function getModels() {
    const models = await prisma.models.findMany({
      orderBy: {
        provider: "asc",
      },
    });
    return models;
}