import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FileText, ExternalLink, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface BuildLogPanelProps {
  build: {
    id: string;
    version: string;
    app_name: string;
    build_status: string;
    build_log: string | null;
    github_run_id: string | null;
    created_at: string;
    updated_at: string;
    server_url: string;
    permissions: any;
  };
}

const statusConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  pending: { label: "Bekliyor", icon: <Clock className="h-4 w-4" />, color: "text-muted-foreground" },
  building: { label: "Derleniyor", icon: <Loader2 className="h-4 w-4 animate-spin" />, color: "text-blue-500" },
  success: { label: "Başarılı", icon: <CheckCircle2 className="h-4 w-4" />, color: "text-green-500" },
  failed: { label: "Başarısız", icon: <XCircle className="h-4 w-4" />, color: "text-destructive" },
};

export function BuildLogPanel({ build }: BuildLogPanelProps) {
  const [open, setOpen] = useState(false);
  const sc = statusConfig[build.build_status] || statusConfig.pending;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <FileText className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            Build Detayı - v{build.version}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          {/* Status */}
          <div className="flex items-center gap-2">
            <span className={sc.color}>{sc.icon}</span>
            <span className={`font-medium ${sc.color}`}>{sc.label}</span>
            {build.build_status === "building" && (
              <span className="text-xs text-muted-foreground animate-pulse">Devam ediyor...</span>
            )}
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Uygulama</p>
              <p className="font-medium">{build.app_name}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Versiyon</p>
              <p className="font-medium">{build.version}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Oluşturulma</p>
              <p className="font-medium">{new Date(build.created_at).toLocaleString("tr-TR")}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Son Güncelleme</p>
              <p className="font-medium">{new Date(build.updated_at).toLocaleString("tr-TR")}</p>
            </div>
            <div className="col-span-2">
              <p className="text-muted-foreground text-xs">Sunucu URL</p>
              <p className="font-medium text-xs break-all">{build.server_url}</p>
            </div>
            <div className="col-span-2">
              <p className="text-muted-foreground text-xs">İzinler</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {(Array.isArray(build.permissions) ? build.permissions : []).map((p: string) => (
                  <Badge key={p} variant="outline" className="text-xs">{p}</Badge>
                ))}
              </div>
            </div>
          </div>

          {/* GitHub Link */}
          {build.github_run_id && (
            <Button variant="outline" size="sm" className="gap-1.5 w-full" asChild>
              <a
                href={`https://github.com/${build.github_run_id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                GitHub Actions'ta Görüntüle
              </a>
            </Button>
          )}

          {/* Build Log */}
          <div>
            <p className="text-sm font-medium mb-2">Build Log</p>
            <ScrollArea className="h-[300px] rounded-md border bg-muted/30 p-3">
              {build.build_log ? (
                <pre className="text-xs font-mono whitespace-pre-wrap break-all text-foreground">
                  {build.build_log}
                </pre>
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  {build.build_status === "pending"
                    ? "Build henüz başlamadı, log bilgisi yok."
                    : build.build_status === "building"
                    ? "Build devam ediyor, log tamamlandığında burada görünecek..."
                    : "Log bilgisi mevcut değil."}
                </p>
              )}
            </ScrollArea>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
