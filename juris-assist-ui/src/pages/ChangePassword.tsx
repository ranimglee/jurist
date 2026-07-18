import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Layout } from "@/components/layout/Layout";
import { Lock, Eye, EyeOff, Shield, Check, X, AlertCircle } from "lucide-react";
import { useLanguage } from "@/i18n";
import { useToast } from "@/components/ui/use-toast";
import { API_BASE_URL } from "@/lib/config";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();

  const passwordValidations = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
  };

  const passwordStrength = Object.values(passwordValidations).filter(Boolean).length;

  const getStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength <= 3) return "bg-orange-500";
    if (passwordStrength <= 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (passwordStrength <= 2) return t("password.strength.weak");
    if (passwordStrength <= 3) return t("password.strength.medium");
    if (passwordStrength <= 4) return t("password.strength.good");
    return t("password.strength.excellent");
  };

const handleSubmit = async () => {
  if (!currentPassword || !newPassword || !confirmPassword) {
    toast({
      title: t("password.error.title"),
      description: t("password.error.empty"),
      variant: "destructive",
    });
    return;
  }

  if (newPassword !== confirmPassword) {
    toast({
      title: t("password.error.title"),
      description: t("password.error.mismatch"),
      variant: "destructive",
    });
    return;
  }

  setLoading(true);

  try {
    const res = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        oldPassword: currentPassword,
        newPassword: newPassword,
      }),
    });

    if (!res.ok) throw new Error(t("password.error.generic"));

    toast({
      title: t("password.success.title"),
      description: t("password.success"),
    });

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  } catch (error: any) {
    toast({
      title: t("password.error.title"),
      description: error.message || t("password.error.generic"),
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};




  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header Card */}
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-2xl p-8 mb-6 shadow-xl">
            <div className="flex items-center gap-4 text-white">
              <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
                <Shield className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  {t("password.header.title")}
                </h1>
                <p className="text-amber-100 mt-1">
                  {t("password.header.subtitle")}
                </p>
              </div>
            </div>
          </div>

          {/* Main Form Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            {/* Security Notice */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 m-6 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-blue-900 dark:text-blue-200 mb-1">
                    {t("password.notice.title")}
                  </p>
                  <p className="text-blue-700 dark:text-blue-300">
                    {t("password.notice.text")}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Current Password */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {t("password.current")}
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Lock className="w-5 h-5 text-slate-400" />
                  </div>
                  <Input
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder={t("password.current.placeholder")}
                    className="pl-11 pr-11 h-12 border-2 focus:border-amber-500 dark:bg-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {t("password.new")}
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Lock className="w-5 h-5 text-slate-400" />
                  </div>
                  <Input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={t("password.new.placeholder")}
                    className="pl-11 pr-11 h-12 border-2 focus:border-amber-500 dark:bg-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {newPassword && (
                  <div className="space-y-3 mt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400 font-medium">
                        {t("password.strength.label")}
                      </span>
                      <span
                        className={`font-bold ${
                          passwordStrength <= 2
                            ? "text-red-600"
                            : passwordStrength <= 3
                            ? "text-orange-600"
                            : passwordStrength <= 4
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {getStrengthText()}
                      </span>
                    </div>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                            level <= passwordStrength
                              ? getStrengthColor()
                              : "bg-slate-200 dark:bg-slate-700"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Validation Checklist */}
                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 space-y-2">
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">
                        {t("password.requirements.title")}
                      </p>
                      {[
                        { key: "length", label: t("password.requirements.length") },
                        { key: "uppercase", label: t("password.requirements.uppercase") },
                        { key: "lowercase", label: t("password.requirements.lowercase") },
                        { key: "number", label: t("password.requirements.number") },
                        { key: "special", label: t("password.requirements.special") },
                      ].map(({ key, label }) => (
                        <div key={key} className="flex items-center gap-2 text-sm">
                          {passwordValidations[key] ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <X className="w-4 h-4 text-slate-400" />
                          )}
                          <span
                            className={
                              passwordValidations[key]
                                ? "text-green-700 dark:text-green-400"
                                : "text-slate-600 dark:text-slate-400"
                            }
                          >
                            {label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {t("password.confirm")}
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Lock className="w-5 h-5 text-slate-400" />
                  </div>
                  <Input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t("password.confirm.placeholder")}
                    className="pl-11 pr-11 h-12 border-2 focus:border-amber-500 dark:bg-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5 mt-1">
                    <X className="w-4 h-4" />
                    {t("password.confirm.mismatch")}
                  </p>
                )}
                {confirmPassword && newPassword === confirmPassword && (
                  <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1.5 mt-1">
                    <Check className="w-4 h-4" />
                    {t("password.confirm.match")}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSubmit}
                  disabled={
                    loading ||
                    !currentPassword ||
                    !newPassword ||
                    !confirmPassword ||
                    newPassword !== confirmPassword ||
                    passwordStrength < 4
                  }
                  className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t("password.submit.loading")}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      {t("password.submit.label")}
                    </span>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  className="px-8 py-6 rounded-xl border-2 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  {t("password.cancel")}
                </Button>
              </div>
            </div>
          </div>

          {/* Additional Security Tips */}
          <div className="mt-6 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-600" />
              {t("password.tips.title")}
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>{t("password.tips.1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>{t("password.tips.2")}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>{t("password.tips.3")}</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>{t("password.tips.4")}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
