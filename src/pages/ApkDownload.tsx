import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Smartphone, Shield, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function ApkDownload() {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get latest active APK version
  const { data: latestApk, isLoading: apkLoading } = useQuery({
    queryKey: ["apk-latest"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apk_versions")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  // Get user's download history
  const { data: myDownloads } = useQuery({
    queryKey: ["apk-downloads", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apk_downloads")
        .select("*, apk_versions(*)")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Download mutation
  const downloadMutation = useMutation({
    mutationFn: async () => {
      if (!latestApk || !user) throw new Error("APK bulunamadı");

      // Record download
      const { error } = await supabase.from("apk_downloads").insert({
        user_id: user.id,
        apk_version_id: latestApk.id,
        downloaded_at: new Date().toISOString(),
      });
      if (error) throw error;

      // Trigger file download if URL exists
      if (latestApk.file_url) {
        const a = document.createElement("a");
        a.href = latestApk.file_url;
        a.download = `ClearHuma-${latestApk.version}-${user.id.slice(0, 8)}.apk`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apk-downloads"] });
      toast({
        title: "İndirme başlatıldı",
        description: "APK dosyanız kişisel tokenınızla hazırlanıyor...",
      });
    },
    onError: (err: any) => {
      toast({
        title: "Hata",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const lastDownload = myDownloads?.[0];
  const downloadToken = lastDownload?.download_token;

  return (
    <div className="space-y-6">
      <AnimatedSection>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">APK İndir</h1>
          <p className="text-muted-foreground">ClearHuma mobil uygulamasını indirin</p>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <Card>
          <CardContent className="p-6 sm:p-8">
            {apkLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : !latestApk ? (
              <div className="text-center py-8">
                <Smartphone className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="font-medium">Henüz APK yüklenmemiş</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Yönetici tarafından APK yüklendikten sonra buradan indirebilirsiniz.
                </p>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Smartphone className="h-10 w-10 text-primary" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-xl font-bold">ClearHuma Mobil</h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    Size özel oluşturulmuş kişisel takip uygulaması.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-3 justify-center sm:justify-start">
                    <Badge variant="outline" className="text-xs">v{latestApk.version}</Badge>
                    <Badge variant="outline" className="text-xs">{latestApk.min_android}</Badge>
                    {latestApk.file_size && (
                      <Badge variant="outline" className="text-xs">{latestApk.file_size}</Badge>
                    )}
                  </div>
                  {latestApk.release_notes && (
                    <p className="text-xs text-muted-foreground mt-2">{latestApk.release_notes}</p>
                  )}
                </div>
                <Button
                  size="lg"
                  className="shrink-0 gap-2"
                  onClick={() => downloadMutation.mutate()}
                  disabled={downloadMutation.isPending}
                >
                  {downloadMutation.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Download className="h-5 w-5" />
                  )}
                  APK İndir
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* Personal token info */}
      {downloadToken && (
        <AnimatedSection delay={0.15}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Kişisel İndirme Bilgileri</CardTitle>
              <CardDescription>Bu token size özeldir, başkalarıyla paylaşmayın</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Shield className="h-5 w-5 text-primary shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Kişisel Token</p>
                  <p className="text-sm font-mono truncate">{downloadToken}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Toplam indirme: <span className="font-medium">{myDownloads?.length ?? 0}</span>
                {lastDownload?.downloaded_at && (
                  <> · Son indirme: <span className="font-medium">
                    {new Date(lastDownload.downloaded_at).toLocaleString("tr-TR")}
                  </span></>
                )}
              </p>
            </CardContent>
          </Card>
        </AnimatedSection>
      )}

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        {[
          { icon: Shield, color: "success", title: "Güvenli Bağlantı", desc: "Tüm veriler uçtan uca şifrelenerek iletilir." },
          { icon: CheckCircle2, color: "primary", title: "Otomatik Güncelleme", desc: "Yeni sürümler çıktığında bildirim alırsınız." },
          { icon: Clock, color: "info", title: "7/24 Takip", desc: "Arka planda kesintisiz aktivite kaydı tutar." },
        ].map((item, i) => (
          <AnimatedSection key={item.title} delay={0.2 + i * 0.05}>
            <Card className="h-full">
              <CardContent className="p-5 flex items-start gap-3">
                <div className={`h-9 w-9 rounded-lg bg-${item.color}/10 flex items-center justify-center shrink-0`}>
                  <item.icon className={`h-5 w-5 text-${item.color}`} />
                </div>
                <div>
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </CardContent>
            </Card>
          </AnimatedSection>
        ))}
      </div>

      <AnimatedSection delay={0.35}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Kurulum Adımları</CardTitle>
            <CardDescription>APK dosyasını indirdikten sonra aşağıdaki adımları takip edin</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {[
                "Yukarıdaki butona tıklayarak kişisel APK dosyanızı indirin.",
                "Android cihazınızda Ayarlar → Güvenlik → Bilinmeyen Kaynaklar seçeneğini aktif edin.",
                "İndirilen APK dosyasına dokunarak kurulumu başlatın.",
                "Uygulama açıldığında hesap bilgilerinizle giriş yapın.",
                "Gerekli izinleri (konum, SMS, arama vb.) verin — tüm veriler yalnızca size aittir.",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm text-muted-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  );
}
