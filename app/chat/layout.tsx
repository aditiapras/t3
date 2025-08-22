import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import TriggerSidebar from "@/components/sidebar-trigger";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <TriggerSidebar />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
