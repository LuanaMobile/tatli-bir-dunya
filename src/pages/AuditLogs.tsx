import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ResponsiveTable } from "@/components/ResponsiveTable";
import { AnimatedSection } from "@/components/AnimatedSection";

const mockLogs = [
  { id: 1, actor: "admin@clearhuma.com", role: "Super Admin", action: "Kullanıcı oluşturuldu", target: "Ahmet Yılmaz", ip: "192.168.1.1", timestamp: "2025-01-28 14:32:05", category: "user" },
  { id: 2, actor: "admin@clearhuma.com", role: "Super Admin", action: "Abonelik planı güncellendi", target: "Premium Plan", ip: "192.168.1.1", timestamp: "2025-01-28 13:15:22", category: "subscription" },
  { id: 3, actor: "guardian1@example.com", role: "Guardian", action: "Rapor indirildi", target: "Haftalık Rapor - Elif Kaya", ip: "10.0.0.15", timestamp: "2025-01-28 12:45:10", category: "report" },
  { id: 4, actor: "zeynep@example.com", role: "User", action: "Konum izni iptal edildi", target: "Oppo Reno 8", ip: "172.16.0.5", timestamp: "2025-01-28 11:00:33", category: "consent" },
  { id: 5, actor: "admin@clearhuma.com", role: "Super Admin", action: "Cihaz silindi", target: "Eski Telefon - Burak Ş.", ip: "192.168.1.1", timestamp: "2025-01-28 10:30:00", category: "device" },
  { id: 6, actor: "guardian2@example.com", role: "Guardian", action: "Kullanım limiti güncellendi", target: "Can Bulut", ip: "10.0.0.22", timestamp: "2025-01-28 09:15:45", category: "user" },
  { id: 7, actor: "admin@clearhuma.com", role: "Super Admin", action: "API anahtarı oluşturuldu", target: "Sistem", ip: "192.168.1.1", timestamp: "2025-01-27 18:00:12", category: "system" },
  { id: 8, actor: "mehmet@example.com", role: "User", action: "Hesap silme talebi", target: "Kendi hesabı", ip: "10.10.10.1", timestamp: "2025-01-27 16:22:08", category: "user" },
];

const categoryColors: Record<string, string> = {
  user: "bg-info/10 text-info border-info/20",
  subscription: "bg-primary/10 text-primary border-primary/20",
  report: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  consent: "bg-success/10 text-success border-success/20",
  device: "bg-warning/10 text-warning border-warning/20",
  system: "bg-muted text-muted-foreground border-border",
};

const categoryLabels: Record<string, string> = {
  user: "Kullanıcı",
  subscription: "Abonelik",
  report: "Rapor",
  consent: "İzin",
  device: "Cihaz",
  system: "Sistem",
};

export default function AuditLogs() {
  const [search, setSearch] = useState("");

  const filtered = mockLogs.filter(
    (l) => l.action.toLowerCase().includes(search.toLowerCase()) || l.actor.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <AnimatedSection>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Audit Log</h1>
          <p className="text-muted-foreground">Tüm sistem işlemlerinin denetim kaydı</p>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <div className="relative flex-1 max-w-sm w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="İşlem veya kullanıcı ara..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtrele
              </Button>
            </div>
          </CardHeader>
          <div className="p-0">
            <ResponsiveTable>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden lg:table-cell">Tarih</TableHead>
                    <TableHead>İşlem Yapan</TableHead>
                    <TableHead className="hidden sm:table-cell">Rol</TableHead>
                    <TableHead>İşlem</TableHead>
                    <TableHead className="hidden md:table-cell">Hedef</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead className="hidden lg:table-cell">IP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-xs text-muted-foreground font-mono whitespace-nowrap hidden lg:table-cell">{log.timestamp}</TableCell>
                      <TableCell className="text-sm">{log.actor}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="outline" className="text-xs">{log.role}</Badge>
                      </TableCell>
                      <TableCell className="text-sm font-medium">{log.action}</TableCell>
                      <TableCell className="text-sm text-muted-foreground hidden md:table-cell">{log.target}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs ${categoryColors[log.category] || ""}`}>
                          {categoryLabels[log.category] || log.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground font-mono hidden lg:table-cell">{log.ip}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ResponsiveTable>
          </div>
        </Card>
      </AnimatedSection>
    </div>
  );
}
