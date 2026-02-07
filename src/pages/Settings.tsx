import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Database, Bell, FileText } from "lucide-react";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ayarlar</h1>
        <p className="text-muted-foreground">Sistem ayarları ve konfigürasyon</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">Genel</TabsTrigger>
          <TabsTrigger value="privacy">Gizlilik & Hukuk</TabsTrigger>
          <TabsTrigger value="notifications">Bildirimler</TabsTrigger>
          <TabsTrigger value="data">Veri Yönetimi</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Platform Bilgileri</CardTitle>
              <CardDescription>Temel platform ayarları</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Platform Adı</Label>
                  <Input defaultValue="ClearHuma" />
                </div>
                <div className="space-y-2">
                  <Label>Admin Email</Label>
                  <Input defaultValue="admin@clearhuma.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>API Endpoint</Label>
                <Input defaultValue="https://api.clearhuma.com/v1" readOnly className="text-muted-foreground" />
              </div>
              <Button>Kaydet</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-base">Gizlilik & KVKK Ayarları</CardTitle>
                  <CardDescription>Veri koruma ve yasal uyum</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Açık Rıza Zorunluluğu</p>
                  <p className="text-xs text-muted-foreground">Veri toplamadan önce açık onay alınması</p>
                </div>
                <Switch defaultChecked disabled />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Unutulma Hakkı</p>
                  <p className="text-xs text-muted-foreground">Kullanıcıların veri silme talebi oluşturabilmesi</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Otomatik Veri Temizliği</p>
                  <p className="text-xs text-muted-foreground">Saklama süresi dolan verilerin otomatik silinmesi</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Varsayılan Veri Saklama Süresi (gün)</Label>
                <Input type="number" defaultValue="90" className="max-w-[200px]" />
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Gizlilik Politikası
                </Button>
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Kullanıcı Sözleşmesi
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-base">Bildirim Ayarları</CardTitle>
                  <CardDescription>Email ve web bildirim tercihleri</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Kullanım Limiti Uyarısı</p>
                  <p className="text-xs text-muted-foreground">Günlük limit aşıldığında bildirim</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">İzin Süresi Dolma Uyarısı</p>
                  <p className="text-xs text-muted-foreground">İzin süresi dolmadan önce hatırlatma</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Abonelik Bitiş Uyarısı</p>
                  <p className="text-xs text-muted-foreground">Abonelik süresi dolmadan 7 gün önce</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Sistem Uyarıları</p>
                  <p className="text-xs text-muted-foreground">Kritik sistem bildirimleri</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-base">Veri Yönetimi</CardTitle>
                  <CardDescription>Veritabanı ve depolama ayarları</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 rounded-lg bg-muted/50 border">
                  <p className="text-sm font-medium">Toplam Veri</p>
                  <p className="text-2xl font-bold mt-1">24.8 GB</p>
                  <p className="text-xs text-muted-foreground mt-1">Son güncelleme: 5 dk önce</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 border">
                  <p className="text-sm font-medium">Aktif Kayıt</p>
                  <p className="text-2xl font-bold mt-1">1.2M</p>
                  <p className="text-xs text-muted-foreground mt-1">activity_logs tablosu</p>
                </div>
              </div>
              <Separator />
              <div className="flex gap-2">
                <Button variant="destructive" size="sm">Süresi Dolan Verileri Temizle</Button>
                <Button variant="outline" size="sm">Veritabanı Yedekle</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
