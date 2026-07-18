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
import { TrendingUp } from "lucide-react";
import { useLanguage } from "@/i18n";
import { useEffect, useState } from "react";
import { DashboardService } from "@/lib/api/dashboardApi";

type YearlyData = {
  year: string; // or number if you prefer
  lawyers: number;
};

export function YearlyTrendsChart() {
  const { t, lang } = useLanguage();
  const isRTL = lang === "ar";

  const [yearlyData, setYearlyData] = useState<YearlyData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Assuming you have a method in DashboardService: getLawyersPerYear
        const lawyersData = await DashboardService.getLawyersPerYear();

        // Convert object { "2021": 12, "2022": 18 } → array and sort by year
        const combinedData: YearlyData[] = Object.entries(lawyersData)
          .sort(([yearA], [yearB]) => Number(yearA) - Number(yearB))
          .map(([year, count]) => ({
            year,
            lawyers: count,
          }));

        setYearlyData(combinedData);
      } catch (error) {
        console.error("Failed to fetch yearly lawyers trends:", error);
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
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-bold text-foreground">
          {t("charts.yearlyTrends.title")}
        </h3>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={yearlyData}>
          <defs>
            <linearGradient id="colorLawyers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />

          <XAxis
            dataKey="year"
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
            dataKey="lawyers"
            stroke="#2563eb"
            strokeWidth={3}
            fill="url(#colorLawyers)"
            name={t("charts.yearlyTrends.lawyers")}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}