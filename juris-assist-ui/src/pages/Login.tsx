import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { Button } from "@/components/ui/button";
import {  Eye, EyeOff, Lock , User } from "lucide-react";
import onatLogo from "@/assets/onat-logo.png";
import { useLanguage } from "@/i18n";
import { useToast } from "@/components/ui/use-toast"; 
import { API_BASE_URL } from "@/lib/config";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { t } = useLanguage();
  const navigate = useNavigate(); 
  const { toast } = useToast(); 
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          credentials: "include",
        });
        if (res.ok) {
          navigate("/dashboard", { replace: true });
        }
      } catch (error) {
        // Not authenticated, stay on login page
      }
    };
    checkAuth();
  }, [API_BASE_URL, navigate]);

const handleLogin = async () => {
  if (!email || !password) {
    toast({ title: t("login.fillAll"), variant: "destructive" });
    return;
  }

  setLoading(true);

  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      const backendMessage = errorData?.message;
      throw new Error(backendMessage || t("login.invalid"));
    }

    toast({ title: t("login.success"), variant: "default" });
    navigate("/dashboard");
  } catch (error: any) {
    toast({ title: error?.message || t("login.error"), variant: "destructive" });
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-red-900/80"></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-8 md:p-10">
          {/* Logo */}
         <div className="flex justify-center mb-6">
  <div className="relative">
    
    {/* Logo */}
    <div className="relative p-4 rounded-xl shadow-lg">
      <img 
        src={onatLogo} 
        alt="Logo ONAT" 
        className="w-16 h-16 object-contain" // ajuste la taille selon ton besoin
      />
    </div>
  </div>
</div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-3xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-amber-900 dark:from-white dark:via-amber-100 dark:to-amber-300 bg-clip-text text-transparent mb-2">
              {t("login.title")}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              {t("login.subtitle")}
            </p>
          </div>

          {/* Form */}
          <div className="space-y-5">
            <div className="group">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 ml-1">
                {t("login.email")}
              </label>
              <div className="relative flex items-center border-2 border-slate-200 dark:border-slate-700 rounded-xl p-3.5 transition-all duration-200 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/10 group-hover:border-slate-300 dark:group-hover:border-slate-600 bg-white dark:bg-slate-800/50">
                <User className="w-5 h-5 text-slate-400 dark:text-slate-500 mr-3 flex-shrink-0" />
                <input
                  type="email"
                  placeholder={t("login.email.placeholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>
            </div>

<div className="group relative">
  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 ml-1">
    {t("login.password")}
  </label>
  <div className="relative flex items-center border-2 border-slate-200 dark:border-slate-700 rounded-xl p-3.5 transition-all duration-200 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/10 group-hover:border-slate-300 dark:group-hover:border-slate-600 bg-white dark:bg-slate-800/50">
    <Lock className="w-5 h-5 text-slate-400 dark:text-slate-500 mr-3 flex-shrink-0" />
    <input
      type={showPassword ? "text" : "password"}
      placeholder={t("login.password.placeholder")}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="w-full bg-transparent outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
    >
      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
    </button>
  </div>
</div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center cursor-pointer group">
                <input type="checkbox" className="mr-2 accent-blue-600" />
                <span className="text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                  {t("login.remember")}
                </span>
              </label>
              <a 
                href="/forgot-password" 
                className="text-red-700 dark:text-red-500 font-semibold hover:text-red-800 dark:hover:text-red-400 transition-colors"
              >
                {t("login.forgot")}
              </a>
            </div>

         <Button
  onClick={handleLogin}
  disabled={loading}
  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 flex items-center justify-center"
>
  {loading ? (
    <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
  ) : (
    t("login.submit")
  )}
</Button>

          </div>

         

          {/* Trust Badge */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-500">
            <Lock className="w-3.5 h-3.5" />
            <span>{t("login.ssl")}</span>
          </div>
        </div>

        {/* Bottom Text */}
        <p className="text-center text-sm text-white/70 mt-6">
          {t("login.footer")}
        </p>
      </div>
    </div>
  );
}
