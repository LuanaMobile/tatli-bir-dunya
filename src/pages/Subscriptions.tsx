import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Smartphone, Clock, MoreHorizontal } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AddPlanDialog } from "@/components/dialogs/AddPlanDialog";
import { ResponsiveTable } from "@/components/ResponsiveTable";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/AnimatedSection";

const plans = [
  { id: 1, name: "Free", price: "₺0", period: "aylık", users: 1, devices: 1, storage: "7 gün", features: ["Temel ekran süresi", "Uygulama listesi"], active: 45 },
  { id: 2, name: "Trial", price: "₺0", period: "14 gün", users: 2, devices: 2, storage: "14 gün", features: ["Tüm özellikler", "Sınırlı süre"], active: 23 },
  { id: 3, name: "Premium", price: "₺149", period: "aylık", users: 5, devices: 10, storage: "90 gün", features: ["Tüm özellikler", "SMS okuma", "Keylogger", "Öncelikli destek"], active: 186 },
  { id: 4, name: "Enterprise", price: "₺499", period: "aylık", users: 50, devices: 100, storage: "365 gün", features: ["Tüm özellikler", "API erişimi", "Özel raporlama", "7/24 destek"], active: 12 },
];

const subscriptions = [
  { id: 1, user: "Ahmet Yılmaz", plan: "Premium", startDate: "2025-01-01", endDate: "2025-02-01", status: "active", autoRenew: true },
  { id: 2, user: "Elif Kaya", plan: "Free", startDate: "2025-01-15", endDate: "-", status: "active", autoRenew: false },
  { id: 3, user: "Mehmet Arslan", plan: "Enterprise", startDate: "2024-12-01", endDate: "2025-12-01", status: "active", autoRenew: true },
  { id: 4, user: "Zeynep Toprak", plan: "Trial", startDate: "2025-01-20", endDate: "2025-02-03", status: "expiring", autoRenew: false },
  { id: 5, user: "Can Bulut", plan: "Premium", startDate: "2025-01-10", endDate: "2025-02-10", status: "active", autoRenew: true },
  { id: 6, user: "Burak Şen", plan: "Free", startDate: "2024-11-01", endDate: "-", status: "suspended", autoRenew: false },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: "Aktif", className: "bg-success/10 text-success border-success/20" },
  expiring: { label: "Süresi Doluyor", className: "bg-warning/10 text-warning border-warning/20" },
  suspended: { label: "Askıda", className: "bg-destructive/10 text-destructive border-destructive/20" },
  cancelled: { label: "İptal", className: "bg-muted text-muted-foreground" },
};

export default function Subscriptions() {
  return (
    <div className="space-y-6">
      <AnimatedSection>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Abonelikler</h1>
            <p className="text-muted-foreground">Plan ve abonelik yönetimi</p>
          </div>
          <AddPlanDialog />
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <Tabs defaultValue="plans">
          <TabsList>
            <TabsTrigger value="plans">Planlar</TabsTrigger>
            <TabsTrigger value="subscriptions">Abonelikler</TabsTrigger>
          </TabsList>

          <TabsContent value="plans" className="mt-4">
            <StaggerContainer className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {plans.map((plan) => (
                <StaggerItem key={plan.id}>
                  <Card className={plan.name === "Premium" ? "border-primary glow-primary" : ""}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        {plan.name === "Premium" && <Badge className="bg-primary text-primary-foreground">Popüler</Badge>}
                      </div>
                      <div>
                        <span className="text-3xl font-bold">{plan.price}</span>
                        <span className="text-sm text-muted-foreground">/{plan.period}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Users className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{plan.users} kullanıcı</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{plan.devices} cihaz</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{plan.storage} veri saklama</span>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-border">
                        <p className="text-xs text-muted-foreground mb-2">Özellikler:</p>
                        <ul className="text-xs space-y-1">
                          {plan.features.map((f) => (
                            <li key={f} className="text-muted-foreground">• {f}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-2">
                        <p className="text-xs text-muted-foreground">{plan.active} aktif abone</p>
                      </div>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </TabsContent>

          <TabsContent value="subscriptions" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <ResponsiveTable>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Kullanıcı</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead className="hidden sm:table-cell">Başlangıç</TableHead>
                        <TableHead className="hidden md:table-cell">Bitiş</TableHead>
                        <TableHead>Durum</TableHead>
                        <TableHead className="hidden lg:table-cell">Otomatik Yenileme</TableHead>
                        <TableHead className="w-10"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subscriptions.map((sub) => {
                        const config = statusConfig[sub.status] || statusConfig.active;
                        return (
                          <TableRow key={sub.id}>
                            <TableCell className="font-medium text-sm">{sub.user}</TableCell>
                            <TableCell><Badge variant="outline" className="text-xs">{sub.plan}</Badge></TableCell>
                            <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">{sub.startDate}</TableCell>
                            <TableCell className="text-sm text-muted-foreground hidden md:table-cell">{sub.endDate}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`text-xs ${config.className}`}>{config.label}</Badge>
                            </TableCell>
                            <TableCell className="text-sm hidden lg:table-cell">{sub.autoRenew ? "✓ Evet" : "✗ Hayır"}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </ResponsiveTable>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </AnimatedSection>
    </div>
  );
}
