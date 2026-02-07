import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Giriş başarılı", description: "Yönetim paneline yönlendiriliyorsunuz..." });
      navigate("/");
    }, 1000);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Kayıt başarılı", description: "Hesabınız oluşturuldu." });
      navigate("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(187_80%_48%/0.08),transparent_60%)]" />
      <div className="w-full max-w-md relative z-10">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary glow-primary">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">ClearHuma</h1>
            <p className="text-xs text-muted-foreground">Dijital Aktivite Analiz Platformu</p>
          </div>
        </div>

        <Card className="border-border/50 backdrop-blur-sm">
          <Tabs defaultValue="login">
            <CardHeader className="pb-2">
              <TabsList className="w-full">
                <TabsTrigger value="login" className="flex-1">Giriş Yap</TabsTrigger>
                <TabsTrigger value="register" className="flex-1">Kayıt Ol</TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent>
              <TabsContent value="login" className="mt-0">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input id="login-email" type="email" placeholder="admin@clearhuma.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Şifre</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="rounded border-border" />
                      Beni hatırla
                    </label>
                    <Button variant="link" className="text-xs p-0 h-auto text-primary">
                      Şifremi unuttum
                    </Button>
                  </div>
                  <Button className="w-full" disabled={loading}>
                    {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="mt-0">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid gap-4 grid-cols-2">
                    <div className="space-y-2">
                      <Label>Ad</Label>
                      <Input placeholder="Ad" required />
                    </div>
                    <div className="space-y-2">
                      <Label>Soyad</Label>
                      <Input placeholder="Soyad" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" placeholder="email@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Şifre</Label>
                    <Input type="password" placeholder="••••••••" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Şifre Tekrar</Label>
                    <Input type="password" placeholder="••••••••" required />
                  </div>
                  <Button className="w-full" disabled={loading}>
                    {loading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
                  </Button>
                </form>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Giriş yaparak{" "}
          <a href="/privacy-policy" className="text-primary hover:underline">Gizlilik Politikası</a> ve{" "}
          <a href="/terms" className="text-primary hover:underline">Kullanıcı Sözleşmesi</a>'ni kabul etmiş olursunuz.
        </p>
      </div>
    </div>
  );
}
