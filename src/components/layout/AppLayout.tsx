import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Outlet } from "react-router-dom";
import { NotificationsDropdown } from "@/components/NotificationsDropdown";
import { useAuth } from "@/hooks/useAuth";

export function AppLayout() {
  const { profile, role } = useAuth();
  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "??";
  const roleName = role === "super_admin" ? "Super Admin" : role === "guardian" ? "Guardian" : "Kullanıcı";

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
                  {initials}
                </div>
                <div className="hidden sm:block text-sm">
                  <p className="font-medium leading-none">{profile?.full_name || "Kullanıcı"}</p>
                  <p className="text-muted-foreground text-xs">{roleName} · {profile?.email}</p>
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
