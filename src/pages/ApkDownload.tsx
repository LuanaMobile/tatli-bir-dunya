import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Smartphone, Shield, CheckCircle2, Clock } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { useToast } from "@/hooks/use-toast";

export default function ApkDownload() {
  const { toast } = useToast();

  const handleDownload = () => {
    toast({
      title: "İndirme başlatıldı",
      description: "ClearHuma APK dosyanız hazırlanıyor...",
    });

    // Simulate download delay
    setTimeout(() => {
      const blob = new Blob(["ClearHuma APK Placeholder"], { type: "application/vnd.android.package-archive" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ClearHuma-v1.2.0.apk";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "İndirme tamamlandı",
        description: "APK dosyası indirildi. Cihazınıza yükleyebilirsiniz.",
      });
    }, 1500);
  };

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
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <Smartphone className="h-10 w-10 text-primary" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl font-bold">ClearHuma Mobil</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Android cihazınıza yükleyerek aktivite takibini kolayca yapın.
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-3 justify-center sm:justify-start">
                  <Badge variant="outline" className="text-xs">v1.2.0</Badge>
                  <Badge variant="outline" className="text-xs">Android 8.0+</Badge>
                  <Badge variant="outline" className="text-xs">18.4 MB</Badge>
                </div>
              </div>
              <Button size="lg" className="shrink-0 gap-2" onClick={handleDownload}>
                <Download className="h-5 w-5" />
                APK İndir
              </Button>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <AnimatedSection delay={0.15}>
          <Card className="h-full">
            <CardContent className="p-5 flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                <Shield className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="font-medium text-sm">Güvenli Bağlantı</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Tüm veriler uçtan uca şifrelenerek iletilir.
                </p>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <Card className="h-full">
            <CardContent className="p-5 flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Otomatik Güncelleme</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Yeni sürümler çıktığında otomatik bildirim alırsınız.
                </p>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>

        <AnimatedSection delay={0.25}>
          <Card className="h-full">
            <CardContent className="p-5 flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-info/10 flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="font-medium text-sm">7/24 Takip</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Arka planda çalışarak kesintisiz aktivite kaydı tutar.
                </p>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>

      <AnimatedSection delay={0.3}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Kurulum Adımları</CardTitle>
            <CardDescription>APK dosyasını indirdikten sonra aşağıdaki adımları takip edin</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {[
                "Yukarıdaki butona tıklayarak APK dosyasını indirin.",
                "Android cihazınızda Ayarlar → Güvenlik → Bilinmeyen Kaynaklar seçeneğini aktif edin.",
                "İndirilen APK dosyasına dokunarak kurulumu başlatın.",
                "Uygulama açıldığında hesap bilgilerinizle giriş yapın.",
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
