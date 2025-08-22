import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);
    const { id } = evt.data;
    if (evt.type === "user.created") {
      await prisma.users.create({
        data: {
          clerkId: id || "",
          firstName: evt.data.first_name || "",
          lastName: evt.data.last_name || "",
          imageUrl: evt.data.image_url || "",
          email: evt.data.email_addresses[0].email_address || "",
        },
      });
    }

    if (evt.type === "user.updated") {
      await prisma.users.update({
        where: {
          clerkId: id || "",
        },
        data: {
          firstName: evt.data.first_name || "",
          lastName: evt.data.last_name || "",
          imageUrl: evt.data.image_url || "",
          email: evt.data.email_addresses[0].email_address || "",
        },
      });
    }

    if (evt.type === "user.deleted") {
      await prisma.users.delete({
        where: {
          clerkId: id || "",
        },
      });
    }
    console.log("Webhook received", { id, evt, success: true, status: 200 });
    return NextResponse.json({ message: "User updated successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to verify webhook" },
      { status: 500 },
    );
  }
}
