import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";
import { useLanguage } from "@/i18n";
import { useEffect, useState } from "react";
import { DashboardService } from "@/lib/api/dashboardApi";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

interface CaseTypeDatum {
  name: string;
  value: number;
}

export function CasesByTypeChart() {
  const { t, lang } = useLanguage();
  const isRTL = lang === "ar";

  const [data, setData] = useState<CaseTypeDatum[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await DashboardService.getCasesByType();

        const formatted: CaseTypeDatum[] = Object.entries(res).map(([type, count]) => ({
          name: t(`cases.types.${type}`), 
          value: count as number,
        }));

        setData(formatted);
      } catch (error) {
        console.error("Failed to fetch cases by type data:", error);
      }
    };

    fetchData();
  }, [t]); 

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="bg-gradient-to-br from-card to-muted/20 rounded-xl shadow-card p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
          <PieChartIcon className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-bold">
          {t("charts.casesByType.title")}
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
                key={index}
                fill={COLORS[index % COLORS.length]}
                stroke="#ffffff"
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