import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save, Eye, EyeOff, Github } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SettingRow {
  id: string;
  key: string;
  value: string;
  description: string | null;
  is_secret: boolean;
}

const SETTING_KEYS = [
  "GITHUB_TOKEN",
  "GITHUB_REPO",
  "GITHUB_WORKFLOW_FILE",
  "APK_BUILD_CALLBACK_SECRET",
];

export function GitHubSettingsTab() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SettingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [visibleSecrets, setVisibleSecrets] = useState<Set<string>>(new Set());
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("system_settings")
      .select("*")
      .in("key", SETTING_KEYS)
      .order("key");

    if (error) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    } else if (data) {
      setSettings(data as SettingRow[]);
      const vals: Record<string, string> = {};
      data.forEach((s: SettingRow) => { vals[s.key] = s.value; });
      setEditValues(vals);
    }
    setLoading(false);
  };

  const toggleVisibility = (key: string) => {
    setVisibleSecrets((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const setting of settings) {
        const newValue = editValues[setting.key];
        if (newValue !== setting.value) {
          const { error } = await supabase
            .from("system_settings")
            .update({ value: newValue })
            .eq("key", setting.key);
          if (error) throw error;
        }
      }
      toast({ title: "Kaydedildi", description: "GitHub ayarları güncellendi." });
      await fetchSettings();
    } catch (err: any) {
      toast({ title: "Hata", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const getLabel = (key: string) => {
    switch (key) {
      case "GITHUB_TOKEN": return "GitHub Token";
      case "GITHUB_REPO": return "GitHub Repo (owner/repo)";
      case "GITHUB_WORKFLOW_FILE": return "Workflow Dosya Adı";
      case "APK_BUILD_CALLBACK_SECRET": return "Callback Secret";
      default: return key;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Github className="h-5 w-5 text-primary" />
          <div>
            <CardTitle className="text-base">GitHub Actions Entegrasyonu</CardTitle>
            <CardDescription>APK build pipeline için GitHub bağlantı ayarları</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {settings.map((setting) => (
          <div key={setting.key} className="space-y-1.5">
            <Label>{getLabel(setting.key)}</Label>
            {setting.description && (
              <p className="text-xs text-muted-foreground">{setting.description}</p>
            )}
            <div className="flex gap-2">
              <Input
                type={setting.is_secret && !visibleSecrets.has(setting.key) ? "password" : "text"}
                value={editValues[setting.key] ?? ""}
                onChange={(e) => setEditValues((prev) => ({ ...prev, [setting.key]: e.target.value }))}
                placeholder={setting.is_secret ? "••••••••" : "Değer girin"}
              />
              {setting.is_secret && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => toggleVisibility(setting.key)}
                >
                  {visibleSecrets.has(setting.key) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              )}
            </div>
          </div>
        ))}

        <Button onClick={handleSave} disabled={saving} className="gap-2 mt-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </Button>
      </CardContent>
    </Card>
  );
}
