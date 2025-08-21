"use client";

import { Loader2, MoreHorizontal, Pin, TextCursor, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { deleteThread } from "@/app/chat/actions/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useThreads } from "@/hooks/use-thread";

export function NavProjects() {
  const { isMobile } = useSidebar();
  const { threads, isLoading, mutateThreads } = useThreads();
  const { id } = useParams();

  const handleDeleteThread = async (threadId: string) => {
    await deleteThread(threadId, id);
    mutateThreads();
  };

  if (isLoading) return null;

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Threads</SidebarGroupLabel>
      <SidebarMenu>
        {threads.map(({ threadId, title }) => (
          <SidebarMenuItem key={threadId}>
            <SidebarMenuButton asChild>
              <Link href={`/chat/${threadId}`}>
                {title === "New Thread" ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin size-4" /> New Thread
                  </span>
                ) : (
                  <span className="">{title}</span>
                )}
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <Pin className="text-muted-foreground" />
                  <span>Pin Thread</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <TextCursor className="text-muted-foreground" />
                  <span>Rename Thread</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" asChild>
                  <button
                    type="button"
                    className="flex items-center gap-2 w-full"
                    onClick={() => handleDeleteThread(threadId)}
                  >
                    <Trash2 className="text-muted-foreground" />
                    <span>Delete Thread</span>
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
