"use client";
import { ClerkLoaded, UserButton } from "@clerk/nextjs";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

export default function TriggerSidebar() {
  const { state, isMobile } = useSidebar();
  const pathname = usePathname();
  return (
    <header
      suppressHydrationWarning
      className="flex h-16 shrink-0 justify-between items-center sticky top-0 z-50 gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
    >
      <div className="px-2">
        <div className="flex items-center gap-1 bg-border/80 backdrop-blur-sm rounded-md p-1">
          <SidebarTrigger />
          {(state === "collapsed" || isMobile) && (
            <Button size={"icon"} className="size-7" variant={"ghost"} disabled={pathname === "/chat"}>
              <Link href="/chat">
                <PlusIcon />
              </Link>
            </Button>
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
