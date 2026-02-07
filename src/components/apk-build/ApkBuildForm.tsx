import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Rocket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";

const ANDROID_PERMISSIONS = [
  { id: "INTERNET", label: "İnternet", default: true },
  { id: "ACCESS_NETWORK_STATE", label: "Ağ Durumu", default: true },
  { id: "CAMERA", label: "Kamera", default: false },
  { id: "ACCESS_FINE_LOCATION", label: "Konum (GPS)", default: false },
  { id: "ACCESS_COARSE_LOCATION", label: "Konum (Yaklaşık)", default: false },
  { id: "READ_EXTERNAL_STORAGE", label: "Depolama Okuma", default: false },
  { id: "WRITE_EXTERNAL_STORAGE", label: "Depolama Yazma", default: false },
  { id: "RECEIVE_BOOT_COMPLETED", label: "Açılışta Başlat", default: false },
  { id: "VIBRATE", label: "Titreşim", default: false },
  { id: "POST_NOTIFICATIONS", label: "Bildirim", default: false },
];

interface ApkBuildFormProps {
  onSuccess: () => void;
}

export function ApkBuildForm({ onSuccess }: ApkBuildFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const [version, setVersion] = useState("");
  const [appName, setAppName] = useState("ClearHuma");
  const [serverUrl, setServerUrl] = useState("https://tatli-bir-dunya.lovable.app");
  const [iconUrl, setIconUrl] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [permissions, setPermissions] = useState<string[]>(
    ANDROID_PERMISSIONS.filter((p) => p.default).map((p) => p.id)
  );

  const togglePermission = (id: string) => {
    setPermissions((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!version.match(/^\d+\.\d+\.\d+$/)) {
      toast({ title: "Hata", description: "Versiyon formatı X.Y.Z olmalı (ör: 1.0.0)", variant: "destructive" });
      return;
    }
    if (!serverUrl.trim()) {
      toast({ title: "Hata", description: "Server URL gerekli", variant: "destructive" });
      return;
    }
    if (!user?.id) return;

    setLoading(true);
    try {
      // 1. Save config
      const { data: config, error: insertErr } = await supabase
        .from("apk_build_configs")
        .insert({
          version: version.trim(),
          app_name: appName.trim(),
          server_url: serverUrl.trim(),
          icon_url: iconUrl.trim() || null,
          tracking_id: trackingId.trim() || null,
          permissions: permissions,
          created_by: user.id,
          build_status: "pending",
        })
        .select()
        .single();

      if (insertErr) throw insertErr;

      // 2. Trigger build
      const { data: fnData, error: fnErr } = await supabase.functions.invoke(
        "trigger-apk-build",
        { body: { config_id: config.id } }
      );

      if (fnErr) throw fnErr;
      if (fnData?.error) throw new Error(fnData.error);

      toast({ title: "Build Tetiklendi!", description: "GitHub Actions çalışıyor..." });
      queryClient.invalidateQueries({ queryKey: ["apk-build-configs"] });
      onSuccess();
      setVersion("");
      setTrackingId("");
    } catch (err: any) {
      toast({ title: "Hata", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Versiyon (semver)</Label>
          <Input placeholder="1.0.0" value={version} onChange={(e) => setVersion(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Uygulama Adı</Label>
          <Input value={appName} onChange={(e) => setAppName(e.target.value)} />
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Server URL</Label>
          <Input value={serverUrl} onChange={(e) => setServerUrl(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Tracking ID (opsiyonel)</Label>
          <Input placeholder="UA-XXXXXXX" value={trackingId} onChange={(e) => setTrackingId(e.target.value)} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>İkon URL (opsiyonel)</Label>
        <Input placeholder="https://..." value={iconUrl} onChange={(e) => setIconUrl(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label>Android İzinleri</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
          {ANDROID_PERMISSIONS.map((perm) => (
            <label key={perm.id} className="flex items-center gap-2 text-sm cursor-pointer">
              <Checkbox
                checked={permissions.includes(perm.id)}
                onCheckedChange={() => togglePermission(perm.id)}
              />
              {perm.label}
            </label>
          ))}
        </div>
      </div>

      <Button onClick={handleSubmit} disabled={loading} className="gap-2">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
        {loading ? "Tetikleniyor..." : "Build Oluştur"}
      </Button>
    </div>
  );
}
