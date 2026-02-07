import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ResponsiveTable } from "@/components/ResponsiveTable";
import { BuildLogPanel } from "./BuildLogPanel";
import { Download, ExternalLink, Loader2, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; className?: string }> = {
  pending: { label: "Bekliyor", variant: "outline" },
  building: { label: "Derleniyor", variant: "secondary", className: "animate-pulse" },
  success: { label: "Başarılı", variant: "default", className: "bg-success/10 text-success border-success/20" },
  failed: { label: "Başarısız", variant: "destructive" },
};

export function ApkBuildList() {
  const queryClient = useQueryClient();

  const { data: builds, isLoading } = useQuery({
    queryKey: ["apk-build-configs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apk_build_configs")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    refetchInterval: 15000, // Poll every 15s for build status updates
  });

  const statusInfo = (status: string) => statusMap[status] || statusMap.pending;

  return (
    <div>
      <div className="flex justify-end px-4 pt-3">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-xs"
          onClick={() => queryClient.invalidateQueries({ queryKey: ["apk-build-configs"] })}
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Yenile
        </Button>
      </div>
      <ResponsiveTable>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Versiyon</TableHead>
              <TableHead>Uygulama</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="hidden sm:table-cell">Tarih</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : !builds?.length ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Henüz build kaydı yok
                </TableCell>
              </TableRow>
            ) : (
              builds.map((b: any) => {
                const si = statusInfo(b.build_status);
                return (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">v{b.version}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{b.app_name}</TableCell>
                    <TableCell>
                      <Badge variant={si.variant} className={si.className}>
                        {si.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">
                      {new Date(b.created_at).toLocaleString("tr-TR")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-0.5">
                        <BuildLogPanel build={b} />
                        {b.apk_url && (
                          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                            <a href={b.apk_url} target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                        {b.github_run_id && (
                          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                            <a
                              href={`https://github.com/${b.github_run_id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </ResponsiveTable>
    </div>
  );
}
