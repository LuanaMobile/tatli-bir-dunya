import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Smartphone, Wifi, WifiOff, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ResponsiveTable } from "@/components/ResponsiveTable";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/AnimatedSection";

const mockDevices = [
  { id: 1, name: "Samsung Galaxy S23", user: "Ahmet Yılmaz", os: "Android 14", status: "online", lastSync: "1 dk önce", battery: 85, permissions: 8 },
  { id: 2, name: "Xiaomi Redmi Note 12", user: "Elif Kaya", os: "Android 13", status: "online", lastSync: "5 dk önce", battery: 62, permissions: 5 },
  { id: 3, name: "Google Pixel 7", user: "Mehmet Arslan", os: "Android 14", status: "offline", lastSync: "3 saat önce", battery: 15, permissions: 10 },
  { id: 4, name: "Oppo Reno 8", user: "Zeynep Toprak", os: "Android 12", status: "offline", lastSync: "2 gün önce", battery: 0, permissions: 3 },
  { id: 5, name: "Samsung Galaxy A54", user: "Can Bulut", os: "Android 14", status: "online", lastSync: "2 dk önce", battery: 94, permissions: 7 },
  { id: 6, name: "Huawei P50", user: "Ayşe Demir", os: "Android 12", status: "online", lastSync: "10 dk önce", battery: 45, permissions: 6 },
];

export default function Devices() {
  const [search, setSearch] = useState("");

  const filtered = mockDevices.filter(
    (d) => d.name.toLowerCase().includes(search.toLowerCase()) || d.user.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <AnimatedSection>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cihazlar</h1>
          <p className="text-muted-foreground">Kayıtlı cihazları takip edin</p>
        </div>
      </AnimatedSection>

      <StaggerContainer className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <StaggerItem>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <Wifi className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{mockDevices.filter(d => d.status === "online").length}</p>
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
                  <p className="text-2xl font-bold">{mockDevices.filter(d => d.status === "offline").length}</p>
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
                  <Smartphone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{mockDevices.length}</p>
                  <p className="text-sm text-muted-foreground">Toplam Cihaz</p>
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
            <ResponsiveTable>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cihaz</TableHead>
                    <TableHead>Kullanıcı</TableHead>
                    <TableHead className="hidden md:table-cell">İşletim Sistemi</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Batarya</TableHead>
                    <TableHead className="hidden sm:table-cell">İzinler</TableHead>
                    <TableHead className="hidden lg:table-cell">Son Senkronizasyon</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((device) => (
                    <TableRow key={device.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="font-medium text-sm">{device.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{device.user}</TableCell>
                      <TableCell className="text-sm text-muted-foreground hidden md:table-cell">{device.os}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={device.status === "online" ? "bg-success/10 text-success border-success/20" : "bg-muted text-muted-foreground"}>
                          {device.status === "online" ? "Çevrimiçi" : "Çevrimdışı"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${device.battery > 50 ? "bg-success" : device.battery > 20 ? "bg-warning" : "bg-destructive"}`}
                              style={{ width: `${device.battery}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{device.battery}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm hidden sm:table-cell">{device.permissions}</TableCell>
                      <TableCell className="text-sm text-muted-foreground hidden lg:table-cell">{device.lastSync}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ResponsiveTable>
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  );
}
