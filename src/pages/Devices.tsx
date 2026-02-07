import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Smartphone, Wifi, WifiOff, MoreHorizontal, ShieldCheck, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ResponsiveTable } from "@/components/ResponsiveTable";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/AnimatedSection";
import { useDevices, useDeviceActivations } from "@/hooks/useData";

export default function Devices() {
  const [search, setSearch] = useState("");
  const { data: devices, isLoading } = useDevices();
  const { data: activations, isLoading: loadingActivations } = useDeviceActivations();
  const allDevices = devices ?? [];
  const allActivations = activations ?? [];

  const filtered = allDevices.filter(
    (d) => d.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredActivations = allActivations.filter(
    (a) =>
      (a as any).user_name?.toLowerCase().includes(search.toLowerCase()) ||
      a.activation_code?.toLowerCase().includes(search.toLowerCase()) ||
      a.device_name?.toLowerCase().includes(search.toLowerCase())
  );

  const online = allDevices.filter(d => d.status === "active").length;
  const offline = allDevices.filter(d => d.status !== "active").length;
  const activatedCount = allActivations.filter(a => a.is_activated).length;
  const pendingCount = allActivations.filter(a => !a.is_activated).length;

  return (
    <div className="space-y-6">
      <AnimatedSection>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cihazlar</h1>
          <p className="text-muted-foreground">Kayıtlı cihazları ve APK aktivasyonlarını takip edin</p>
        </div>
      </AnimatedSection>

      <StaggerContainer className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        <StaggerItem>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <Wifi className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{online}</p>
                  <p className="text-sm text-muted-foreground">Çevrimiçi</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </StaggerItem>
        <StaggerItem>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                  <WifiOff className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{offline}</p>
                  <p className="text-sm text-muted-foreground">Çevrimdışı</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </StaggerItem>
        <StaggerItem>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activatedCount}</p>
                  <p className="text-sm text-muted-foreground">Aktif APK</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </StaggerItem>
        <StaggerItem>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingCount}</p>
                  <p className="text-sm text-muted-foreground">Bekleyen Kod</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </StaggerItem>
      </StaggerContainer>

      <AnimatedSection delay={0.2}>
        <Card>
          <CardHeader>
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Cihaz veya kullanıcı ara..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="activations" className="w-full">
              <div className="px-6 pb-2">
                <TabsList>
                  <TabsTrigger value="activations">APK Cihazlar ({allActivations.length})</TabsTrigger>
                  <TabsTrigger value="devices">Kayıtlı Cihazlar ({allDevices.length})</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="activations" className="mt-0">
                {loadingActivations ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : (
                  <ResponsiveTable>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Kullanıcı</TableHead>
                          <TableHead>Aktivasyon Kodu</TableHead>
                          <TableHead>Durum</TableHead>
                          <TableHead className="hidden md:table-cell">Cihaz</TableHead>
                          <TableHead className="hidden lg:table-cell">Aktivasyon Tarihi</TableHead>
                          <TableHead className="hidden lg:table-cell">Süre Sonu</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredActivations.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                              Henüz APK aktivasyonu bulunmuyor
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredActivations.map((a) => (
                            <TableRow key={a.id}>
                              <TableCell>
                                <span className="font-medium text-sm">{(a as any).user_name}</span>
                              </TableCell>
                              <TableCell>
                                <code className="text-sm font-mono bg-muted px-2 py-0.5 rounded">
                                  {a.activation_code.toUpperCase()}
                                </code>
                              </TableCell>
                              <TableCell>
                                {a.is_activated ? (
                                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Aktif
                                  </Badge>
                                ) : new Date(a.expires_at) < new Date() ? (
                                  <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                                    Süresi Dolmuş
                                  </Badge>
                                ) : (
                                  <Badge variant="outline">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Bekliyor
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground hidden md:table-cell max-w-[200px] truncate">
                                {a.device_name || "—"}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground hidden lg:table-cell">
                                {a.activated_at ? new Date(a.activated_at).toLocaleString("tr-TR") : "—"}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground hidden lg:table-cell">
                                {new Date(a.expires_at).toLocaleDateString("tr-TR")}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </ResponsiveTable>
                )}
              </TabsContent>

              <TabsContent value="devices" className="mt-0">
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : (
                  <ResponsiveTable>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Cihaz</TableHead>
                          <TableHead className="hidden md:table-cell">Model</TableHead>
                          <TableHead className="hidden md:table-cell">İşletim Sistemi</TableHead>
                          <TableHead>Durum</TableHead>
                          <TableHead className="hidden lg:table-cell">Son Görülme</TableHead>
                          <TableHead className="w-10"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filtered.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                              Henüz cihaz bulunmuyor
                            </TableCell>
                          </TableRow>
                        ) : (
                          filtered.map((device) => (
                            <TableRow key={device.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Smartphone className="h-4 w-4 text-muted-foreground shrink-0" />
                                  <span className="font-medium text-sm">{device.name}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground hidden md:table-cell">{device.model ?? "—"}</TableCell>
                              <TableCell className="text-sm text-muted-foreground hidden md:table-cell">{device.os_version ?? "—"}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className={device.status === "active" ? "bg-success/10 text-success border-success/20" : "bg-muted text-muted-foreground"}>
                                  {device.status === "active" ? "Aktif" : "Pasif"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground hidden lg:table-cell">
                                {device.last_seen_at ? new Date(device.last_seen_at).toLocaleString("tr-TR") : "—"}
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </ResponsiveTable>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  );
}
