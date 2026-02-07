import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, Trash2, Download, Package, Loader2 } from "lucide-react";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ResponsiveTable } from "@/components/ResponsiveTable";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useRef } from "react";

export default function ApkManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [version, setVersion] = useState("");
  const [releaseNotes, setReleaseNotes] = useState("");
  const [uploading, setUploading] = useState(false);

  const { data: versions, isLoading } = useQuery({
    queryKey: ["apk-versions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apk_versions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: downloads } = useQuery({
    queryKey: ["apk-all-downloads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("apk_downloads")
        .select("*, apk_versions(version), profiles:user_id(full_name, email)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const handleUpload = async () => {
    if (!version.trim()) {
      toast({ title: "Hata", description: "Versiyon numarası gerekli", variant: "destructive" });
      return;
    }

    const file = fileRef.current?.files?.[0];
    let fileUrl = "";
    let fileSize = "";

    setUploading(true);
    try {
      if (file) {
        const filePath = `${version}/${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("apk-files")
          .upload(filePath, file, { upsert: true });
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("apk-files")
          .getPublicUrl(filePath);
        fileUrl = urlData.publicUrl;
        fileSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      }

      const { error } = await supabase.from("apk_versions").insert({
        version: version.trim(),
        file_url: fileUrl || null,
        file_size: fileSize || null,
        release_notes: releaseNotes.trim() || null,
        is_active: true,
      });
      if (error) throw error;

      // Deactivate older versions
      const { data: allVersions } = await supabase
        .from("apk_versions")
        .select("id")
        .neq("version", version.trim())
        .eq("is_active", true);

      if (allVersions?.length) {
        await supabase
          .from("apk_versions")
          .update({ is_active: false })
          .in("id", allVersions.map((v) => v.id));
      }

      queryClient.invalidateQueries({ queryKey: ["apk-versions"] });
      setVersion("");
      setReleaseNotes("");
      if (fileRef.current) fileRef.current.value = "";
      toast({ title: "Başarılı", description: "APK versiyonu eklendi" });
    } catch (err: any) {
      toast({ title: "Hata", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("apk_versions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apk-versions"] });
      toast({ title: "Silindi" });
    },
  });

  return (
    <div className="space-y-6">
      <AnimatedSection>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">APK Yönetimi</h1>
          <p className="text-muted-foreground">Mobil uygulama versiyonlarını yönetin</p>
        </div>
      </AnimatedSection>

      {/* Upload new version */}
      <AnimatedSection delay={0.1}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Yeni Versiyon Yükle</CardTitle>
            <CardDescription>APK dosyasını yükleyin, kullanıcılar otomatik görecek</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Versiyon Numarası</Label>
                <Input placeholder="1.3.0" value={version} onChange={(e) => setVersion(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>APK Dosyası</Label>
                <Input ref={fileRef} type="file" accept=".apk" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Değişiklik Notları</Label>
              <Input placeholder="Bu versiyonda neler değişti..." value={releaseNotes} onChange={(e) => setReleaseNotes(e.target.value)} />
            </div>
            <Button onClick={handleUpload} disabled={uploading} className="gap-2">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {uploading ? "Yükleniyor..." : "Yükle ve Yayınla"}
            </Button>
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <AnimatedSection delay={0.15}>
          <Card>
            <CardContent className="p-5 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{versions?.length ?? 0}</p>
                <p className="text-xs text-muted-foreground">Toplam Versiyon</p>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
        <AnimatedSection delay={0.2}>
          <Card>
            <CardContent className="p-5 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Download className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{downloads?.length ?? 0}</p>
                <p className="text-xs text-muted-foreground">Toplam İndirme</p>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
        <AnimatedSection delay={0.25}>
          <Card>
            <CardContent className="p-5 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center">
                <Upload className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold">{versions?.filter((v) => v.is_active).length ?? 0}</p>
                <p className="text-xs text-muted-foreground">Aktif Versiyon</p>
              </div>
            </CardContent>
          </Card>
        </AnimatedSection>
      </div>

      {/* Versions table */}
      <AnimatedSection delay={0.3}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Versiyonlar</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ResponsiveTable>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Versiyon</TableHead>
                    <TableHead>Boyut</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead className="hidden sm:table-cell">Tarih</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
                      </TableCell>
                    </TableRow>
                  ) : !versions?.length ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Henüz versiyon yok
                      </TableCell>
                    </TableRow>
                  ) : (
                    versions.map((v) => (
                      <TableRow key={v.id}>
                        <TableCell className="font-medium">v{v.version}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{v.file_size ?? "—"}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={v.is_active ? "bg-success/10 text-success border-success/20" : ""}>
                            {v.is_active ? "Aktif" : "Pasif"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">
                          {new Date(v.created_at).toLocaleDateString("tr-TR")}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => deleteMutation.mutate(v.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ResponsiveTable>
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* Download logs */}
      <AnimatedSection delay={0.35}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">İndirme Kayıtları</CardTitle>
            <CardDescription>Kullanıcı bazlı indirme takibi</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ResponsiveTable>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kullanıcı</TableHead>
                    <TableHead>Versiyon</TableHead>
                    <TableHead>Token</TableHead>
                    <TableHead className="hidden sm:table-cell">İndirilme</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!downloads?.length ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        Henüz indirme yok
                      </TableCell>
                    </TableRow>
                  ) : (
                    downloads.map((d: any) => (
                      <TableRow key={d.id}>
                        <TableCell>
                          <div>
                            <p className="text-sm font-medium">{d.profiles?.full_name || "—"}</p>
                            <p className="text-xs text-muted-foreground">{d.profiles?.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">v{d.apk_versions?.version ?? "—"}</TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{d.download_token?.slice(0, 12)}...</code>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">
                          {d.downloaded_at ? new Date(d.downloaded_at).toLocaleString("tr-TR") : "—"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ResponsiveTable>
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  );
}
