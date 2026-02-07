import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AnimatedSection } from "@/components/AnimatedSection";
import { ApkBuildForm } from "@/components/apk-build/ApkBuildForm";
import { ApkBuildList } from "@/components/apk-build/ApkBuildList";

export default function ApkBuildConfig() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="space-y-6">
      <AnimatedSection>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">APK Build Sistemi</h1>
          <p className="text-muted-foreground">
            GitHub Actions ile otomatik APK oluşturun ve yönetin
          </p>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Yeni Build Oluştur</CardTitle>
            <CardDescription>
              Konfigürasyonu girin, GitHub Actions otomatik tetiklenecek
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ApkBuildForm onSuccess={() => setRefreshKey((k) => k + 1)} />
          </CardContent>
        </Card>
      </AnimatedSection>

      <AnimatedSection delay={0.2}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Build Geçmişi</CardTitle>
            <CardDescription>Tüm build kayıtları ve durumları</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ApkBuildList key={refreshKey} />
          </CardContent>
        </Card>
      </AnimatedSection>
    </div>
  );
}
