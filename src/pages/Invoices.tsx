import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, CreditCard, Receipt, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveTable } from "@/components/ResponsiveTable";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/AnimatedSection";
import { useInvoices } from "@/hooks/useData";

const statusConfig: Record<string, { label: string; className: string }> = {
  paid: { label: "Ödendi", className: "bg-success/10 text-success border-success/20" },
  pending: { label: "Beklemede", className: "bg-warning/10 text-warning border-warning/20" },
  free: { label: "Ücretsiz", className: "bg-muted text-muted-foreground" },
};

export default function Invoices() {
  const { data: invoices, isLoading } = useInvoices();
  const allInvoices = invoices ?? [];
  const totalRevenue = allInvoices.filter(i => i.status === "paid").reduce((sum, i) => sum + Number(i.amount), 0);
  const pendingCount = allInvoices.filter(i => i.status === "pending").length;

  return (
    <div className="space-y-6">
      <AnimatedSection>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Faturalar & Ödemeler</h1>
          <p className="text-muted-foreground">Fatura ve ödeme geçmişini yönetin</p>
        </div>
      </AnimatedSection>

      <StaggerContainer className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <StaggerItem>
          <Card>
            <CardContent className="p-5 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">₺{totalRevenue}</p>
                <p className="text-sm text-muted-foreground">Toplam Gelir</p>
              </div>
            </CardContent>
          </Card>
        </StaggerItem>
        <StaggerItem>
          <Card>
            <CardContent className="p-5 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Receipt className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{allInvoices.length}</p>
                <p className="text-sm text-muted-foreground">Toplam Fatura</p>
              </div>
            </CardContent>
          </Card>
        </StaggerItem>
        <StaggerItem>
          <Card>
            <CardContent className="p-5 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingCount}</p>
                <p className="text-sm text-muted-foreground">Bekleyen Ödeme</p>
              </div>
            </CardContent>
          </Card>
        </StaggerItem>
      </StaggerContainer>

      <AnimatedSection delay={0.2}>
        <Card>
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
                      <TableHead>Fatura No</TableHead>
                      <TableHead>Tutar</TableHead>
                      <TableHead className="hidden sm:table-cell">Tarih</TableHead>
                      <TableHead className="hidden md:table-cell">Son Ödeme</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allInvoices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          Henüz fatura bulunmuyor
                        </TableCell>
                      </TableRow>
                    ) : (
                      allInvoices.map((inv) => {
                        const config = statusConfig[inv.status] || statusConfig.pending;
                        return (
                          <TableRow key={inv.id}>
                            <TableCell className="font-mono text-sm">{inv.invoice_number ?? inv.id.slice(0, 8)}</TableCell>
                            <TableCell className="text-sm font-medium">₺{Number(inv.amount)}</TableCell>
                            <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">
                              {new Date(inv.issue_date).toLocaleDateString("tr-TR")}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground hidden md:table-cell">
                              {inv.due_date ? new Date(inv.due_date).toLocaleDateString("tr-TR") : "—"}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`text-xs ${config.className}`}>{config.label}</Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Download className="h-4 w-4" />
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
      </AnimatedSection>
    </div>
  );
}
