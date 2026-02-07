import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShieldCheck, ShieldX, Clock } from "lucide-react";
import { ResponsiveTable } from "@/components/ResponsiveTable";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/AnimatedSection";
import { useConsents } from "@/hooks/useData";

const statusConfig: Record<string, { label: string; className: string; icon: typeof ShieldCheck }> = {
  true: { label: "Verildi", className: "bg-success/10 text-success border-success/20", icon: ShieldCheck },
  false: { label: "İptal Edildi", className: "bg-destructive/10 text-destructive border-destructive/20", icon: ShieldX },
};

export default function Consents() {
  const { data: consents, isLoading } = useConsents();
  const allConsents = consents ?? [];
  const granted = allConsents.filter(c => c.granted).length;
  const revoked = allConsents.filter(c => !c.granted).length;

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
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{allConsents.length}</p>
                <p className="text-sm text-muted-foreground">Toplam Kayıt</p>
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
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            ) : (
              <ResponsiveTable>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>İzin Tipi</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead className="hidden lg:table-cell">IP Adresi</TableHead>
                      <TableHead className="hidden sm:table-cell">Tarih</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allConsents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          Henüz izin kaydı bulunmuyor
                        </TableCell>
                      </TableRow>
                    ) : (
                      allConsents.map((consent) => {
                        const config = statusConfig[String(consent.granted)];
                        return (
                          <TableRow key={consent.id}>
                            <TableCell className="font-medium text-sm">{consent.consent_type}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`text-xs ${config.className}`}>
                                <config.icon className="h-3 w-3 mr-1" />
                                {config.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground font-mono hidden lg:table-cell">{consent.ip_address ?? "—"}</TableCell>
                            <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">
                              {new Date(consent.created_at).toLocaleString("tr-TR")}
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
      </AnimatedSection>
    </div>
  );
}
