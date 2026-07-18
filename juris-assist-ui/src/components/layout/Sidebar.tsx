import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Briefcase, Scale, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import onatLogo from "@/assets/logo-onan.png";
import { useLanguage } from "@/i18n";
import { API_BASE_URL } from "@/lib/config";

const navigation = [
  { key: "dashboard", href: "/dashboard", icon: LayoutDashboard },
  { key: "lawyers", href: "/lawyers", icon: Users },
  { key: "cases", href: "/cases", icon: Briefcase },
  { key: "aides", href: "/aides-judiciaires", icon: Scale },
];

type SidebarProps = {
  onNavigate?: () => void;
};

export function Sidebar({ onNavigate }: SidebarProps) {
  const { t, lang } = useLanguage();
  const isRTL = lang === "ar";

  const [user, setUser] = useState<{ email: string } | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/auth/me`, { credentials: "include" })
      .then(res => res.ok ? res.json() : null)
      .then(data => setUser(data))
      .catch(console.error);
  }, [API_BASE_URL]);

  const handleLogout = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Logout failed");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      alert(t("navbar.logout.failed"));
    }
  };

  return (
 <aside
  dir={isRTL ? "rtl" : "ltr"}
  className={cn(
    "flex flex-col h-screen w-full md:w-64 flex-shrink-0 bg-sidebar-background text-sidebar-foreground shadow-elegant",
    isRTL ? "md:border-l md:border-sidebar-border" : "md:border-r md:border-sidebar-border"
  )}
>
  {/* Logo */}
  <div className={cn("p-6 border-b border-sidebar-border flex-shrink-0", isRTL && "flex-row-reverse")}>
    <div className={cn("flex items-center gap-3", isRTL ? "flex-row-reverse" : "flex-row")}>
      <img src={onatLogo} alt="ONAT Logo" className="h-16 w-auto object-contain" />
      <div className={cn("min-w-0", isRTL ? "text-right" : "text-left")}>
        <h1 className="text-base font-bold font-serif leading-tight sm:text-lg">
          {t("sidebar.organizationName")}
        </h1>
        <p className="text-xs text-muted-foreground line-clamp-2">{t("sidebar.tagline")}</p>
      </div>
    </div>
  </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navigation.map(item => (
          <NavLink
            key={item.key}
            to={item.href}
            end={item.href === "/"}
            onClick={() => onNavigate?.()}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium truncate",
                isActive
                  ? "bg-primary text-primary-foreground shadow-elegant"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isRTL ? "flex-row-reverse text-right" : "flex-row text-left"
              )
            }
          >
            <item.icon className="w-5 h-5 shrink-0" />
            <span>{t(`sidebar.nav.${item.key}`)}</span>
          </NavLink>
        ))}
      </nav>

      {/* Profile + Logout */}
      <div className="p-4 border-t border-sidebar-border flex-shrink-0 space-y-3">
        <div className={cn("px-4 py-3 rounded-lg bg-sidebar-accent", isRTL ? "text-right" : "text-left")}>
          <p className="text-sm font-medium">{t("sidebar.admin")}</p>
          <p className="text-xs text-muted-foreground">{user ? user.email : t("sidebar.loading")}</p>
        </div>

        <button
          type="button"
          onClick={() => {
            onNavigate?.();
            void handleLogout();
          }}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500 hover:text-white transition",
            isRTL ? "flex-row-reverse" : "flex-row"
          )}
        >
          <LogOut className="w-5 h-5" />
          <span>{t("sidebar.logout")}</span>
        </button>
      </div>
    </aside>
  );
}
