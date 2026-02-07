import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/AnimatedSection";

const recentActivity = [
  { user: "Ahmet Y.", action: "SMS izni verildi", time: "2 dk önce", type: "consent" },
  { user: "Elif K.", action: "Yeni cihaz eklendi", time: "15 dk önce", type: "device" },
  { user: "Mehmet A.", action: "Abonelik yenilendi", time: "1 saat önce", type: "subscription" },
  { user: "Zeynep T.", action: "Konum izni iptal", time: "2 saat önce", type: "consent" },
  { user: "Can B.", action: "Rapor indirildi", time: "3 saat önce", type: "report" },
  { user: "Ayşe D.", action: "Yeni kullanıcı eklendi", time: "4 saat önce", type: "user" },
  { user: "Burak Ş.", action: "Hesap askıya alındı", time: "5 saat önce", type: "system" },
];

const topApps = [
  { name: "Instagram", time: "1s 45dk", percentage: 28 },
  { name: "WhatsApp", time: "1s 12dk", percentage: 22 },
  { name: "YouTube", time: "58dk", percentage: 17 },
  { name: "TikTok", time: "42dk", percentage: 12 },
  { name: "Chrome", time: "35dk", percentage: 10 },
];

export function ActivityFeed() {
  return (
    <AnimatedSection delay={0.1}>
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-base">Son Aktiviteler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                    {item.user.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.user}</p>
                    <p className="text-xs text-muted-foreground">{item.action}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AnimatedSection>
  );
}

export function TopApps() {
  return (
    <AnimatedSection delay={0.2}>
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-base">En Çok Kullanılan Uygulamalar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topApps.map((app, i) => (
              <div key={app.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground w-4">{i + 1}.</span>
                    <span className="font-medium">{app.name}</span>
                  </div>
                  <span className="text-muted-foreground text-xs">{app.time}</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${app.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AnimatedSection>
  );
}

export function SystemHealth() {
  const metrics = [
    { label: "CPU", value: 34, color: "bg-success" },
    { label: "RAM", value: 62, color: "bg-primary" },
    { label: "Disk", value: 48, color: "bg-warning" },
    { label: "Bant Genişliği", value: 21, color: "bg-info" },
  ];

  return (
    <AnimatedSection delay={0.25}>
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-base">Sistem Sağlığı</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.map((m) => (
              <div key={m.label} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{m.label}</span>
                  <span className="font-medium">{m.value}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${m.color} rounded-full transition-all duration-500`} style={{ width: `${m.value}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-success/5 border border-success/20">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs text-success font-medium">Tüm sistemler çalışıyor</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </AnimatedSection>
  );
}
