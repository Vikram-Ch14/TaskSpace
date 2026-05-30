import { Outlet } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/Sidebar";

export const Layout = () => (
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset className="overflow-hidden">
      <Outlet />
    </SidebarInset>
  </SidebarProvider>
);
