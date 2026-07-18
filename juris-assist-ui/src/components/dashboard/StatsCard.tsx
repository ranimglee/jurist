import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/i18n";

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  gradient?: string;
}

export function StatsCard({ title, value, icon: Icon, trend, gradient }: StatsCardProps) {
   const { t } = useLanguage();

  return (
    <Card className="p-6 hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 border-none shadow-card bg-gradient-to-br from-card to-muted/20">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {trend && (
            <div className="flex items-center gap-1">
              <span className={`text-sm font-semibold ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
                {trend.isPositive ? "↑" : "↓"} {trend.value}%
              </span>
<span className="text-xs text-muted-foreground">
  {t('common.thisMonth')}
</span>
            </div>
          )}
        </div>
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-md ${gradient || "gradient-primary"}`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
    </Card>
  );
}
