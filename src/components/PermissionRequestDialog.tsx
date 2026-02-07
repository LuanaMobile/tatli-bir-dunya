import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bell, MapPin, Camera, HardDrive, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type PermissionStatus = "prompt" | "granted" | "denied" | "unsupported" | "loading";

interface PermissionItem {
  key: string;
  label: string;
  description: string;
  icon: React.ElementType;
  status: PermissionStatus;
}

const STORAGE_KEY = "clearhuma_permissions_requested";

export function PermissionRequestDialog() {
  const [open, setOpen] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const { toast } = useToast();

  const [statuses, setStatuses] = useState<Record<string, PermissionStatus>>({
    notifications: "loading",
    location: "loading",
    camera: "loading",
    storage: "loading",
  });

  const checkPermissions = useCallback(async () => {
    const result: Record<string, PermissionStatus> = {};

    // Notifications
    if ("Notification" in window) {
      result.notifications = Notification.permission as PermissionStatus;
    } else {
      result.notifications = "unsupported";
    }

    // Location
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

    // Camera
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

    // Storage (persistent)
    if (navigator.storage?.persist) {
      const persisted = await navigator.storage.persisted();
      result.storage = persisted ? "granted" : "prompt";
    } else {
      result.storage = "unsupported";
    }

    setStatuses(result);
    return result;
  }, []);

  useEffect(() => {
    const alreadyRequested = localStorage.getItem(STORAGE_KEY);
    if (alreadyRequested) return;

    // Small delay so app renders first
    const timer = setTimeout(async () => {
      const s = await checkPermissions();
      const needsAny = Object.values(s).some((v) => v === "prompt");
      if (needsAny) {
        setOpen(true);
      } else {
        localStorage.setItem(STORAGE_KEY, "true");
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [checkPermissions]);

  const requestAll = async () => {
    setRequesting(true);
    try {
      // Notifications
      if (statuses.notifications === "prompt" && "Notification" in window) {
        await Notification.requestPermission();
      }

      // Location
      if (statuses.location === "prompt" && "geolocation" in navigator) {
        await new Promise<void>((resolve) => {
          navigator.geolocation.getCurrentPosition(
            () => resolve(),
            () => resolve(),
            { timeout: 5000 }
          );
        });
      }

      // Camera
      if (statuses.camera === "prompt" && navigator.mediaDevices?.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          stream.getTracks().forEach((t) => t.stop());
        } catch {
          // User denied or no camera
        }
      }

      // Storage
      if (statuses.storage === "prompt" && navigator.storage?.persist) {
        await navigator.storage.persist();
      }

      await checkPermissions();
      localStorage.setItem(STORAGE_KEY, "true");
      toast({ title: "İzinler güncellendi", description: "Uygulama izinleri ayarlandı." });
      setOpen(false);
    } catch {
      toast({ title: "Hata", description: "Bazı izinler alınamadı.", variant: "destructive" });
    } finally {
      setRequesting(false);
    }
  };

  const permissions: PermissionItem[] = [
    {
      key: "notifications",
      label: "Bildirimler",
      description: "Anlık bildirimler alın",
      icon: Bell,
      status: statuses.notifications,
    },
    {
      key: "location",
      label: "Konum",
      description: "Konum tabanlı özellikler",
      icon: MapPin,
      status: statuses.location,
    },
    {
      key: "camera",
      label: "Kamera",
      description: "Fotoğraf ve QR okuma",
      icon: Camera,
      status: statuses.camera,
    },
    {
      key: "storage",
      label: "Depolama",
      description: "Çevrimdışı veri saklama",
      icon: HardDrive,
      status: statuses.storage,
    },
  ];

  const statusIcon = (s: PermissionStatus) => {
    if (s === "granted") return <CheckCircle2 className="h-4 w-4 text-success" />;
    if (s === "denied") return <XCircle className="h-4 w-4 text-destructive" />;
    if (s === "loading") return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { localStorage.setItem(STORAGE_KEY, "true"); } setOpen(v); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Uygulama İzinleri</DialogTitle>
          <DialogDescription>
            ClearHuma'nın düzgün çalışması için aşağıdaki izinlere ihtiyacı var.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {permissions.map((p) => (
            <div key={p.key} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <p.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{p.label}</p>
                <p className="text-xs text-muted-foreground">{p.description}</p>
              </div>
              {statusIcon(p.status)}
            </div>
          ))}
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button onClick={requestAll} disabled={requesting} className="w-full gap-2">
            {requesting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {requesting ? "İzinler isteniyor..." : "Tüm İzinleri Ver"}
          </Button>
          <Button
            variant="ghost"
            className="w-full text-muted-foreground"
            onClick={() => { localStorage.setItem(STORAGE_KEY, "true"); setOpen(false); }}
          >
            Şimdilik geç
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
