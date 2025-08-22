import { UserButton } from "@clerk/nextjs";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 justify-between items-center bg-background md:bg-transparent items-center sticky top-0 z-50 gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="p-2">
            <SidebarTrigger className="peer-data-[state=expanded]:hidden" />
          </div>
          <div className="flex px-4">
            <UserButton />
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
