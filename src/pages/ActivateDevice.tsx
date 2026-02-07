import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Smartphone, CheckCircle2, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export default function ActivateDevice() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [profileName, setProfileName] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleActivate = async () => {
    if (!code.trim()) {
      toast({ title: "Hata", description: "Lütfen aktivasyon kodunu girin.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("activate-device", {
        body: {
          action: "validate",
          activation_code: code.trim(),
          device_name: navigator.userAgent,
          device_info: {
            platform: navigator.platform,
            language: navigator.language,
            standalone: window.matchMedia("(display-mode: standalone)").matches,
          },
        },
      });

      if (error || !data?.success) {
        toast({
          title: "Geçersiz Kod",
          description: data?.error || "Aktivasyon kodu doğrulanamadı.",
          variant: "destructive",
        });
        return;
      }

      setProfileName(data.profile_name);

      // Use the token_hash to verify OTP and create session
      if (data.token_hash && data.email) {
        const { error: otpError } = await supabase.auth.verifyOtp({
          token_hash: data.token_hash,
          type: "magiclink",
        });

        if (otpError) {
          toast({
            title: "Oturum Hatası",
            description: "Otomatik giriş yapılamadı. Lütfen manuel giriş yapın.",
            variant: "destructive",
          });
          return;
        }
      }

      setSuccess(true);
      toast({ title: "Aktivasyon Başarılı!", description: "Cihazınız bağlandı." });

      // Store activation flag
      localStorage.setItem("clearhuma_device_activated", "true");
      localStorage.setItem("clearhuma_activation_code", code.trim());

      // Redirect to dashboard after 2 seconds
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      toast({ title: "Hata", description: "Bağlantı hatası oluştu.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-sm text-center">
          <CardContent className="pt-8 pb-8 space-y-4">
            <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <h2 className="text-xl font-bold">Hoş Geldiniz!</h2>
            <p className="text-muted-foreground text-sm">{profileName}</p>
            <p className="text-xs text-muted-foreground">Yönlendiriliyorsunuz...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center space-y-3">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <Smartphone className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-xl">ClearHuma</CardTitle>
          <CardDescription>
            Cihazınızı aktive etmek için size verilen kodu girin.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Aktivasyon kodu"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="text-center text-lg tracking-widest font-mono"
            maxLength={10}
            onKeyDown={(e) => e.key === "Enter" && handleActivate()}
            autoFocus
          />
          <Button
            className="w-full gap-2"
            onClick={handleActivate}
            disabled={loading || !code.trim()}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
            {loading ? "Doğrulanıyor..." : "Cihazı Aktive Et"}
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Kodu web panelinizdeki "Uygulamayı İndir" sayfasından alabilirsiniz.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
