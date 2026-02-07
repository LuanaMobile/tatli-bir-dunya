import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Smartphone, Shield, ShieldCheck, ShieldX, Clock, BarChart3, CreditCard, User, Mail, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const mockUser = {
  id: 1,
  name: "Ahmet Yılmaz",
  email: "ahmet@example.com",
  role: "guardian",
  status: "active",
  plan: "Premium",
  createdAt: "2024-06-15",
  lastActive: "2 dk önce",
  phone: "+90 532 XXX XXXX",
};

const mockDevices = [
  { id: 1, name: "Samsung Galaxy S23", os: "Android 14", status: "online", lastSync: "1 dk önce", battery: 85 },
  { id: 2, name: "Samsung Galaxy Tab S9", os: "Android 14", status: "offline", lastSync: "5 saat önce", battery: 32 },
  { id: 3, name: "Xiaomi Mi Band 8", os: "Android 13", status: "online", lastSync: "10 dk önce", battery: 71 },
];

const mockConsents = [
  { module: "SMS Okuma", status: "granted", date: "2025-01-15" },
  { module: "Arama Kayıtları", status: "granted", date: "2025-01-15" },
  { module: "Ekran Süresi", status: "granted", date: "2025-01-15" },
  { module: "Keylogger", status: "granted", date: "2025-01-20" },
  { module: "Konum Takibi", status: "revoked", date: "2025-01-25" },
  { module: "Sosyal Medya", status: "expired", date: "2024-12-01" },
];

const usageData = [
  { gun: "Pzt", sure: 3.2 },
  { gun: "Sal", sure: 4.8 },
  { gun: "Çar", sure: 2.9 },
  { gun: "Per", sure: 5.1 },
  { gun: "Cum", sure: 6.3 },
  { gun: "Cmt", sure: 7.8 },
  { gun: "Paz", sure: 4.5 },
];

const appUsage = [
  { app: "Instagram", sure: "2s 15dk", kategori: "Sosyal Medya" },
  { app: "WhatsApp", sure: "1s 45dk", kategori: "Mesajlaşma" },
  { app: "YouTube", sure: "1s 30dk", kategori: "Video" },
  { app: "TikTok", sure: "1s 10dk", kategori: "Sosyal Medya" },
  { app: "Chrome", sure: "45dk", kategori: "Tarayıcı" },
];

const statusIcons: Record<string, { icon: typeof ShieldCheck; className: string; label: string }> = {
  granted: { icon: ShieldCheck, className: "text-success", label: "Aktif" },
  revoked: { icon: ShieldX, className: "text-destructive", label: "İptal" },
  expired: { icon: Clock, className: "text-warning", label: "Süresi Doldu" },
};

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/users")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{mockUser.name}</h1>
          <p className="text-muted-foreground">Kullanıcı detayları ve aktivite bilgileri</p>
        </div>
      </div>

      {/* User info cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">{mockUser.name}</p>
              <Badge variant="outline" className="text-xs mt-1 bg-success/10 text-success border-success/20">
                {mockUser.status === "active" ? "Aktif" : "Pasif"}
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center">
              <Mail className="h-4 w-4 text-info" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium">{mockUser.email}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Abonelik</p>
              <p className="text-sm font-medium">{mockUser.plan}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Calendar className="h-4 w-4 text-warning" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Kayıt Tarihi</p>
              <p className="text-sm font-medium">{mockUser.createdAt}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="devices">
        <TabsList>
          <TabsTrigger value="devices">Cihazlar</TabsTrigger>
          <TabsTrigger value="consents">İzinler</TabsTrigger>
          <TabsTrigger value="usage">Kullanım</TabsTrigger>
          <TabsTrigger value="apps">Uygulamalar</TabsTrigger>
        </TabsList>

        <TabsContent value="devices" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cihaz</TableHead>
                    <TableHead>İşletim Sistemi</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Batarya</TableHead>
                    <TableHead>Son Senkronizasyon</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockDevices.map((device) => (
                    <TableRow key={device.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-sm">{device.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{device.os}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={device.status === "online" ? "bg-success/10 text-success border-success/20 text-xs" : "text-xs"}>
                          {device.status === "online" ? "Çevrimiçi" : "Çevrimdışı"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${device.battery > 50 ? "bg-success" : device.battery > 20 ? "bg-warning" : "bg-destructive"}`} style={{ width: `${device.battery}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground">{device.battery}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{device.lastSync}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consents" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Modül</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Tarih</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockConsents.map((consent) => {
                    const config = statusIcons[consent.status];
                    const Icon = config.icon;
                    return (
                      <TableRow key={consent.module}>
                        <TableCell className="font-medium text-sm">{consent.module}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Icon className={`h-3.5 w-3.5 ${config.className}`} />
                            <span className={`text-sm ${config.className}`}>{config.label}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{consent.date}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Haftalık Ekran Süresi (saat)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={usageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 20%, 16%)" />
                  <XAxis dataKey="gun" stroke="hsl(215, 15%, 55%)" fontSize={12} />
                  <YAxis stroke="hsl(215, 15%, 55%)" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(222, 25%, 9%)", border: "1px solid hsl(222, 20%, 16%)", borderRadius: "8px", color: "hsl(210, 20%, 92%)" }} />
                  <Bar dataKey="sure" fill="hsl(187, 80%, 48%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="apps" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Uygulama Kullanım Süreleri</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Uygulama</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Süre</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appUsage.map((app) => (
                    <TableRow key={app.app}>
                      <TableCell className="font-medium text-sm">{app.app}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">{app.kategori}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{app.sure}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
