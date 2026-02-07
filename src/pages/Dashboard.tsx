import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Smartphone, Clock, ShieldCheck, TrendingUp, TrendingDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const stats = [
  { title: "Toplam Kullanıcı", value: "1,284", change: "+12%", trend: "up", icon: Users },
  { title: "Aktif Cihaz", value: "946", change: "+8%", trend: "up", icon: Smartphone },
  { title: "Ort. Ekran Süresi", value: "4s 32dk", change: "-5%", trend: "down", icon: Clock },
  { title: "Aktif İzinler", value: "1,108", change: "+3%", trend: "up", icon: ShieldCheck },
];

const weeklyData = [
  { gun: "Pzt", sure: 4.2, kullanici: 820 },
  { gun: "Sal", sure: 5.1, kullanici: 890 },
  { gun: "Çar", sure: 3.8, kullanici: 860 },
  { gun: "Per", sure: 4.9, kullanici: 910 },
  { gun: "Cum", sure: 6.2, kullanici: 940 },
  { gun: "Cmt", sure: 7.1, kullanici: 870 },
  { gun: "Paz", sure: 5.5, kullanici: 830 },
];

const appUsageData = [
  { name: "Sosyal Medya", value: 35, color: "hsl(187, 80%, 48%)" },
  { name: "Mesajlaşma", value: 25, color: "hsl(152, 60%, 45%)" },
  { name: "Oyun", value: 20, color: "hsl(38, 92%, 50%)" },
  { name: "Eğitim", value: 12, color: "hsl(280, 60%, 55%)" },
  { name: "Diğer", value: 8, color: "hsl(0, 62%, 45%)" },
];

const recentActivity = [
  { user: "Ahmet Y.", action: "SMS izni verildi", time: "2 dk önce", type: "consent" },
  { user: "Elif K.", action: "Yeni cihaz eklendi", time: "15 dk önce", type: "device" },
  { user: "Mehmet A.", action: "Abonelik yenilendi", time: "1 saat önce", type: "subscription" },
  { user: "Zeynep T.", action: "Konum izni iptal", time: "2 saat önce", type: "consent" },
  { user: "Can B.", action: "Rapor indirildi", time: "3 saat önce", type: "report" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Sistem genel bakış ve istatistikler</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="glow-primary">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 text-success" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-destructive" />
                    )}
                    <span className={`text-xs ${stat.trend === "up" ? "text-success" : "text-destructive"}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Haftalık Ekran Süresi (saat)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 20%, 16%)" />
                <XAxis dataKey="gun" stroke="hsl(215, 15%, 55%)" fontSize={12} />
                <YAxis stroke="hsl(215, 15%, 55%)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(222, 25%, 9%)",
                    border: "1px solid hsl(222, 20%, 16%)",
                    borderRadius: "8px",
                    color: "hsl(210, 20%, 92%)",
                  }}
                />
                <Bar dataKey="sure" fill="hsl(187, 80%, 48%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Aktif Kullanıcı Trendi</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 20%, 16%)" />
                <XAxis dataKey="gun" stroke="hsl(215, 15%, 55%)" fontSize={12} />
                <YAxis stroke="hsl(215, 15%, 55%)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(222, 25%, 9%)",
                    border: "1px solid hsl(222, 20%, 16%)",
                    borderRadius: "8px",
                    color: "hsl(210, 20%, 92%)",
                  }}
                />
                <Line type="monotone" dataKey="kullanici" stroke="hsl(152, 60%, 45%)" strokeWidth={2} dot={{ fill: "hsl(152, 60%, 45%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Uygulama Kullanım Dağılımı</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={appUsageData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {appUsageData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(222, 25%, 9%)",
                    border: "1px solid hsl(222, 20%, 16%)",
                    borderRadius: "8px",
                    color: "hsl(210, 20%, 92%)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Son Aktiviteler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                      {item.user.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.user}</p>
                      <p className="text-xs text-muted-foreground">{item.action}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
