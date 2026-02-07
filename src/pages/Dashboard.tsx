import { AnimatedSection } from "@/components/AnimatedSection";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { WeeklyScreenChart, UserTrendChart, RevenueChart, AppUsageChart } from "@/components/dashboard/Charts";
import { ActivityFeed, TopApps, SystemHealth } from "@/components/dashboard/ActivityFeed";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <AnimatedSection>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Sistem genel bakış ve istatistikler</p>
        </div>
      </AnimatedSection>

      <StatsCards />

      {/* Charts Row */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <WeeklyScreenChart />
        <UserTrendChart />
      </div>

      {/* Revenue + Pie */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <AppUsageChart />
      </div>

      {/* Bottom Row */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <ActivityFeed />
        <TopApps />
        <SystemHealth />
      </div>
    </div>
  );
}
