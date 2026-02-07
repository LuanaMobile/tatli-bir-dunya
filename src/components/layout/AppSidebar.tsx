import {
  LayoutDashboard,
  Users,
  Smartphone,
  ShieldCheck,
  ScrollText,
  CreditCard,
  BarChart3,
  Settings,
  Eye,
  LogOut,
  Receipt,
  Home,
  Bell,
  FileText,
  Download,
  Hammer,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const adminMainNav = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Kullanıcılar", url: "/users", icon: Users },
  { title: "Cihazlar", url: "/devices", icon: Smartphone },
  { title: "İzin Yönetimi", url: "/consents", icon: ShieldCheck },
  { title: "Audit Log", url: "/audit-logs", icon: ScrollText },
];

const adminManagementNav = [
  { title: "Abonelikler", url: "/subscriptions", icon: CreditCard },
  { title: "Faturalar", url: "/invoices", icon: Receipt },
  { title: "APK Yönetimi", url: "/apk-management", icon: Download },
  { title: "APK Build", url: "/apk-build", icon: Hammer },
  { title: "Raporlar", url: "/reports", icon: BarChart3 },
  { title: "Ayarlar", url: "/settings", icon: Settings },
];

const userMainNav = [
  { title: "Ana Sayfa", url: "/dashboard", icon: Home },
  { title: "Cihazlarım", url: "/devices", icon: Smartphone },
  { title: "İzinlerim", url: "/consents", icon: ShieldCheck },
  { title: "Uygulamayı İndir", url: "/apk-download", icon: Download },
];

const userManagementNav = [
  { title: "Aboneliğim", url: "/subscriptions", icon: CreditCard },
  { title: "Faturalarım", url: "/invoices", icon: Receipt },
  { title: "Ayarlar", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const { signOut, role } = useAuth();
  const isAdmin = role === "super_admin" || role === "guardian";

  const mainNav = isAdmin ? adminMainNav : userMainNav;
  const managementNav = isAdmin ? adminManagementNav : userManagementNav;

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <Sidebar collapsible="icon">
      <div className="flex items-center gap-2 px-4 py-5 border-b border-sidebar-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Eye className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-lg font-bold tracking-tight text-sidebar-foreground group-data-[collapsible=icon]:hidden">
          ClearHuma
        </span>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{isAdmin ? "Ana Menü" : "Menü"}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink to={item.url} end={item.url === "/"} activeClassName="bg-sidebar-accent text-primary font-medium">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{isAdmin ? "Yönetim" : "Hesabım"}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink to={item.url} activeClassName="bg-sidebar-accent text-primary font-medium">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Çıkış Yap" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span>Çıkış Yap</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
