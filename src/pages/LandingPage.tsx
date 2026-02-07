import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield, Eye, Smartphone, BarChart3, Lock, Users,
  CheckCircle2, ArrowRight, Zap, FileText, CreditCard,
  Bell, ChevronRight,
} from "lucide-react";
import { AnimatedSection, AnimatedCard, StaggerContainer, StaggerItem } from "@/components/AnimatedSection";

const features = [
  { icon: Shield, title: "Açık Rıza Tabanlı", description: "Hiçbir veri izinsiz toplanmaz. KVKK uyumlu, tam şeffaf altyapı." },
  { icon: Smartphone, title: "Cihaz Yönetimi", description: "Android cihazları uzaktan izleyin. Ekran süresi, uygulama kullanımı, konum takibi." },
  { icon: BarChart3, title: "Gelişmiş Analitik", description: "Gerçek zamanlı grafikler, otomatik raporlar, PDF ve CSV dışa aktarım." },
  { icon: Lock, title: "Güvenli Altyapı", description: "End-to-end şifreleme, JWT tabanlı kimlik doğrulama, rol bazlı erişim kontrolü." },
  { icon: Users, title: "Çoklu Rol Desteği", description: "Super Admin, Guardian/Manager ve kullanıcı rolleri ile esnek yetki yönetimi." },
  { icon: Bell, title: "Akıllı Bildirimler", description: "Kullanım limiti, izin süresi ve abonelik bitiş uyarıları otomatik gönderilir." },
];

const plans = [
  { name: "Free", price: "₺0", period: "aylık", features: ["1 kullanıcı", "1 cihaz", "7 gün veri saklama", "Temel ekran süresi"], highlight: false },
  { name: "Premium", price: "₺149", period: "aylık", features: ["5 kullanıcı", "10 cihaz", "90 gün veri saklama", "Tüm özellikler", "SMS & Keylogger", "Öncelikli destek"], highlight: true },
  { name: "Enterprise", price: "₺499", period: "aylık", features: ["50 kullanıcı", "100 cihaz", "365 gün veri saklama", "API erişimi", "Özel raporlama", "7/24 destek"], highlight: false },
];

const stats = [
  { value: "1,200+", label: "Aktif Kullanıcı" },
  { value: "950+", label: "İzlenen Cihaz" },
  { value: "%99.9", label: "Uptime" },
  { value: "50M+", label: "İşlenen Veri" },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background dark">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <Eye className="h-4.5 w-4.5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">ClearHuma</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Özellikler</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Fiyatlandırma</a>
            <a href="#about" className="hover:text-foreground transition-colors">Hakkımızda</a>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>Giriş Yap</Button>
            <Button size="sm" onClick={() => navigate("/login")}>
              Ücretsiz Başla <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(187_80%_48%/0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(152_60%_45%/0.06),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-20 sm:pb-28 relative">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm border-primary/30 text-primary">
                <Zap className="h-3.5 w-3.5 mr-1.5" />
                KVKK Uyumlu • Açık Rıza Tabanlı
              </Badge>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6"
            >
              <span className="text-gradient">Şeffaf ve Etik</span><br />Dijital Aktivite Analizi
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Aileler ve kurumlar için geliştirilmiş, açık rıza temelli cihaz yönetim platformu.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-4 flex-wrap"
            >
              <Button size="lg" className="h-12 px-8 text-base" onClick={() => navigate("/login")}>
                Hemen Başla <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base" onClick={() => navigate("/login")}>
                Demo İncele
              </Button>
            </motion.div>
          </div>

          <StaggerContainer className="mt-16 sm:mt-20 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="text-center p-4 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm">
                  <p className="text-2xl sm:text-3xl font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 sm:py-24 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <Badge variant="outline" className="mb-4 text-xs">ÖZELLİKLER</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Güçlü Özellikler, Etik Yaklaşım</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">ClearHuma, kurumsal düzeyde güvenlik ve denetlenebilirlik sunarken kullanıcı haklarını ön planda tutar.</p>
          </AnimatedSection>
          <StaggerContainer className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <StaggerItem key={f.title}>
                <AnimatedCard>
                  <Card className="group hover:border-primary/30 transition-all duration-300 hover:glow-primary h-full">
                    <CardContent className="p-6">
                      <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                        <f.icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                    </CardContent>
                  </Card>
                </AnimatedCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 sm:py-24 border-t border-border/30 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <Badge variant="outline" className="mb-4 text-xs">NASIL ÇALIŞIR?</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">3 Adımda Başlayın</h2>
          </AnimatedSection>
          <StaggerContainer className="grid gap-8 grid-cols-1 md:grid-cols-3 max-w-4xl mx-auto">
            {[
              { step: "01", title: "Hesap Oluşturun", desc: "Ücretsiz kayıt olun ve yönetim panelinize erişin.", icon: Users },
              { step: "02", title: "APK'yı Kurun", desc: "İzlenecek cihaza özel APK'yı yükleyin ve açık rıza alın.", icon: Smartphone },
              { step: "03", title: "Analiz Edin", desc: "Gerçek zamanlı veriler ve detaylı raporlarla takip edin.", icon: BarChart3 },
            ].map((item) => (
              <StaggerItem key={item.step}>
                <div className="text-center">
                  <div className="inline-flex h-14 w-14 rounded-2xl bg-primary/10 items-center justify-center mb-4">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-xs font-mono text-primary mb-2">ADIM {item.step}</p>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 sm:py-24 border-t border-border/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <Badge variant="outline" className="mb-4 text-xs">FİYATLANDIRMA</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">İhtiyacınıza Uygun Plan</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Bireysel kullanımdan kurumsal ölçeğe kadar esnek planlar.</p>
          </AnimatedSection>
          <StaggerContainer className="grid gap-6 grid-cols-1 sm:grid-cols-3 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <StaggerItem key={plan.name}>
                <Card className={`relative ${plan.highlight ? "border-primary glow-primary sm:scale-105" : ""}`}>
                  {plan.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">En Popüler</Badge>
                    </div>
                  )}
                  <CardContent className="p-6 pt-8">
                    <h3 className="font-semibold text-xl mb-1">{plan.name}</h3>
                    <div className="mb-6">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-sm text-muted-foreground">/{plan.period}</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                          <span className="text-muted-foreground">{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full" variant={plan.highlight ? "default" : "outline"} onClick={() => navigate("/login")}>
                      {plan.name === "Free" ? "Ücretsiz Başla" : "Planı Seç"}
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-16 sm:py-24 border-t border-border/30 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="max-w-3xl mx-auto text-center">
            <Badge variant="outline" className="mb-4 text-xs">HAKKIMIZDA</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">Güvenilir, Şeffaf, Etik</h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              ClearHuma, dijital izleme dünyasında etik bir yaklaşım benimser. Tüm veriler yalnızca
              açık rıza ile toplanır, KVKK mevzuatına tam uyumlu çalışılır ve her işlem denetlenebilir
              şekilde kayıt altına alınır.
            </p>
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: FileText, title: "KVKK Uyumlu", desc: "Tam yasal uyumluluk" },
                { icon: Lock, title: "End-to-End Şifreleme", desc: "Verileriniz güvende" },
                { icon: CreditCard, title: "Esnek Abonelik", desc: "İstediğiniz zaman iptal" },
              ].map((item) => (
                <StaggerItem key={item.title}>
                  <div className="p-4 rounded-xl border border-border/50 bg-background/50">
                    <item.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <AnimatedSection>
        <section className="py-16 sm:py-20 border-t border-border/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Hemen Ücretsiz Deneyin</h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-8">Kredi kartı gerekmeden ücretsiz plan ile başlayın.</p>
            <Button size="lg" className="h-12 px-10 text-base" onClick={() => navigate("/login")}>
              Ücretsiz Hesap Oluştur <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </section>
      </AnimatedSection>

      {/* Footer */}
      <footer className="border-t border-border/30 py-12 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center">
                  <Eye className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
                <span className="font-bold">ClearHuma</span>
              </div>
              <p className="text-sm text-muted-foreground">Açık rıza temelli dijital aktivite analiz platformu.</p>
            </div>
            <div>
              <p className="font-medium text-sm mb-3">Platform</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Özellikler</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Fiyatlandırma</a></li>
                <li><a href="/login" className="hover:text-foreground transition-colors">Giriş Yap</a></li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-sm mb-3">Hukuki</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/privacy-policy" className="hover:text-foreground transition-colors">Gizlilik Politikası</a></li>
                <li><a href="/terms" className="hover:text-foreground transition-colors">Kullanıcı Sözleşmesi</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">KVKK Bilgilendirme</a></li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-sm mb-3">İletişim</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>info@clearhuma.com</li>
                <li>+90 212 XXX XXXX</li>
                <li>İstanbul, Türkiye</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/30 mt-10 pt-6 text-center text-sm text-muted-foreground">
            © 2025 ClearHuma. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>
    </div>
  );
}
