import { Card, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ResponsiveTable } from "@/components/ResponsiveTable";
import { AnimatedSection } from "@/components/AnimatedSection";
import { useAuditLogs } from "@/hooks/useData";

export default function AuditLogs() {
  const [search, setSearch] = useState("");
  const { data: logs, isLoading } = useAuditLogs();
  const allLogs = logs ?? [];

  const filtered = allLogs.filter(
    (l) => l.action.toLowerCase().includes(search.toLowerCase())
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
                <Input placeholder="İşlem ara..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtrele
              </Button>
            </div>
          </CardHeader>
          <div className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            ) : (
              <ResponsiveTable>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="hidden lg:table-cell">Tarih</TableHead>
                      <TableHead>İşlem</TableHead>
                      <TableHead className="hidden md:table-cell">Hedef</TableHead>
                      <TableHead className="hidden md:table-cell">Hedef Tipi</TableHead>
                      <TableHead className="hidden lg:table-cell">IP</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          Henüz audit log bulunmuyor
                        </TableCell>
                      </TableRow>
                    ) : (
                      filtered.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="text-xs text-muted-foreground font-mono whitespace-nowrap hidden lg:table-cell">
                            {new Date(log.created_at).toLocaleString("tr-TR")}
                          </TableCell>
                          <TableCell className="text-sm font-medium">{log.action}</TableCell>
                          <TableCell className="text-sm text-muted-foreground hidden md:table-cell">{log.target_id ?? "—"}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {log.target_type && (
                              <Badge variant="outline" className="text-xs">{log.target_type}</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground font-mono hidden lg:table-cell">{log.ip_address ?? "—"}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </ResponsiveTable>
            )}
          </div>
        </Card>
      </AnimatedSection>
    </div>
  );
}
