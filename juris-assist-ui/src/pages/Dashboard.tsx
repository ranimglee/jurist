import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { CaseStatusChart } from "@/components/dashboard/CaseStatusChart";
import { CasesByTypeChart } from "@/components/dashboard/CasesByTypeChart";
import { CasesMonthlyTrendsChart } from "@/components/dashboard/CasesMonthlyTrendsChart";
import { DashboardService } from "@/lib/api/dashboardApi";
import { Users, Briefcase, CheckCircle, TrendingUp } from "lucide-react";
import { useLanguage } from "@/i18n";
import { YearlyTrendsChart } from "@/components/dashboard/MonthlyTrendsChart";

export default function Dashboard() {
  const { t } = useLanguage();

  const [totalLawyers, setTotalLawyers] = useState(0);
  const [totalCases, setTotalCases] = useState(0);
  const [assignedCases, setAssignedCases] = useState(0);
  const [completedCases, setCompletedCases] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [totalL, totalC, assignedUnassigned, casesByStatus] =
          await Promise.all([
            DashboardService.getTotalLawyers(),
            DashboardService.getTotalCases(),
            DashboardService.getAssignedVsUnassigned(),
            DashboardService.getCasesByStatus(),
          ]);

        setTotalLawyers(totalL);
        setTotalCases(totalC);
        setAssignedCases(assignedUnassigned.assigned);
      setCompletedCases(casesByStatus.CLOTUREE || 0);

      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <Layout>
      <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 md:p-8">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">
          {t("dashboard.title")}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title={t("dashboard.stats.lawyers")}
            value={totalLawyers}
            icon={Users}
            gradient="gradient-primary"
          />
          <StatsCard
            title={t("dashboard.stats.casesTotal")}
            value={totalCases}
            icon={Briefcase}
            gradient="gradient-accent"
          />
          <StatsCard
            title={t("dashboard.stats.casesAssigned")}
            value={assignedCases}
            icon={TrendingUp}
            gradient="bg-gradient-to-br from-blue-500 to-blue-600"
          />
      <StatsCard
  title={t("dashboard.stats.casesCompleted")} // <- rename translation
  value={completedCases}
  icon={CheckCircle}
  gradient="gradient-success"
/>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CaseStatusChart />
           <CasesByTypeChart />

        </div>


   <YearlyTrendsChart />
        <CasesMonthlyTrendsChart />
      </div>
    </Layout>
  );
}