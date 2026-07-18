import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast"; // Import toast
import { API_BASE_URL } from "@/lib/config";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [token, setToken] = useState("");
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast(); // Toast hook
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      toast({
        variant: "destructive",
        title: t("reset.error.title"),
        description: "Token missing!",
      });
      return;
    }
    setToken(tokenParam);
  }, [searchParams]);

  const handleSubmit = async () => {
    if (!password || !confirm) {
      toast({
        variant: "destructive",
        title: t("reset.error.title"),
        description: t("reset.error.empty"),
      });
      return;
    }

    if (password !== confirm) {
      toast({
        variant: "destructive",
        title: t("reset.error.title"),
        description: t("reset.error.mismatch"),
      });
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || t("reset.error.request"));
      }

      toast({
        title: t("reset.successTitle"),
        description: t("reset.success"),
      });

      navigate("/"); // Redirect to login page
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t("reset.error.title"),
        description: error.message || t("reset.error.unknown"),
      });
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-red-900/80"></div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-3xl font-bold text-red-700 mb-2">
              {t("reset.title")}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              {t("reset.subtitle")}
            </p>
          </div>

          <div className="space-y-5">
            <div className="group">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 ml-1">
                {t("reset.newPassword")}
              </label>
              <input
                type="password"
                placeholder={t("reset.newPasswordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
              />
            </div>

            <div className="group">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 ml-1">
                {t("reset.confirmPassword")}
              </label>
              <input
                type="password"
                placeholder={t("reset.confirmPasswordPlaceholder")}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full p-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
              />
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {t("reset.submit")}
            </Button>
          </div>

          <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
            <a href="/" className="text-red-700 font-semibold hover:text-red-800">
              {t("reset.backToLogin")}
            </a>
          </div>
        </div>

        <p className="text-center text-sm text-white/70 mt-6">
          {t("reset.footer")}
        </p>
      </div>
    </div>
  );
}
