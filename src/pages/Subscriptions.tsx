import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Smartphone, Clock, MoreHorizontal } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AddPlanDialog } from "@/components/dialogs/AddPlanDialog";
import { ResponsiveTable } from "@/components/ResponsiveTable";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/AnimatedSection";
import { usePlans, useSubscriptions } from "@/hooks/useData";

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: "Aktif", className: "bg-success/10 text-success border-success/20" },
  expiring: { label: "Süresi Doluyor", className: "bg-warning/10 text-warning border-warning/20" },
  suspended: { label: "Askıda", className: "bg-destructive/10 text-destructive border-destructive/20" },
  cancelled: { label: "İptal", className: "bg-muted text-muted-foreground" },
};

export default function Subscriptions() {
  const { data: plans, isLoading: plansLoading } = usePlans();
  const { data: subscriptions, isLoading: subsLoading } = useSubscriptions();

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
            {plansLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            ) : (
              <StaggerContainer className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {(plans ?? []).map((plan) => {
                  const features = Array.isArray(plan.features) ? plan.features as string[] : [];
                  return (
                    <StaggerItem key={plan.id}>
                      <Card className={plan.name === "Premium" ? "border-primary glow-primary" : ""}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{plan.name}</CardTitle>
                            {plan.name === "Premium" && <Badge className="bg-primary text-primary-foreground">Popüler</Badge>}
                          </div>
                          <div>
                            <span className="text-3xl font-bold">₺{Number(plan.price)}</span>
                            <span className="text-sm text-muted-foreground">/{plan.period}</span>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Users className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>{plan.user_limit} kullanıcı</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Smartphone className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>{plan.device_limit} cihaz</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>{plan.data_retention_days} gün veri saklama</span>
                            </div>
                          </div>
                          <div className="pt-2 border-t border-border">
                            <p className="text-xs text-muted-foreground mb-2">Özellikler:</p>
                            <ul className="text-xs space-y-1">
                              {features.map((f) => (
                                <li key={String(f)} className="text-muted-foreground">• {String(f)}</li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    </StaggerItem>
                  );
                })}
              </StaggerContainer>
            )}
          </TabsContent>

          <TabsContent value="subscriptions" className="mt-4">
            <Card>
              <CardContent className="p-0">
                {subsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : (
                  <ResponsiveTable>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Plan</TableHead>
                          <TableHead className="hidden sm:table-cell">Başlangıç</TableHead>
                          <TableHead className="hidden md:table-cell">Bitiş</TableHead>
                          <TableHead>Durum</TableHead>
                          <TableHead className="w-10"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(subscriptions ?? []).length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                              Henüz abonelik bulunmuyor
                            </TableCell>
                          </TableRow>
                        ) : (
                          (subscriptions ?? []).map((sub) => {
                            const config = statusConfig[sub.status] || statusConfig.active;
                            return (
                              <TableRow key={sub.id}>
                                <TableCell>
                                  <Badge variant="outline" className="text-xs">{(sub as any).plans?.name ?? "—"}</Badge>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">
                                  {new Date(sub.start_date).toLocaleDateString("tr-TR")}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground hidden md:table-cell">
                                  {sub.end_date ? new Date(sub.end_date).toLocaleDateString("tr-TR") : "—"}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={`text-xs ${config.className}`}>{config.label}</Badge>
                                </TableCell>
                                <TableCell>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </ResponsiveTable>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </AnimatedSection>
    </div>
  );
}
