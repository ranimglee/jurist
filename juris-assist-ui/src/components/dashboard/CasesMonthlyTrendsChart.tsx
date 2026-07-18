import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { CalendarDays } from "lucide-react";
import { useLanguage } from "@/i18n";
import { useEffect, useState } from "react";
import { DashboardService } from "@/lib/api/dashboardApi";

interface MonthlyCasesDatum {
  month: string;
  cases: number;
}

export function CasesMonthlyTrendsChart() {
  const { t, lang } = useLanguage();
  const isRTL = lang === "ar";

  const [data, setData] = useState<MonthlyCasesDatum[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await DashboardService.getCasesPerMonth();

        const formatted: MonthlyCasesDatum[] = Object.entries(res)
          .sort(([monthA], [monthB]) => monthA.localeCompare(monthB))
          .map(([month, count]) => ({
            month,
            cases: count as number,
          }));

        setData(formatted);
      } catch (error) {
        console.error("Failed to fetch monthly cases trends data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="bg-gradient-to-br from-card to-muted/20 rounded-xl shadow-card p-6 border-none hover:shadow-elegant transition-all duration-300"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-md">
          <CalendarDays className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-bold text-foreground">
          {t("charts.monthlyCasesTrends.title")}
        </h3>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />

          <XAxis
            dataKey="month"
            stroke="hsl(var(--foreground))"
            fontSize={12}
            tickLine={false}
            reversed={isRTL}
          />

          <YAxis
            stroke="hsl(var(--foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            orientation={isRTL ? "right" : "left"}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "12px",
              padding: "12px",
              textAlign: isRTL ? "right" : "left",
            }}
          />

          <Legend
            align={isRTL ? "right" : "center"}
            wrapperStyle={{ paddingTop: "20px" }}
          />

          <Area
            type="monotone"
            dataKey="cases"
            stroke="#f59e0b"
            strokeWidth={3}
            fill="url(#colorCases)"
            name={t("charts.monthlyCasesTrends.cases")}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

