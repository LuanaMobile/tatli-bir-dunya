import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download, Calendar, BarChart3 } from "lucide-react";

const reports = [
  { id: 1, name: "Haftalık Kullanım Raporu", type: "PDF", date: "2025-01-27", size: "2.4 MB", status: "ready" },
  { id: 2, name: "Aylık Cihaz Analizi", type: "PDF", date: "2025-01-01", size: "5.1 MB", status: "ready" },
  { id: 3, name: "İzin Değişiklik Raporu", type: "CSV", date: "2025-01-28", size: "1.2 MB", status: "ready" },
  { id: 4, name: "Abonelik Özet Raporu", type: "PDF", date: "2025-01-28", size: "890 KB", status: "generating" },
  { id: 5, name: "Audit Log Dışa Aktarım", type: "CSV", date: "2025-01-26", size: "3.7 MB", status: "ready" },
];

export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Raporlar</h1>
          <p className="text-muted-foreground">Rapor oluşturun ve dışa aktarın</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            PDF Oluştur
          </Button>
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            CSV Dışa Aktar
          </Button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">24</p>
              <p className="text-sm text-muted-foreground">Toplam Rapor</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">4</p>
              <p className="text-sm text-muted-foreground">Otomatik Rapor</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center">
              <Download className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-2xl font-bold">156</p>
              <p className="text-sm text-muted-foreground">İndirme</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Raporlar</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rapor Adı</TableHead>
                <TableHead>Tür</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead>Boyut</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium text-sm">{report.name}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{report.type}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{report.date}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{report.size}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${report.status === "ready" ? "bg-success/10 text-success border-success/20" : "bg-warning/10 text-warning border-warning/20"}`}>
                      {report.status === "ready" ? "Hazır" : "Oluşturuluyor"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8" disabled={report.status !== "ready"}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
