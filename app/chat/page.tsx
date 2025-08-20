import type { Metadata } from "next";
import ChatBlock from "@/components/chat-block";

export const metadata: Metadata = {
    title: "Chat",
    description: "Chat with AI",
};

export default function page() {
    return (
        <div className="flex flex-1 flex-col gap-4 relative">
            <div className="max-w-4xl mx-auto relative size-full h-full">
                <ChatBlock />
            </div>
        </div>
    );
}
