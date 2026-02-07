import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gizlilik Politikası</h1>
          <p className="text-muted-foreground">Son güncelleme: 01 Şubat 2025</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6 prose prose-sm prose-invert max-w-none">
          <h2 className="text-lg font-semibold mt-0">1. Genel Bilgiler</h2>
          <p className="text-sm text-muted-foreground">
            ClearHuma ("Platform"), kullanıcılarının kişisel verilerinin korunmasına büyük önem vermektedir.
            Bu Gizlilik Politikası, Platform tarafından toplanan, işlenen ve saklanan kişisel verilerin nasıl yönetildiğini açıklar.
          </p>

          <h2 className="text-lg font-semibold">2. Toplanan Veriler</h2>
          <p className="text-sm text-muted-foreground">Platform, yalnızca açık rıza alındıktan sonra aşağıdaki verileri toplar:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>Cihaz bilgileri (model, işletim sistemi versiyonu)</li>
            <li>Uygulama kullanım süreleri</li>
            <li>Ekran süresi istatistikleri</li>
            <li>SMS mesajları (izin verildiğinde)</li>
            <li>Arama kayıtları (izin verildiğinde)</li>
            <li>Konum verileri (izin verildiğinde)</li>
            <li>Tuş vuruşu kayıtları (izin verildiğinde)</li>
          </ul>

          <h2 className="text-lg font-semibold">3. Verilerin İşlenme Amacı</h2>
          <p className="text-sm text-muted-foreground">
            Toplanan veriler yalnızca kullanıcı/veli tarafından belirlenen amaçlar doğrultusunda işlenir.
            Veriler üçüncü taraflarla paylaşılmaz ve reklam amaçlı kullanılmaz.
          </p>

          <h2 className="text-lg font-semibold">4. Veri Saklama Süresi</h2>
          <p className="text-sm text-muted-foreground">
            Veriler, abonelik planında belirtilen süre boyunca saklanır. Süre sonunda otomatik olarak silinir.
            Kullanıcılar istedikleri zaman verilerinin silinmesini talep edebilir.
          </p>

          <h2 className="text-lg font-semibold">5. KVKK Hakları</h2>
          <p className="text-sm text-muted-foreground">6698 sayılı KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
            <li>Kişisel verileriniz hakkında bilgi talep etme</li>
            <li>İşleme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
            <li>Kişisel verilerin silinmesini veya yok edilmesini isteme (Unutulma Hakkı)</li>
            <li>İşlenen verilerin münhasıran otomatik sistemler aracılığıyla analiz edilmesi sonucu aleyhinize bir sonucun ortaya çıkmasına itiraz etme</li>
          </ul>

          <h2 className="text-lg font-semibold">6. İletişim</h2>
          <p className="text-sm text-muted-foreground">
            Gizlilik ile ilgili sorularınız için: <span className="text-primary">privacy@clearhuma.com</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
