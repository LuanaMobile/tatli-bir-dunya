import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import {
  Shield, Eye, Smartphone, BarChart3, Lock, Users,
  CheckCircle2, ArrowRight, Zap, FileText, CreditCard,
  Bell, ChevronRight, Globe, Cpu, Database, Activity,
} from "lucide-react";
import { AnimatedSection, AnimatedCard, StaggerContainer, StaggerItem } from "@/components/AnimatedSection";
import dashboardMockup from "@/assets/dashboard-mockup.png";
import heroBg from "@/assets/hero-bg.png";

// Animated counter hook
function useCounter(target: number, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(!startOnView);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startOnView) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [startOnView]);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return { count, ref };
}

// Floating particle component
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// Glowing orb component
function GlowOrb({ className }: { className?: string }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl opacity-20 ${className}`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.15, 0.25, 0.15],
      }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

const features = [
  { icon: Shield, title: "Açık Rıza Tabanlı", description: "Hiçbir veri izinsiz toplanmaz. KVKK uyumlu, tam şeffaf altyapı.", gradient: "from-primary/20 to-primary/5" },
  { icon: Smartphone, title: "Cihaz Yönetimi", description: "Android cihazları uzaktan izleyin. Ekran süresi, uygulama kullanımı, konum takibi.", gradient: "from-chart-2/20 to-chart-2/5" },
  { icon: BarChart3, title: "Gelişmiş Analitik", description: "Gerçek zamanlı grafikler, otomatik raporlar, PDF ve CSV dışa aktarım.", gradient: "from-info/20 to-info/5" },
  { icon: Lock, title: "Güvenli Altyapı", description: "End-to-end şifreleme, JWT tabanlı kimlik doğrulama, rol bazlı erişim kontrolü.", gradient: "from-chart-4/20 to-chart-4/5" },
  { icon: Users, title: "Çoklu Rol Desteği", description: "Super Admin, Guardian/Manager ve kullanıcı rolleri ile esnek yetki yönetimi.", gradient: "from-warning/20 to-warning/5" },
  { icon: Bell, title: "Akıllı Bildirimler", description: "Kullanım limiti, izin süresi ve abonelik bitiş uyarıları otomatik gönderilir.", gradient: "from-destructive/20 to-destructive/5" },
];

const plans = [
  { name: "Free", price: "₺0", period: "aylık", features: ["1 kullanıcı", "1 cihaz", "7 gün veri saklama", "Temel ekran süresi"], highlight: false },
  { name: "Premium", price: "₺149", period: "aylık", features: ["5 kullanıcı", "10 cihaz", "90 gün veri saklama", "Tüm özellikler", "SMS & Keylogger", "Öncelikli destek"], highlight: true },
  { name: "Enterprise", price: "₺499", period: "aylık", features: ["50 kullanıcı", "100 cihaz", "365 gün veri saklama", "API erişimi", "Özel raporlama", "7/24 destek"], highlight: false },
];

const stats = [
  { value: 1200, suffix: "+", label: "Aktif Kullanıcı", icon: Users },
  { value: 950, suffix: "+", label: "İzlenen Cihaz", icon: Smartphone },
  { value: 99.9, suffix: "%", label: "Uptime", icon: Activity },
  { value: 50, suffix: "M+", label: "İşlenen Veri", icon: Database },
];

const techStack = [
  { icon: Shield, label: "KVKK" },
  { icon: Lock, label: "E2E Encryption" },
  { icon: Globe, label: "Cloud Native" },
  { icon: Cpu, label: "Real-time" },
  { icon: Database, label: "PostgreSQL" },
  { icon: Activity, label: "Analytics" },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const mockupY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const mockupScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <div className="min-h-screen bg-background dark overflow-x-hidden">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 border-b border-border/30 bg-background/60 backdrop-blur-2xl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2.5"
            whileHover={{ scale: 1.02 }}
          >
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center glow-primary">
              <Eye className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">ClearHuma</span>
          </motion.div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            {["Özellikler", "Fiyatlandırma", "Hakkımızda"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace("ö", "o").replace("ı", "i")}`}
                className="hover:text-foreground transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
              Giriş Yap
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => navigate("/login?redirect=/apk-download")}>
              <Smartphone className="h-3.5 w-3.5" />
              Uygulamayı İndir
            </Button>
            <Button size="sm" className="group" onClick={() => navigate("/login")}>
              Ücretsiz Başla
              <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0">
          <motion.img
            src={heroBg}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-30"
            style={{ y: heroY }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        </div>
        <GlowOrb className="w-96 h-96 bg-primary -top-20 -left-20" />
        <GlowOrb className="w-72 h-72 bg-chart-2 -bottom-10 right-10" />
        <FloatingParticles />

        <motion.div style={{ opacity: heroOpacity }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left: Text */}
            <div>
              <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
                <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm border-primary/40 text-primary backdrop-blur-sm bg-primary/5">
                  <Zap className="h-3.5 w-3.5 mr-1.5 animate-pulse" />
                  KVKK Uyumlu • Açık Rıza Tabanlı
                </Badge>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6"
              >
                <span className="text-gradient">Şeffaf ve Etik</span>
                <br />
                Dijital Aktivite
                <br />
                <motion.span
                  className="inline-block"
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  style={{
                    background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--chart-2)), hsl(var(--primary)))",
                    backgroundSize: "200% auto",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Analiz Platformu
                </motion.span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4, duration: 0.6 }}
                className="text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed"
              >
                Aileler ve kurumlar için geliştirilmiş, açık rıza temelli cihaz yönetim ve dijital aktivite izleme platformu.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5, duration: 0.6 }}
                className="flex items-center gap-4 flex-wrap"
              >
                <Button size="lg" className="h-13 px-8 text-base group relative overflow-hidden" onClick={() => navigate("/login")}>
                  <span className="relative z-10 flex items-center gap-2">
                    Hemen Başla
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Button>
                <Button size="lg" variant="outline" className="h-13 px-8 text-base border-border/50 backdrop-blur-sm gap-2" onClick={() => navigate("/login?redirect=/apk-download")}>
                  <Smartphone className="h-4 w-4" />
                  Uygulamayı İndir
                </Button>
              </motion.div>

              {/* Tech badges */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                className="flex items-center gap-3 mt-10 flex-wrap"
              >
                {techStack.slice(0, 4).map((tech, i) => (
                  <motion.div
                    key={tech.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/40 bg-card/30 backdrop-blur-sm text-xs text-muted-foreground"
                  >
                    <tech.icon className="h-3 w-3 text-primary" />
                    {tech.label}
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Right: Dashboard Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 50, rotateY: -5 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
              style={{ y: mockupY, scale: mockupScale }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Glow behind mockup */}
                <div className="absolute -inset-4 bg-primary/10 rounded-2xl blur-2xl" />
                <div className="relative rounded-xl overflow-hidden border border-border/40 shadow-2xl shadow-primary/10">
                  <img
                    src={dashboardMockup}
                    alt="ClearHuma Dashboard"
                    className="w-full h-auto"
                  />
                  {/* Shine overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
                  />
                </div>
                {/* Floating notification card */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-6 -left-8 p-3 rounded-xl border border-border/50 bg-card/90 backdrop-blur-xl shadow-xl"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-success/20 flex items-center justify-center">
                      <Shield className="h-4 w-4 text-success" />
                    </div>
                    <div>
                      <p className="text-xs font-medium">KVKK Uyumlu</p>
                      <p className="text-[10px] text-muted-foreground">Tüm veriler şifreli</p>
                    </div>
                  </div>
                </motion.div>
                {/* Floating stats card */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -top-4 -right-6 p-3 rounded-xl border border-border/50 bg-card/90 backdrop-blur-xl shadow-xl"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Activity className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium">%99.9 Uptime</p>
                      <p className="text-[10px] text-success">● Sistem aktif</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section with animated counters */}
      <section className="relative py-16 border-t border-border/20">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-card/30" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map((stat) => {
              const { count, ref } = useCounter(stat.value, 2000);
              return (
                <StaggerItem key={stat.label}>
                  <div ref={ref} className="text-center p-6 rounded-2xl border border-border/30 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 group">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                      <stat.icon className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-3xl sm:text-4xl font-bold text-primary">
                      {stat.value === 99.9 ? count.toFixed(1) : count.toLocaleString()}{stat.suffix}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Features */}
      <section id="ozellikler" className="py-20 sm:py-28 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(187_80%_48%/0.04),transparent_70%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <AnimatedSection className="text-center mb-16">
            <Badge variant="outline" className="mb-4 text-xs border-primary/30">ÖZELLİKLER</Badge>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
              Güçlü Özellikler, <span className="text-gradient">Etik Yaklaşım</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              ClearHuma, kurumsal düzeyde güvenlik ve denetlenebilirlik sunarken kullanıcı haklarını ön planda tutar.
            </p>
          </AnimatedSection>
          <StaggerContainer className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <StaggerItem key={f.title}>
                <AnimatedCard>
                  <Card className="group hover:border-primary/30 transition-all duration-500 h-full relative overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    <CardContent className="p-7 relative z-10">
                      <motion.div
                        className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-all duration-300"
                        whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
                      >
                        <f.icon className="h-6 w-6 text-primary" />
                      </motion.div>
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

      {/* How it works - with connecting line */}
      <section className="py-20 sm:py-28 border-t border-border/20 bg-card/20 relative overflow-hidden">
        <GlowOrb className="w-64 h-64 bg-chart-2 top-1/2 left-1/4 -translate-y-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection className="text-center mb-20">
            <Badge variant="outline" className="mb-4 text-xs border-primary/30">NASIL ÇALIŞIR?</Badge>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
              <span className="text-gradient">3 Adımda</span> Başlayın
            </h2>
          </AnimatedSection>
          <StaggerContainer className="grid gap-8 grid-cols-1 md:grid-cols-3 max-w-5xl mx-auto relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            {[
              { step: "01", title: "Hesap Oluşturun", desc: "Ücretsiz kayıt olun ve profesyonel yönetim panelinize erişin.", icon: Users },
              { step: "02", title: "APK'yı Kurun", desc: "İzlenecek cihaza özel APK'yı yükleyin ve açık rıza alın.", icon: Smartphone },
              { step: "03", title: "Analiz Edin", desc: "Gerçek zamanlı veriler ve detaylı raporlarla takip edin.", icon: BarChart3 },
            ].map((item, i) => (
              <StaggerItem key={item.step}>
                <motion.div
                  className="text-center relative"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <motion.div
                    className="inline-flex h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 items-center justify-center mb-6 relative"
                    whileHover={{ rotate: 5 }}
                  >
                    <item.icon className="h-7 w-7 text-primary" />
                    <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                      {item.step}
                    </div>
                  </motion.div>
                  <h3 className="font-semibold text-xl mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Dashboard preview section */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(187_80%_48%/0.06),transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection className="text-center mb-16">
            <Badge variant="outline" className="mb-4 text-xs border-primary/30">PLATFORM</Badge>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
              Güçlü <span className="text-gradient">Yönetim Paneli</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Tüm cihazlarınızı, kullanıcılarınızı ve verileri tek bir panelden yönetin.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <div className="relative max-w-5xl mx-auto">
              <div className="absolute -inset-8 bg-primary/5 rounded-3xl blur-3xl" />
              <motion.div
                className="relative rounded-2xl overflow-hidden border border-border/30 shadow-2xl shadow-primary/5"
                whileHover={{ scale: 1.01, transition: { duration: 0.3 } }}
              >
                <img src={dashboardMockup} alt="ClearHuma Dashboard" className="w-full h-auto" loading="lazy" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/3 to-transparent"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 4, repeat: Infinity, repeatDelay: 6 }}
                />
              </motion.div>
            </div>
          </AnimatedSection>

          {/* Tech stack row */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-6 mt-12 flex-wrap"
          >
            {techStack.map((tech, i) => (
              <motion.div
                key={tech.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.1 }}
                whileHover={{ y: -2, scale: 1.05 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border/30 bg-card/50 backdrop-blur-sm text-sm text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all duration-300"
              >
                <tech.icon className="h-4 w-4 text-primary" />
                {tech.label}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="fiyatlandirma" className="py-20 sm:py-28 border-t border-border/20 relative">
        <GlowOrb className="w-80 h-80 bg-primary top-0 right-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection className="text-center mb-16">
            <Badge variant="outline" className="mb-4 text-xs border-primary/30">FİYATLANDIRMA</Badge>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
              İhtiyacınıza <span className="text-gradient">Uygun Plan</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">Bireysel kullanımdan kurumsal ölçeğe kadar esnek planlar.</p>
          </AnimatedSection>
          <StaggerContainer className="grid gap-6 grid-cols-1 sm:grid-cols-3 max-w-5xl mx-auto items-start">
            {plans.map((plan) => (
              <StaggerItem key={plan.name}>
                <motion.div whileHover={{ y: -8, transition: { duration: 0.2 } }}>
                  <Card className={`relative overflow-hidden ${plan.highlight ? "border-primary glow-primary sm:scale-105" : "border-border/30"}`}>
                    {plan.highlight && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                          <Badge className="bg-primary text-primary-foreground shadow-lg shadow-primary/30">En Popüler</Badge>
                        </div>
                      </>
                    )}
                    <CardContent className="p-7 pt-9 relative z-10">
                      <h3 className="font-semibold text-xl mb-1">{plan.name}</h3>
                      <div className="mb-6">
                        <span className="text-5xl font-bold">{plan.price}</span>
                        <span className="text-sm text-muted-foreground">/{plan.period}</span>
                      </div>
                      <ul className="space-y-3 mb-8">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-center gap-2.5 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                            <span className="text-muted-foreground">{f}</span>
                          </li>
                        ))}
                      </ul>
                      <Button className="w-full group" variant={plan.highlight ? "default" : "outline"} onClick={() => navigate("/login")}>
                        {plan.name === "Free" ? "Ücretsiz Başla" : "Planı Seç"}
                        <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* About */}
      <section id="hakkimizda" className="py-20 sm:py-28 border-t border-border/20 bg-card/20 relative overflow-hidden">
        <GlowOrb className="w-72 h-72 bg-chart-4 bottom-0 left-1/3" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection className="max-w-3xl mx-auto text-center">
            <Badge variant="outline" className="mb-4 text-xs border-primary/30">HAKKIMIZDA</Badge>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-6">
              Güvenilir, Şeffaf, <span className="text-gradient">Etik</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-12 text-lg">
              ClearHuma, dijital izleme dünyasında etik bir yaklaşım benimser. Tüm veriler yalnızca
              açık rıza ile toplanır, KVKK mevzuatına tam uyumlu çalışılır ve her işlem denetlenebilir
              şekilde kayıt altına alınır.
            </p>
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { icon: FileText, title: "KVKK Uyumlu", desc: "Tam yasal uyumluluk ve veri koruma" },
                { icon: Lock, title: "End-to-End Şifreleme", desc: "Verileriniz her zaman güvende" },
                { icon: CreditCard, title: "Esnek Abonelik", desc: "İstediğiniz zaman iptal edin" },
              ].map((item) => (
                <StaggerItem key={item.title}>
                  <motion.div
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="p-6 rounded-2xl border border-border/30 bg-background/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <p className="font-semibold text-base mb-1">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28 border-t border-border/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(187_80%_48%/0.08),transparent_60%)]" />
        <FloatingParticles />
        <AnimatedSection className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              className="max-w-2xl mx-auto p-12 rounded-3xl border border-border/30 bg-card/30 backdrop-blur-xl relative overflow-hidden"
              whileHover={{ borderColor: "hsl(var(--primary) / 0.3)" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-chart-2/5" />
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Hemen Ücretsiz Deneyin</h2>
                <p className="text-muted-foreground max-w-md mx-auto mb-8 text-lg">
                  Kredi kartı gerekmeden ücretsiz plan ile başlayın. Dakikalar içinde hazır.
                </p>
                <Button size="lg" className="h-14 px-10 text-base group" onClick={() => navigate("/login")}>
                  Ücretsiz Hesap Oluştur
                  <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </motion.div>
          </div>
        </AnimatedSection>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/20 py-14 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-10">
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center glow-primary">
                  <Eye className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg">ClearHuma</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">Açık rıza temelli dijital aktivite analiz platformu.</p>
            </div>
            <div>
              <p className="font-semibold text-sm mb-4">Platform</p>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li><a href="#ozellikler" className="hover:text-foreground transition-colors">Özellikler</a></li>
                <li><a href="#fiyatlandirma" className="hover:text-foreground transition-colors">Fiyatlandırma</a></li>
                <li><a href="/login" className="hover:text-foreground transition-colors">Giriş Yap</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-sm mb-4">Hukuki</p>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li><a href="/privacy-policy" className="hover:text-foreground transition-colors">Gizlilik Politikası</a></li>
                <li><a href="/terms" className="hover:text-foreground transition-colors">Kullanıcı Sözleşmesi</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">KVKK Bilgilendirme</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-sm mb-4">İletişim</p>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li>info@clearhuma.com</li>
                <li>+90 212 XXX XXXX</li>
                <li>İstanbul, Türkiye</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/20 mt-12 pt-8 text-center text-sm text-muted-foreground">
            © 2025 ClearHuma. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>
    </div>
  );
}
