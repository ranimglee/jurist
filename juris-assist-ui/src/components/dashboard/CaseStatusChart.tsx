import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { FileText } from "lucide-react";
import { useLanguage } from "@/i18n";
import { useEffect, useState } from "react";
import { DashboardService } from "@/lib/api/dashboardApi";

const COLORS = ["#ef4444", "#f59e0b", "#3b82f6", "#10b981", "#6b7280"];

export function CaseStatusChart() {
  const { t, lang } = useLanguage();
  const isRTL = lang === "ar";

  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await DashboardService.getCasesByStatus();

        const formatted = Object.entries(res).map(([status, count]) => ({
          name: t(`case.status.${status.toLowerCase()}`),
          value: count as number,
        }));

        setData(formatted);
      } catch (error) {
        console.error("Failed to fetch case status data:", error);
      }
    };

    fetchData();
  }, [lang, t]);

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="bg-gradient-to-br from-card to-muted/20 rounded-xl shadow-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-bold">
          {t("charts.caseStatus.title")}
        </h3>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={90}
            innerRadius={60}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={COLORS[index % COLORS.length]}
                stroke="hsl(var(--card))"
                strokeWidth={2}
              />
            ))}
          </Pie>

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}