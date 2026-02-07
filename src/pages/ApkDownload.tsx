import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Smartphone, Shield, CheckCircle2, Clock, MonitorSmartphone, Loader2, Copy, Plus, Key, FileDown, Trash2 } from "lucide-react";
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
    const ua = navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(ua));
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }
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

  // Fetch user's activation codes
  const { data: activations, isLoading: loadingCodes } = useQuery({
    queryKey: ["device-activations", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("device_activations")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch latest successful APK build
  const { data: latestBuild } = useQuery({
    queryKey: ["latest-apk-build"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apk_build_configs")
        .select("id, version, app_name, apk_url, created_at")
        .eq("build_status", "success")
        .not("apk_url", "is", null)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  // Generate new activation code
  const generateCodeMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke("activate-device", {
        body: { action: "generate" },
      });
      if (error || !data?.success) throw new Error(data?.error || "Kod oluşturulamadı");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["device-activations"] });
      toast({ title: "Yeni Kod Oluşturuldu", description: "Aktivasyon kodunuz hazır." });
    },
    onError: (err: Error) => {
      toast({ title: "Hata", description: err.message, variant: "destructive" });
    },
  });

  // PWA install
  const installMutation = useMutation({
    mutationFn: async () => {
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

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: "Kopyalandı", description: "Aktivasyon kodu panoya kopyalandı." });
  };

  // Delete activation code
  const deleteCodeMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("device_activations")
        .delete()
        .eq("id", id)
        .eq("user_id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["device-activations"] });
      toast({ title: "Silindi", description: "Aktivasyon kodu silindi." });
    },
    onError: () => {
      toast({ title: "Hata", description: "Kod silinemedi.", variant: "destructive" });
    },
  });

  return (
    <div className="space-y-6">
      <AnimatedSection>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Uygulamayı İndir</h1>
          <p className="text-muted-foreground">ClearHuma'yı telefonunuza kurun ve aktivasyon koduyla bağlayın</p>
        </div>
      </AnimatedSection>

      {/* APK Download Section */}
      {latestBuild?.apk_url && (
        <AnimatedSection delay={0.05}>
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <FileDown className="h-7 w-7 text-primary" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-lg font-bold">APK İndir</h2>
                  <p className="text-muted-foreground text-sm">
                    {latestBuild.app_name} v{latestBuild.version} — Android cihazınıza kurun
                  </p>
                </div>
                <Button
                  size="lg"
                  className="shrink-0 gap-2"
                  onClick={() => {
                    window.open(latestBuild.apk_url!, "_blank");
                    toast({ title: "İndirme Başladı", description: "APK dosyanız indiriliyor..." });
                  }}
                >
                  <Download className="h-5 w-5" />
                  APK İndir ({latestBuild.version})
                </Button>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
      )}

      {/* Activation Codes Section */}
      <AnimatedSection delay={0.1}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Key className="h-4 w-4 text-primary" />
                Aktivasyon Kodlarım
              </CardTitle>
              <CardDescription>
                APK'yı açtığınızda bu kodu girerek cihazınızı hesabınıza bağlayın
              </CardDescription>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={() => generateCodeMutation.mutate()}
              disabled={generateCodeMutation.isPending}
            >
              {generateCodeMutation.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Plus className="h-3.5 w-3.5" />
              )}
              Yeni Kod
            </Button>
          </CardHeader>
          <CardContent>
            {loadingCodes ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : !activations?.length ? (
              <div className="text-center py-6 space-y-2">
                <p className="text-sm text-muted-foreground">Henüz aktivasyon kodunuz yok.</p>
                <Button
                  size="sm"
                  onClick={() => generateCodeMutation.mutate()}
                  disabled={generateCodeMutation.isPending}
                  className="gap-1.5"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Kod Oluştur
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {activations.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Smartphone className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-mono font-bold tracking-widest">
                        {a.activation_code.toUpperCase()}
                      </p>
                      <div className="flex items-center gap-2">
                        {a.is_activated ? (
                          <Badge variant="default" className="text-xs bg-success/10 text-success border-success/20">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Aktif
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            Bekliyor
                          </Badge>
                        )}
                        {a.device_name && (
                          <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                            {a.device_name}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyCode(a.activation_code.toUpperCase())}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          if (confirm("Bu aktivasyon kodunu silmek istediğinize emin misiniz?")) {
                            deleteCodeMutation.mutate(a.id);
                          }
                        }}
                        disabled={deleteCodeMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* Main install card */}
      <AnimatedSection delay={0.15}>
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <MonitorSmartphone className="h-10 w-10 text-primary" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl font-bold">ClearHuma Mobil</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Telefonunuza kurun, aktivasyon koduyla hesabınıza bağlayın.
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-3 justify-center sm:justify-start">
                  <Badge variant="outline" className="text-xs">v1.0.0</Badge>
                  <Badge variant="outline" className="text-xs">Android & iOS</Badge>
                  <Badge variant="outline" className="text-xs">Kişiye Özel</Badge>
                </div>
              </div>
              {isInstalled ? (
                <div className="flex items-center gap-2 text-success shrink-0">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium text-sm">Kurulu</span>
                </div>
              ) : (
                <Button
                  size="lg"
                  className="shrink-0 gap-2"
                  onClick={() => {
                    if (deferredPrompt) {
                      installMutation.mutate();
                    } else {
                      document.getElementById("install-steps")?.scrollIntoView({ behavior: "smooth" });
                      toast({
                        title: "Kurulum Rehberi",
                        description: isIOS
                          ? "Safari'de Paylaş → Ana Ekrana Ekle adımlarını takip edin."
                          : "Chrome menüsünden (⋮) → Uygulamayı yükle seçeneğini kullanın.",
                      });
                    }
                  }}
                  disabled={installMutation.isPending}
                >
                  {installMutation.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Download className="h-5 w-5" />
                  )}
                  Uygulamayı İndir
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* How it works */}
      <AnimatedSection delay={0.2}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Nasıl Çalışır?</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {[
                "Yukarıdan 'Yeni Kod' butonuyla kişisel aktivasyon kodunuzu oluşturun.",
                "Aşağıdaki adımlarla uygulamayı telefonunuza kurun veya APK'yı indirin.",
                "Uygulamayı açın — aktivasyon kodu giriş ekranı karşınıza çıkacak.",
                "Kodunuzu girin — cihazınız otomatik olarak hesabınıza bağlanacak.",
                "Her cihaz için ayrı kod gerekir — böylece herkes kendi hesabını kullanır.",
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

      {/* Features */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <AnimatedSection delay={0.25}>
          <Card className="h-full">
            <CardContent className="p-5 flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                <Shield className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="font-medium text-sm">Kişiye Özel</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Her kullanıcı kendi aktivasyon koduyla bağlanır.
                </p>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
        <AnimatedSection delay={0.3}>
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
        <AnimatedSection delay={0.35}>
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
      <AnimatedSection delay={0.4}>
        <Card id="install-steps">
          <CardHeader>
            <CardTitle className="text-base">Kurulum Adımları</CardTitle>
            <CardDescription>
              {isIOS ? "iPhone / iPad için kurulum" : "Android telefon için kurulum"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {(isIOS
                ? [
                    "Safari tarayıcısında bu sayfayı açın.",
                    "Alt kısımdaki Paylaş (Share) butonuna dokunun.",
                    "\"Ana Ekrana Ekle\" seçeneğini seçin.",
                    "\"Ekle\" butonuna dokunun.",
                    "Ana ekrandan ClearHuma ikonuna dokunarak açın ve aktivasyon kodunuzu girin.",
                  ]
                : [
                    "Chrome tarayıcısında bu sayfayı açın.",
                    "Sağ üstteki üç nokta menüsüne (⋮) dokunun.",
                    "\"Uygulamayı yükle\" seçeneğine dokunun.",
                    "\"Yükle\" butonuna dokunun.",
                    "Ana ekrandan ClearHuma ikonuna dokunarak açın ve aktivasyon kodunuzu girin.",
                  ]
              ).map((step, i) => (
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