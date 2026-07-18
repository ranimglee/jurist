import { Bell, User, LogOut, KeyRound, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/i18n";
import { useState, useEffect } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { API_BASE_URL } from "@/lib/config";

interface Notification {
  id: number;
  message: string;
  createdAt: string;
  seen: boolean;
}

type NavbarProps = {
  showMobileMenu?: boolean;
  onMobileMenuClick?: () => void;
};

export function Navbar({ showMobileMenu, onMobileMenuClick }: NavbarProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { lang, setLang, t } = useLanguage();
  const audio = new Audio("/notification.mp3");

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  // Mute state persisted in localStorage
  const [muted, setMuted] = useState(() => {
    const saved = localStorage.getItem("notificationsMuted");
    return saved === "true";
  });

  // Real-time notifications
  const newNotifications = useNotifications();

  // Watch for new notifications
  useEffect(() => {
    if (newNotifications.length > 0) {
      setNotifications((prev) => [...newNotifications, ...prev]);

      // Play sound only for new unseen notifications
      const unseenNew = newNotifications.filter((n) => !n.seen);
      if (unseenNew.length > 0 && !muted) {
        audio.play().catch((err) => console.error("Audio play failed:", err));
      }
    }
  }, [newNotifications, muted]);

  const unseenCount = notifications.filter((n) => !n.seen).length;

  const toggleLang = () => {
    setLang(lang === "fr" ? "ar" : "fr");
  };

  const toggleMute = () => {
    setMuted((prev) => {
      localStorage.setItem("notificationsMuted", (!prev).toString());
      return !prev;
    });
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/notifications`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch notifications");
      const data: Notification[] = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error(err);
      toast({ title: t("navbar.notificationsFailed") });
    } finally {
      setLoading(false);
    }
  };

  const markAsSeen = async (id: number) => {
    try {
      await fetch(`${API_BASE_URL}/api/notifications/${id}/mark-seen`, {
        method: "POST",
        credentials: "include",
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, seen: true } : n))
      );
    } catch (err) {
      console.error(err);
      toast({ title: t("navbar.markSeenFailed") });
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

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
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background px-3 py-2 sm:h-16 sm:px-6 sm:gap-4">
      <div className="flex min-w-0 flex-1 items-center">
        {showMobileMenu && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={onMobileMenuClick}
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
      </div>

      <div className="flex shrink-0 flex-wrap items-center justify-end gap-1 sm:gap-2 md:gap-4">
      {/* Notifications */}
     <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon" className="relative">
      <Bell className="h-5 w-5" />
      {unseenCount > 0 && (
        <span className="absolute top-0 right-0 min-w-[16px] h-4 px-1 text-xs font-bold text-white bg-primary rounded-full flex items-center justify-center">
          {unseenCount > 99 ? "99+" : unseenCount}
        </span>
      )}
    </Button>
  </DropdownMenuTrigger>

  <DropdownMenuContent
    align="end"
    className="max-h-96 w-[min(20rem,calc(100vw-2rem))] overflow-y-auto sm:w-80"
  >
    <DropdownMenuLabel className="flex justify-between items-center">
      {t("navbar.notifications")}
      <Button
        variant="outline"
        size="sm"
        className="ml-2 text-xs px-2 py-1"
        onClick={() => {
          setMuted((prev) => {
            localStorage.setItem("notificationsMuted", (!prev).toString());
            return !prev;
          });
        }}
        title={muted ? t("navbar.unmute") : t("navbar.mute")}
      >
        {muted ? "🔕" : "🔔"}
      </Button>
    </DropdownMenuLabel>

    <DropdownMenuSeparator />

    {loading && (
      <p className="px-4 py-2 text-sm text-gray-500">{t("navbar.loading")}</p>
    )}
    {!loading && notifications.length === 0 && (
      <p className="px-4 py-2 text-sm text-gray-500">{t("navbar.noNotifications")}</p>
    )}

    {!loading &&
      notifications.map((n) => (
        <DropdownMenuItem
          key={n.id}
          className={`flex flex-col gap-1 ${!n.seen ? "bg-blue-50" : ""}`}
          onClick={() => markAsSeen(n.id)}
        >
          <span className="text-sm">{n.message}</span>
          <span className="text-xs text-gray-400">
            {new Date(n.createdAt).toLocaleString()}
          </span>
        </DropdownMenuItem>
      ))}
  </DropdownMenuContent>
</DropdownMenu>
      {/* Profile Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-[min(14rem,calc(100vw-2rem))] sm:w-56"
        >
          <DropdownMenuLabel>{t("navbar.account")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/change-password")}>
            <KeyRound className="mr-2 h-4 w-4" />
            <span>{t("navbar.changePassword")}</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>{t("navbar.logout")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Language Switcher */}
      <Button
        variant="outline"
        size="sm"
        className="font-semibold max-sm:px-2"
        onClick={toggleLang}
        aria-label={lang === "fr" ? "العربية" : "Français"}
      >
        <span className="hidden sm:inline">
          {lang === "fr" ? "العربية" : "Français"}
        </span>
        <span className="sm:hidden text-xs font-bold">
          {lang === "fr" ? "ع" : "FR"}
        </span>
      </Button>
      </div>
    </header>
  );
}

