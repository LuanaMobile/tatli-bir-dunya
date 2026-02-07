import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save, Eye, EyeOff, Github, CheckCircle2, XCircle, FlaskConical } from "lucide-react";
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

type TestStatus = "idle" | "testing" | "success" | "error";

export function GitHubSettingsTab() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SettingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [visibleSecrets, setVisibleSecrets] = useState<Set<string>>(new Set());
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [testStatus, setTestStatus] = useState<Record<string, TestStatus>>({});
  const [testMessages, setTestMessages] = useState<Record<string, string>>({});

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

  const getTestType = (key: string): string | null => {
    switch (key) {
      case "GITHUB_TOKEN": return "token";
      case "GITHUB_REPO": return "repo";
      case "GITHUB_WORKFLOW_FILE": return "workflow";
      default: return null;
    }
  };

  const handleTest = async (key: string) => {
    const testType = getTestType(key);
    if (!testType) return;

    setTestStatus((prev) => ({ ...prev, [key]: "testing" }));
    setTestMessages((prev) => ({ ...prev, [key]: "" }));

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/test-github-settings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            test_type: testType,
            token: editValues["GITHUB_TOKEN"] || undefined,
            repo: editValues["GITHUB_REPO"] || undefined,
            workflow_file: editValues["GITHUB_WORKFLOW_FILE"] || undefined,
          }),
        }
      );

      const result = await res.json();

      if (result.success) {
        setTestStatus((prev) => ({ ...prev, [key]: "success" }));
        setTestMessages((prev) => ({ ...prev, [key]: result.message }));
      } else {
        setTestStatus((prev) => ({ ...prev, [key]: "error" }));
        setTestMessages((prev) => ({ ...prev, [key]: result.message || result.error }));
      }
    } catch (err: any) {
      setTestStatus((prev) => ({ ...prev, [key]: "error" }));
      setTestMessages((prev) => ({ ...prev, [key]: err.message }));
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

  const testable = (key: string) => getTestType(key) !== null;

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
        {settings.map((setting) => {
          const status = testStatus[setting.key] || "idle";
          const message = testMessages[setting.key] || "";

          return (
            <div key={setting.key} className="space-y-1.5">
              <Label>{getLabel(setting.key)}</Label>
              {setting.description && (
                <p className="text-xs text-muted-foreground">{setting.description}</p>
              )}
              <div className="flex gap-2">
                <Input
                  type={setting.is_secret && !visibleSecrets.has(setting.key) ? "password" : "text"}
                  value={editValues[setting.key] ?? ""}
                  onChange={(e) => {
                    setEditValues((prev) => ({ ...prev, [setting.key]: e.target.value }));
                    // Reset test status on value change
                    setTestStatus((prev) => ({ ...prev, [setting.key]: "idle" }));
                    setTestMessages((prev) => ({ ...prev, [setting.key]: "" }));
                  }}
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
                {testable(setting.key) && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1.5 shrink-0"
                    disabled={status === "testing"}
                    onClick={() => handleTest(setting.key)}
                  >
                    {status === "testing" ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : status === "success" ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                    ) : status === "error" ? (
                      <XCircle className="h-3.5 w-3.5 text-destructive" />
                    ) : (
                      <FlaskConical className="h-3.5 w-3.5" />
                    )}
                    Test
                  </Button>
                )}
              </div>
              {message && (
                <p className={`text-xs mt-1 ${status === "success" ? "text-green-600" : "text-destructive"}`}>
                  {message}
                </p>
              )}
            </div>
          );
        })}

        <Button onClick={handleSave} disabled={saving} className="gap-2 mt-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </Button>
      </CardContent>
    </Card>
  );
}
