import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Outlet } from "react-router-dom";
import { NotificationsDropdown } from "@/components/NotificationsDropdown";

export function AppLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full dark">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-screen">
          <header className="h-14 flex items-center justify-between border-b border-border px-4 bg-card">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Dijital Aktivite Analizi ve Cihaz Yönetim Platformu
              </span>
            </div>
            <div className="flex items-center gap-3">
              <NotificationsDropdown />
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                  SA
                </div>
                <div className="hidden sm:block text-sm">
                  <p className="font-medium leading-none">Super Admin</p>
                  <p className="text-muted-foreground text-xs">admin@clearhuma.com</p>
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
