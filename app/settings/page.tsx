import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col w-full md:max-w-4xl lg:max-w-5xl mx-auto min-h-screen p-4">
      <div className="flex items-center justify-between">
        <Link href="/chat">
          <Button variant={"ghost"}>
            <ArrowLeft />
            Back to Chat
          </Button>
        </Link>
        <UserButton />
      </div>
    </div>
  );
}
