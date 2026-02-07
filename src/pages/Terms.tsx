import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kullanıcı Sözleşmesi</h1>
          <p className="text-muted-foreground">Son güncelleme: 01 Şubat 2025</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6 prose prose-sm prose-invert max-w-none">
          <h2 className="text-lg font-semibold mt-0">1. Taraflar</h2>
          <p className="text-sm text-muted-foreground">
            Bu sözleşme, ClearHuma platformu ("Hizmet Sağlayıcı") ile platformu kullanan
            gerçek veya tüzel kişi ("Kullanıcı") arasında akdedilmiştir.
          </p>

          <h2 className="text-lg font-semibold">2. Hizmet Tanımı</h2>
          <p className="text-sm text-muted-foreground">
            ClearHuma, açık rıza temelli dijital aktivite analizi ve cihaz yönetim hizmeti sunar.
            Platform, yalnızca yasal çerçevede ve kullanıcı onayı ile çalışır.
          </p>

          <h2 className="text-lg font-semibold">3. Kullanıcı Yükümlülükleri</h2>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>Platformu yalnızca yasal amaçlarla kullanmak</li>
            <li>İzlenen kişiden geçerli açık rıza almak</li>
            <li>Hesap bilgilerinin güvenliğini sağlamak</li>
            <li>Toplanan verileri üçüncü taraflarla paylaşmamak</li>
            <li>Platformu kötüye kullanmamak</li>
          </ul>

          <h2 className="text-lg font-semibold">4. Abonelik ve Ödeme</h2>
          <p className="text-sm text-muted-foreground">
            Abonelik planları aylık veya yıllık olarak sunulur. Otomatik yenileme seçeneği mevcuttur.
            İptal talepleri bir sonraki dönem başlangıcında geçerli olur. Kısmi iade yapılmaz.
          </p>

          <h2 className="text-lg font-semibold">5. Hizmet Sağlayıcı Yükümlülükleri</h2>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>Verilerin güvenli bir şekilde saklanması</li>
            <li>KVKK ve ilgili mevzuata uygunluk</li>
            <li>Hizmet kesintilerinin en aza indirilmesi</li>
            <li>Kullanıcı taleplerinin makul sürede yanıtlanması</li>
          </ul>

          <h2 className="text-lg font-semibold">6. Sözleşme Feshi</h2>
          <p className="text-sm text-muted-foreground">
            Taraflardan herhangi biri 30 gün önceden bildirimde bulunarak sözleşmeyi feshedebilir.
            Fesih halinde tüm veriler kullanıcının talebi doğrultusunda silinir veya teslim edilir.
          </p>

          <h2 className="text-lg font-semibold">7. Uyuşmazlık Çözümü</h2>
          <p className="text-sm text-muted-foreground">
            Bu sözleşmeden doğan uyuşmazlıklarda Türkiye Cumhuriyeti kanunları uygulanır.
            İstanbul Mahkemeleri ve İcra Daireleri yetkilidir.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
