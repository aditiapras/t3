"use client";
import { Button } from "@/components/ui/button";
import { ClerkLoaded, UserButton } from "@clerk/nextjs";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

export default function TriggerSidebar() {
  const { state, isMobile } = useSidebar();
  return (
    <header
      suppressHydrationWarning
      className="flex h-16 shrink-0 justify-between items-center sticky top-0 z-50 gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
    >
      <div className="px-2">
        <div className="flex items-center gap-1 bg-border/80 backdrop-blur-sm rounded-md p-1">
          <SidebarTrigger />
          {state === "collapsed" && (
            <Link href="/chat">
              <Button size={"icon"} className="size-7" variant={"ghost"}>
                <PlusIcon />
              </Button>
            </Link>
          )}
        </div>
      </div>
      {!isMobile && (
        <div className="flex px-4" suppressHydrationWarning>
          <ClerkLoaded>
            <UserButton />
          </ClerkLoaded>
        </div>
      )}
    </header>
  );
}
