import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import { AnimatedSection } from "@/components/AnimatedSection";

const weeklyData = [
  { gun: "Pzt", sure: 4.2, kullanici: 820 },
  { gun: "Sal", sure: 5.1, kullanici: 890 },
  { gun: "Çar", sure: 3.8, kullanici: 860 },
  { gun: "Per", sure: 4.9, kullanici: 910 },
  { gun: "Cum", sure: 6.2, kullanici: 940 },
  { gun: "Cmt", sure: 7.1, kullanici: 870 },
  { gun: "Paz", sure: 5.5, kullanici: 830 },
];

const monthlyData = [
  { ay: "Oca", gelir: 12400, kullanici: 980 },
  { ay: "Şub", gelir: 14200, kullanici: 1050 },
  { ay: "Mar", gelir: 15800, kullanici: 1120 },
  { ay: "Nis", gelir: 17200, kullanici: 1180 },
  { ay: "May", gelir: 18900, kullanici: 1220 },
  { ay: "Haz", gelir: 21500, kullanici: 1284 },
];

const appUsageData = [
  { name: "Sosyal Medya", value: 35, color: "hsl(187, 75%, 38%)" },
  { name: "Mesajlaşma", value: 25, color: "hsl(152, 60%, 38%)" },
  { name: "Oyun", value: 20, color: "hsl(38, 92%, 50%)" },
  { name: "Eğitim", value: 12, color: "hsl(280, 60%, 55%)" },
  { name: "Diğer", value: 8, color: "hsl(0, 72%, 51%)" },
];

const tooltipStyle = {
  backgroundColor: "hsl(0, 0%, 100%)",
  border: "1px solid hsl(220, 15%, 88%)",
  borderRadius: "8px",
  color: "hsl(220, 25%, 12%)",
  boxShadow: "0 4px 12px hsl(220 15% 12% / 0.08)",
};

export function WeeklyScreenChart() {
  return (
    <AnimatedSection>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Haftalık Ekran Süresi (saat)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" />
              <XAxis dataKey="gun" stroke="hsl(220, 10%, 46%)" fontSize={12} />
              <YAxis stroke="hsl(220, 10%, 46%)" fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="sure" fill="hsl(187, 75%, 38%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </AnimatedSection>
  );
}

export function UserTrendChart() {
  return (
    <AnimatedSection delay={0.1}>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Aktif Kullanıcı Trendi</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" />
              <XAxis dataKey="gun" stroke="hsl(220, 10%, 46%)" fontSize={12} />
              <YAxis stroke="hsl(220, 10%, 46%)" fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="kullanici" stroke="hsl(152, 60%, 38%)" strokeWidth={2} dot={{ fill: "hsl(152, 60%, 38%)" }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </AnimatedSection>
  );
}

export function RevenueChart() {
  return (
    <AnimatedSection delay={0.15}>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Aylık Gelir Trendi (₺)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="gelirGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(187, 75%, 38%)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(187, 75%, 38%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" />
              <XAxis dataKey="ay" stroke="hsl(220, 10%, 46%)" fontSize={12} />
              <YAxis stroke="hsl(220, 10%, 46%)" fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="gelir" stroke="hsl(187, 75%, 38%)" fill="url(#gelirGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </AnimatedSection>
  );
}

export function AppUsageChart() {
  return (
    <AnimatedSection>
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
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </AnimatedSection>
  );
}
