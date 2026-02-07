import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShieldCheck, ShieldX, Eye, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponsiveTable } from "@/components/ResponsiveTable";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/AnimatedSection";

const mockConsents = [
  { id: 1, user: "Ahmet Yılmaz", module: "SMS Okuma", status: "granted", grantedAt: "2025-01-15 14:32", ip: "192.168.1.45", device: "Samsung Galaxy S23" },
  { id: 2, user: "Ahmet Yılmaz", module: "Arama Kayıtları", status: "granted", grantedAt: "2025-01-15 14:32", ip: "192.168.1.45", device: "Samsung Galaxy S23" },
  { id: 3, user: "Elif Kaya", module: "Ekran Süresi", status: "granted", grantedAt: "2025-01-20 09:15", ip: "10.0.0.12", device: "Xiaomi Redmi Note 12" },
  { id: 4, user: "Zeynep Toprak", module: "Konum Takibi", status: "revoked", grantedAt: "2025-01-10 11:00", ip: "172.16.0.5", device: "Oppo Reno 8" },
  { id: 5, user: "Can Bulut", module: "Keylogger", status: "granted", grantedAt: "2025-01-22 16:45", ip: "192.168.0.88", device: "Samsung Galaxy A54" },
  { id: 6, user: "Mehmet Arslan", module: "Uygulama Listesi", status: "granted", grantedAt: "2025-01-18 08:20", ip: "10.10.10.1", device: "Google Pixel 7" },
  { id: 7, user: "Ayşe Demir", module: "Sosyal Medya Mesajları", status: "expired", grantedAt: "2024-12-01 10:00", ip: "192.168.2.77", device: "Huawei P50" },
];

const statusConfig: Record<string, { label: string; className: string; icon: typeof ShieldCheck }> = {
  granted: { label: "Verildi", className: "bg-success/10 text-success border-success/20", icon: ShieldCheck },
  revoked: { label: "İptal Edildi", className: "bg-destructive/10 text-destructive border-destructive/20", icon: ShieldX },
  expired: { label: "Süresi Doldu", className: "bg-warning/10 text-warning border-warning/20", icon: Clock },
};

export default function Consents() {
  const granted = mockConsents.filter(c => c.status === "granted").length;
  const revoked = mockConsents.filter(c => c.status === "revoked").length;
  const expired = mockConsents.filter(c => c.status === "expired").length;

  return (
    <div className="space-y-6">
      <AnimatedSection>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">İzin Yönetimi</h1>
          <p className="text-muted-foreground">Açık rıza kayıtlarını inceleyin</p>
        </div>
      </AnimatedSection>

      <StaggerContainer className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <StaggerItem>
          <Card>
            <CardContent className="p-5 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{granted}</p>
                <p className="text-sm text-muted-foreground">Aktif İzin</p>
              </div>
            </CardContent>
          </Card>
        </StaggerItem>
        <StaggerItem>
          <Card>
            <CardContent className="p-5 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <ShieldX className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{revoked}</p>
                <p className="text-sm text-muted-foreground">İptal Edilen</p>
              </div>
            </CardContent>
          </Card>
        </StaggerItem>
        <StaggerItem>
          <Card>
            <CardContent className="p-5 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{expired}</p>
                <p className="text-sm text-muted-foreground">Süresi Dolan</p>
              </div>
            </CardContent>
          </Card>
        </StaggerItem>
      </StaggerContainer>

      <AnimatedSection delay={0.2}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">İzin Kayıtları</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ResponsiveTable>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kullanıcı</TableHead>
                    <TableHead>Modül</TableHead>
                    <TableHead className="hidden md:table-cell">Cihaz</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead className="hidden lg:table-cell">IP Adresi</TableHead>
                    <TableHead className="hidden sm:table-cell">Tarih</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockConsents.map((consent) => {
                    const config = statusConfig[consent.status];
                    return (
                      <TableRow key={consent.id}>
                        <TableCell className="font-medium text-sm">{consent.user}</TableCell>
                        <TableCell className="text-sm">{consent.module}</TableCell>
                        <TableCell className="text-sm text-muted-foreground hidden md:table-cell">{consent.device}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-xs ${config.className}`}>
                            <config.icon className="h-3 w-3 mr-1" />
                            {config.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground font-mono hidden lg:table-cell">{consent.ip}</TableCell>
                        <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">{consent.grantedAt}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
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
      </AnimatedSection>
    </div>
  );
}
