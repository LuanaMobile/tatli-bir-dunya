import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Smartphone, Shield, CheckCircle2, Clock, Share, MonitorSmartphone, Loader2 } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function ApkDownload() {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS
    const ua = navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(ua));

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Capture install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);

    const installedHandler = () => setIsInstalled(true);
    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  // Track download
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

  const installMutation = useMutation({
    mutationFn: async () => {
      // Record install attempt
      if (user) {
        const { data: latestApk } = await supabase
          .from("apk_versions")
          .select("id")
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        await supabase.from("apk_downloads").insert({
          user_id: user.id,
          apk_version_id: latestApk?.id ?? null,
          downloaded_at: new Date().toISOString(),
        });
      }

      // Trigger PWA install
      if (deferredPrompt) {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
          setIsInstalled(true);
          setDeferredPrompt(null);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apk-downloads"] });
      toast({ title: "Kurulum başlatıldı", description: "Uygulama cihazınıza ekleniyor..." });
    },
  });

  const lastDownload = myDownloads?.[0];
  const downloadToken = lastDownload?.download_token;

  return (
    <div className="space-y-6">
      <AnimatedSection>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Uygulamayı İndir</h1>
          <p className="text-muted-foreground">ClearHuma'yı telefonunuza kurun</p>
        </div>
      </AnimatedSection>

      {/* Main install card */}
      <AnimatedSection delay={0.1}>
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <MonitorSmartphone className="h-10 w-10 text-primary" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl font-bold">ClearHuma Mobil</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Telefonunuza kurun, gerçek bir uygulama gibi çalışsın.
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-3 justify-center sm:justify-start">
                  <Badge variant="outline" className="text-xs">v1.0.0</Badge>
                  <Badge variant="outline" className="text-xs">Android & iOS</Badge>
                  <Badge variant="outline" className="text-xs">Anında Kurulum</Badge>
                </div>
              </div>

              {isInstalled ? (
                <div className="flex items-center gap-2 text-success shrink-0">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium text-sm">Kurulu</span>
                </div>
              ) : deferredPrompt ? (
                <Button
                  size="lg"
                  className="shrink-0 gap-2"
                  onClick={() => installMutation.mutate()}
                  disabled={installMutation.isPending}
                >
                  {installMutation.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Download className="h-5 w-5" />
                  )}
                  Uygulamayı Kur
                </Button>
              ) : (
                <Button size="lg" className="shrink-0 gap-2" variant="outline" disabled>
                  <Share className="h-5 w-5" />
                  Aşağıdaki adımları takip edin
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* Token info */}
      {downloadToken && (
        <AnimatedSection delay={0.15}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Kişisel Kurulum Bilgileri</CardTitle>
              <CardDescription>Bu token size özeldir, verileriniz başkalarıyla paylaşılmaz</CardDescription>
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
                Toplam kurulum: <span className="font-medium">{myDownloads?.length ?? 0}</span>
              </p>
            </CardContent>
          </Card>
        </AnimatedSection>
      )}

      {/* Features */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <AnimatedSection delay={0.2}>
          <Card className="h-full">
            <CardContent className="p-5 flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                <Shield className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="font-medium text-sm">Güvenli & Gizli</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Verileriniz sadece size aittir, diğer kullanıcılar göremez.
                </p>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        <AnimatedSection delay={0.25}>
          <Card className="h-full">
            <CardContent className="p-5 flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Otomatik Güncelleme</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Yeni özellikler otomatik olarak uygulamaya eklenir.
                </p>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          <Card className="h-full">
            <CardContent className="p-5 flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-info/10 flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="font-medium text-sm">Çevrimdışı Çalışır</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  İnternet bağlantısı olmadan da kullanabilirsiniz.
                </p>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>

      {/* Install steps */}
      <AnimatedSection delay={0.35}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Kurulum Adımları</CardTitle>
            <CardDescription>
              {isIOS ? "iPhone / iPad için kurulum" : "Android telefon için kurulum"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {isIOS ? (
                <>
                  {[
                    "Safari tarayıcısında bu sayfayı açın.",
                    "Alt kısımdaki Paylaş (Share) butonuna dokunun.",
                    "\"Ana Ekrana Ekle\" (Add to Home Screen) seçeneğini seçin.",
                    "\"Ekle\" butonuna dokunun — uygulama ana ekranınıza eklenecek.",
                    "Ana ekrandan ClearHuma ikonuna dokunarak açın ve giriş yapın.",
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-sm text-muted-foreground">{step}</span>
                    </li>
                  ))}
                </>
              ) : (
                <>
                  {[
                    "Chrome tarayıcısında bu sayfayı açın.",
                    "Sağ üstteki üç nokta menüsüne (⋮) dokunun.",
                    "\"Uygulamayı yükle\" veya \"Ana ekrana ekle\" seçeneğine dokunun.",
                    "Açılan pencerede \"Yükle\" butonuna dokunun — uygulama ana ekranınıza eklenecek.",
                    "Ana ekrandan ClearHuma ikonuna dokunarak açın ve giriş yapın.",
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-sm text-muted-foreground">{step}</span>
                    </li>
                  ))}
                </>
              )}
            </ol>
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  );
}
