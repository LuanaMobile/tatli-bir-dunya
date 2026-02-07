import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ShieldCheck, CheckCircle2, Bell, MapPin, Camera, HardDrive, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const isNativeApp = () => {
  return window.matchMedia("(display-mode: standalone)").matches ||
    (window as any).Capacitor !== undefined ||
    document.referrer.includes("android-app://");
};

type PermissionStatus = "prompt" | "granted" | "denied" | "unsupported" | "loading";

export default function ActivateDevice() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"code" | "permissions" | "done">("code");
  const [profileName, setProfileName] = useState("");
  const [requesting, setRequesting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // If already activated, skip directly to dashboard
  useEffect(() => {
    const alreadyActivated = localStorage.getItem("clearhuma_device_activated");
    if (alreadyActivated === "true") {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const [statuses, setStatuses] = useState<Record<string, PermissionStatus>>({
    notifications: "loading",
    location: "loading",
    camera: "loading",
    storage: "loading",
  });

  const checkPermissions = useCallback(async () => {
    const result: Record<string, PermissionStatus> = {};

    if ("Notification" in window) {
      result.notifications = Notification.permission as PermissionStatus;
    } else {
      result.notifications = "unsupported";
    }

    if ("permissions" in navigator) {
      try {
        const geo = await navigator.permissions.query({ name: "geolocation" });
        result.location = geo.state as PermissionStatus;
      } catch {
        result.location = "prompt";
      }
    } else {
      result.location = "geolocation" in navigator ? "prompt" : "unsupported";
    }

    if ("permissions" in navigator) {
      try {
        const cam = await navigator.permissions.query({ name: "camera" as PermissionName });
        result.camera = cam.state as PermissionStatus;
      } catch {
        result.camera = (navigator as any).mediaDevices ? "prompt" : "unsupported";
      }
    } else {
      result.camera = (navigator as any).mediaDevices ? "prompt" : "unsupported";
    }

    if (navigator.storage?.persist) {
      const persisted = await navigator.storage.persisted();
      result.storage = persisted ? "granted" : "prompt";
    } else {
      result.storage = "unsupported";
    }

    setStatuses(result);
    return result;
  }, []);

  const requestAllPermissions = async () => {
    setRequesting(true);
    try {
      if (statuses.notifications === "prompt" && "Notification" in window) {
        await Notification.requestPermission();
      }
      if (statuses.location === "prompt" && "geolocation" in navigator) {
        await new Promise<void>((resolve) => {
          navigator.geolocation.getCurrentPosition(() => resolve(), () => resolve(), { timeout: 5000 });
        });
      }
      if (statuses.camera === "prompt" && navigator.mediaDevices?.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          stream.getTracks().forEach((t) => t.stop());
        } catch { /* denied */ }
      }
      if (statuses.storage === "prompt" && navigator.storage?.persist) {
        await navigator.storage.persist();
      }
      await checkPermissions();
      localStorage.setItem("clearhuma_permissions_requested", "true");
      setStep("done");
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch {
      toast({ title: "Hata", description: "Bazı izinler alınamadı.", variant: "destructive" });
    } finally {
      setRequesting(false);
    }
  };

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

      if (data.token_hash && data.email) {
        const { error: otpError } = await supabase.auth.verifyOtp({
          token_hash: data.token_hash,
          type: "magiclink",
        });

        if (otpError) {
          toast({
            title: "Oturum Hatası",
            description: "Otomatik giriş yapılamadı.",
            variant: "destructive",
          });
          return;
        }
      }

      localStorage.setItem("clearhuma_device_activated", "true");
      localStorage.setItem("clearhuma_activation_code", code.trim());

      toast({ title: "Aktivasyon Başarılı!", description: "Cihazınız bağlandı." });

      // Go to permissions step
      await checkPermissions();
      setStep("permissions");
    } catch {
      toast({ title: "Hata", description: "Bağlantı hatası oluştu.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const permissionItems = [
    { key: "notifications", label: "Bildirimler", desc: "Anlık bildirimler alın", icon: Bell },
    { key: "location", label: "Konum", desc: "Konum tabanlı özellikler", icon: MapPin },
    { key: "camera", label: "Kamera", desc: "Fotoğraf ve QR okuma", icon: Camera },
    { key: "storage", label: "Depolama", desc: "Çevrimdışı veri saklama", icon: HardDrive },
  ];

  const statusIcon = (s: PermissionStatus) => {
    if (s === "granted") return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    if (s === "denied") return <XCircle className="h-4 w-4 text-red-500" />;
    if (s === "loading") return <Loader2 className="h-4 w-4 animate-spin text-gray-400" />;
    return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />;
  };

  // Done step
  if (step === "done") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4">
        <div className="w-full max-w-sm text-center space-y-6">
          <div className="h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Hoş Geldiniz!</h2>
            <p className="text-gray-400 mt-1">{profileName}</p>
          </div>
          <p className="text-sm text-gray-500">Yönlendiriliyorsunuz...</p>
        </div>
      </div>
    );
  }

  // Permissions step
  if (step === "permissions") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="h-16 w-16 rounded-2xl bg-blue-500/20 flex items-center justify-center mx-auto">
              <ShieldCheck className="h-8 w-8 text-blue-500" />
            </div>
            <h2 className="text-xl font-bold text-white">Uygulama İzinleri</h2>
            <p className="text-sm text-gray-400">
              ClearHuma'nın düzgün çalışması için aşağıdaki izinlere ihtiyacı var.
            </p>
          </div>

          <div className="space-y-3">
            {permissionItems.map((p) => (
              <div key={p.key} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                  <p.icon className="h-5 w-5 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{p.label}</p>
                  <p className="text-xs text-gray-500">{p.desc}</p>
                </div>
                {statusIcon(statuses[p.key])}
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <button
              onClick={requestAllPermissions}
              disabled={requesting}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 text-white font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50 active:bg-blue-700 transition-colors"
            >
              {requesting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {requesting ? "İzinler isteniyor..." : "Tüm İzinleri Ver"}
            </button>
            <button
              onClick={() => {
                localStorage.setItem("clearhuma_permissions_requested", "true");
                setStep("done");
                setTimeout(() => navigate("/dashboard"), 1500);
              }}
              className="w-full py-3 px-4 rounded-xl text-gray-500 font-medium text-sm active:bg-white/5 transition-colors"
            >
              Şimdilik geç
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Activation code entry step
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-3">
          <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20">
            <ShieldCheck className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">ClearHuma</h1>
          <p className="text-sm text-gray-400">
            Cihazınızı aktive etmek için size verilen kodu girin
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Aktivasyon kodu"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="w-full py-4 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-center text-xl tracking-[0.3em] font-mono placeholder:text-gray-600 placeholder:tracking-normal placeholder:text-base focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-colors"
            maxLength={10}
            onKeyDown={(e) => e.key === "Enter" && handleActivate()}
            autoFocus
          />

          <button
            onClick={handleActivate}
            disabled={loading || !code.trim()}
            className="w-full py-4 px-4 rounded-xl bg-blue-600 text-white font-semibold text-base flex items-center justify-center gap-2 disabled:opacity-40 active:bg-blue-700 transition-colors"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShieldCheck className="h-5 w-5" />}
            {loading ? "Doğrulanıyor..." : "Cihazı Aktive Et"}
          </button>
        </div>

        <p className="text-xs text-center text-gray-600">
          Kodu web panelinizdeki "Uygulamayı İndir" sayfasından alabilirsiniz.
        </p>
      </div>
    </div>
  );
}
