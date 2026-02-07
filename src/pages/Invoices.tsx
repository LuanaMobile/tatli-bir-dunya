import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, CreditCard, TrendingUp, Receipt } from "lucide-react";

const invoices = [
  { id: "INV-2025-001", user: "Ahmet Yılmaz", plan: "Premium", amount: "₺149", date: "2025-01-01", dueDate: "2025-02-01", status: "paid" },
  { id: "INV-2025-002", user: "Mehmet Arslan", plan: "Enterprise", amount: "₺499", date: "2025-01-01", dueDate: "2025-02-01", status: "paid" },
  { id: "INV-2025-003", user: "Can Bulut", plan: "Premium", amount: "₺149", date: "2025-01-10", dueDate: "2025-02-10", status: "paid" },
  { id: "INV-2025-004", user: "Ayşe Demir", plan: "Premium", amount: "₺149", date: "2025-01-15", dueDate: "2025-02-15", status: "pending" },
  { id: "INV-2025-005", user: "Zeynep Toprak", plan: "Trial", amount: "₺0", date: "2025-01-20", dueDate: "-", status: "free" },
  { id: "INV-2025-006", user: "Burak Şen", plan: "Free", amount: "₺0", date: "2024-11-01", dueDate: "-", status: "free" },
];

const payments = [
  { id: "PAY-001", invoice: "INV-2025-001", user: "Ahmet Yılmaz", amount: "₺149", method: "Kredi Kartı", date: "2025-01-01 10:32", status: "success" },
  { id: "PAY-002", invoice: "INV-2025-002", user: "Mehmet Arslan", amount: "₺499", method: "Havale/EFT", date: "2025-01-02 14:15", status: "success" },
  { id: "PAY-003", invoice: "INV-2025-003", user: "Can Bulut", amount: "₺149", method: "Kredi Kartı", date: "2025-01-10 09:45", status: "success" },
  { id: "PAY-004", invoice: "INV-2025-004", user: "Ayşe Demir", amount: "₺149", method: "Kredi Kartı", date: "2025-01-15 16:20", status: "failed" },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  paid: { label: "Ödendi", className: "bg-success/10 text-success border-success/20" },
  pending: { label: "Beklemede", className: "bg-warning/10 text-warning border-warning/20" },
  free: { label: "Ücretsiz", className: "bg-muted text-muted-foreground" },
  success: { label: "Başarılı", className: "bg-success/10 text-success border-success/20" },
  failed: { label: "Başarısız", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Invoices() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Faturalar & Ödemeler</h1>
        <p className="text-muted-foreground">Fatura ve ödeme geçmişini yönetin</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">₺1,095</p>
              <p className="text-sm text-muted-foreground">Bu Ay Gelir</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Receipt className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{invoices.length}</p>
              <p className="text-sm text-muted-foreground">Toplam Fatura</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">1</p>
              <p className="text-sm text-muted-foreground">Bekleyen Ödeme</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="invoices">
        <TabsList>
          <TabsTrigger value="invoices">Faturalar</TabsTrigger>
          <TabsTrigger value="payments">Ödemeler</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fatura No</TableHead>
                    <TableHead>Kullanıcı</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Tutar</TableHead>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Son Ödeme</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((inv) => {
                    const config = statusConfig[inv.status];
                    return (
                      <TableRow key={inv.id}>
                        <TableCell className="font-mono text-sm">{inv.id}</TableCell>
                        <TableCell className="text-sm font-medium">{inv.user}</TableCell>
                        <TableCell><Badge variant="outline" className="text-xs">{inv.plan}</Badge></TableCell>
                        <TableCell className="text-sm font-medium">{inv.amount}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{inv.date}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{inv.dueDate}</TableCell>
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
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ödeme ID</TableHead>
                    <TableHead>Fatura</TableHead>
                    <TableHead>Kullanıcı</TableHead>
                    <TableHead>Tutar</TableHead>
                    <TableHead>Yöntem</TableHead>
                    <TableHead>Tarih</TableHead>
                    <TableHead>Durum</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((pay) => {
                    const config = statusConfig[pay.status];
                    return (
                      <TableRow key={pay.id}>
                        <TableCell className="font-mono text-sm">{pay.id}</TableCell>
                        <TableCell className="font-mono text-sm text-muted-foreground">{pay.invoice}</TableCell>
                        <TableCell className="text-sm font-medium">{pay.user}</TableCell>
                        <TableCell className="text-sm font-medium">{pay.amount}</TableCell>
                        <TableCell className="text-sm">{pay.method}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{pay.date}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-xs ${config.className}`}>{config.label}</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
