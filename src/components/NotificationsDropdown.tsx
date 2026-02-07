import { Bell, AlertTriangle, Clock, CreditCard, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const notifications = [
  { id: 1, icon: AlertTriangle, title: "Kullanım limiti uyarısı", description: "Ahmet Yılmaz günlük limiti aştı", time: "5 dk önce", type: "warning", read: false },
  { id: 2, icon: Clock, title: "İzin süresi dolmak üzere", description: "Elif Kaya - SMS izni 3 gün kaldı", time: "1 saat önce", type: "info", read: false },
  { id: 3, icon: CreditCard, title: "Abonelik bitiş uyarısı", description: "Zeynep Toprak Trial süresi 2 gün", time: "2 saat önce", type: "warning", read: false },
  { id: 4, icon: Shield, title: "İzin iptal edildi", description: "Zeynep Toprak konum iznini iptal etti", time: "3 saat önce", type: "destructive", read: true },
  { id: 5, icon: AlertTriangle, title: "Sistem güncellemesi", description: "v2.1.0 güncelleme hazır", time: "5 saat önce", type: "info", read: true },
];

const typeColors: Record<string, string> = {
  warning: "text-warning",
  info: "text-info",
  destructive: "text-destructive",
};

export function NotificationsDropdown() {
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
              {unread}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 border-b border-border">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Bildirimler</p>
            <Badge variant="outline" className="text-xs">{unread} yeni</Badge>
          </div>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.map((n) => (
            <div key={n.id} className={`flex gap-3 p-3 border-b border-border/50 hover:bg-accent/50 transition-colors ${!n.read ? "bg-primary/5" : ""}`}>
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${!n.read ? "bg-primary/10" : "bg-muted"}`}>
                <n.icon className={`h-4 w-4 ${typeColors[n.type] || "text-muted-foreground"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-tight">{n.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{n.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
              </div>
              {!n.read && <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />}
            </div>
          ))}
        </div>
        <div className="p-2 border-t border-border">
          <Button variant="ghost" size="sm" className="w-full text-xs">
            Tümünü gör
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
