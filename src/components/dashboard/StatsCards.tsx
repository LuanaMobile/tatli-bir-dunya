import { Card, CardContent } from "@/components/ui/card";
import { Users, Smartphone, Clock, ShieldCheck, TrendingUp, TrendingDown, Activity, Globe } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/AnimatedSection";

const stats = [
  { title: "Toplam Kullanıcı", value: "1,284", change: "+12%", trend: "up" as const, icon: Users },
  { title: "Aktif Cihaz", value: "946", change: "+8%", trend: "up" as const, icon: Smartphone },
  { title: "Ort. Ekran Süresi", value: "4s 32dk", change: "-5%", trend: "down" as const, icon: Clock },
  { title: "Aktif İzinler", value: "1,108", change: "+3%", trend: "up" as const, icon: ShieldCheck },
  { title: "Günlük Oturum", value: "3,842", change: "+18%", trend: "up" as const, icon: Activity },
  { title: "Bağlı Bölge", value: "12", change: "+2", trend: "up" as const, icon: Globe },
];

export function StatsCards() {
  return (
    <StaggerContainer className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
      {stats.map((stat) => (
        <StaggerItem key={stat.title}>
          <Card className="hover:glow-primary transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex items-center gap-0.5">
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 text-success" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-destructive" />
                  )}
                  <span className={`text-xs font-medium ${stat.trend === "up" ? "text-success" : "text-destructive"}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <p className="text-xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.title}</p>
            </CardContent>
          </Card>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
