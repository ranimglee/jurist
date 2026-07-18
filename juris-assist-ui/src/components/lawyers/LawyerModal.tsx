import { useState, useEffect } from "react";
import { Lawyer } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, MapPin, Home, Calendar, Scale, AlertCircle } from "lucide-react";
import { useLanguage } from "@/i18n";

interface LawyerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lawyer: Omit<Lawyer, "id">) => void;
  lawyer?: Lawyer;
}

export function LawyerModal({ isOpen, onClose, onSave, lawyer }: LawyerModalProps) {
  const [formData, setFormData] = useState({
    identifiant:"",
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    region: "",
    adresse: "",
    dateInscription: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const { t } = useLanguage();

  useEffect(() => {
    if (lawyer) {
      setFormData({
        identifiant: lawyer.identifiant,
        prenom: lawyer.prenom,
        nom: lawyer.nom,
        email: lawyer.email,
        telephone: lawyer.telephone,
        region: lawyer.region,
        adresse: lawyer.adresse,
        dateInscription: lawyer.dateInscription,
      });
    } else {
      // Set today's date as default for new lawyers
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        identifiant: "",
        prenom: "",
        nom: "",
        email: "",
        telephone: "",
        region: "",
        adresse: "",
        dateInscription: today,
      });
    }
    setErrors({});
    setTouched({});
  }, [lawyer, isOpen]);

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return t("lawyers.modal.error.email");
        }
        break;
      case "telephone":
        if (!/^[\d\s+()-]+$/.test(value) || value.length < 8) {
          return t("lawyers.modal.error.phone");
        }
        break;
      case "prenom":
      case "nom":
        if (value.length < 2) {
          return t("lawyers.modal.error.minChars");
        }
        break;
    }
    return "";
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    const error = validateField(field, formData[field as keyof typeof formData]);
    setErrors({ ...errors, [field]: error });
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors({ ...errors, [field]: error });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
      return;
    }

    onSave({
      ...formData,
      affairesAcceptees: lawyer?.affairesAcceptees || 0,
      affairesRefusees: lawyer?.affairesRefusees || 0,
      affairesEnCours: lawyer?.affairesEnCours || 0,
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3 pb-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
              <Scale className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                {lawyer
                  ? t("lawyers.modal.title.edit")
                  : t("lawyers.modal.title.create")}
              </DialogTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {lawyer
                  ? t("lawyers.modal.subtitle.edit")
                  : t("lawyers.modal.subtitle.create")}
              </p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Personal Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <User className="h-4 w-4 text-blue-600" />
              {t("lawyers.modal.section.personal")}
            </div>
            {/* Identifiant Section */}
<div className="space-y-2">
  <Label className="text-sm font-medium flex items-center gap-1.5">
    <User className="h-3.5 w-3.5 text-gray-400" />
    {t("lawyers.modal.identifiant")}{" "}
    <span className="text-red-500">*</span>
  </Label>
  <Input
    value={formData.identifiant}
    onChange={(e) => handleChange("identifiant", e.target.value)}
    onBlur={() => handleBlur("identifiant")}
    placeholder={t("lawyers.modal.identifiant.placeholder")}
    className={`h-11 transition-all ${
      errors.identifiant && touched.identifiant
        ? "border-red-500 focus:ring-red-500"
        : "focus:ring-blue-500"
    }`}
    required
  />
  {errors.identifiant && touched.identifiant && (
    <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
      <AlertCircle className="h-3 w-3" />
      {errors.identifiant}
    </div>
  )}
</div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-1.5">
                  {t("lawyers.modal.firstName")}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.prenom}
                  onChange={(e) => handleChange("prenom", e.target.value)}
                  onBlur={() => handleBlur("prenom")}
                  placeholder={t("lawyers.modal.firstName.placeholder")}
                  className={`h-11 transition-all ${
                    errors.prenom && touched.prenom
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-blue-500"
                  }`}
                  required
                />
                {errors.prenom && touched.prenom && (
                  <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
                    <AlertCircle className="h-3 w-3" />
                    {errors.prenom}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-1.5">
                  {t("lawyers.modal.lastName")}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.nom}
                  onChange={(e) => handleChange("nom", e.target.value)}
                  onBlur={() => handleBlur("nom")}
                  placeholder={t("lawyers.modal.lastName.placeholder")}
                  className={`h-11 transition-all ${
                    errors.nom && touched.nom
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-blue-500"
                  }`}
                  required
                />
                {errors.nom && touched.nom && (
                  <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
                    <AlertCircle className="h-3 w-3" />
                    {errors.nom}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <Mail className="h-4 w-4 text-blue-600" />
              {t("lawyers.modal.section.contact")}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-gray-400" />
                {t("lawyers.modal.email")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                placeholder={t("lawyers.modal.email.placeholder")}
                className={`h-11 transition-all ${
                  errors.email && touched.email
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-blue-500"
                }`}
                required
              />
              {errors.email && touched.email && (
                <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
                  <AlertCircle className="h-3 w-3" />
                  {errors.email}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-gray-400" />
                {t("lawyers.modal.phone")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.telephone}
                onChange={(e) => handleChange("telephone", e.target.value)}
                onBlur={() => handleBlur("telephone")}
                placeholder={t("lawyers.modal.phone.placeholder")}
                className={`h-11 transition-all ${
                  errors.telephone && touched.telephone
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-blue-500"
                }`}
                required
              />
              {errors.telephone && touched.telephone && (
                <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
                  <AlertCircle className="h-3 w-3" />
                  {errors.telephone}
                </div>
              )}
            </div>
          </div>

          {/* Location Information Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <MapPin className="h-4 w-4 text-blue-600" />
              {t("lawyers.modal.section.location")}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-gray-400" />
                {t("lawyers.modal.region")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.region}
                onChange={(e) => handleChange("region", e.target.value)}
                onBlur={() => handleBlur("region")}
                placeholder={t("lawyers.modal.region.placeholder")}
                className="h-11 focus:ring-blue-500 transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-1.5">
                <Home className="h-3.5 w-3.5 text-gray-400" />
                {t("lawyers.modal.address")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.adresse}
                onChange={(e) => handleChange("adresse", e.target.value)}
                onBlur={() => handleBlur("adresse")}
                placeholder={t("lawyers.modal.address.placeholder")}
                className="h-11 focus:ring-blue-500 transition-all"
                required
              />
            </div>
          </div>

          {/* Registration Date Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <Calendar className="h-4 w-4 text-blue-600" />
              {t("lawyers.modal.registrationDate")}
            </div>

            <div className="space-y-2">
             
              <Input
                type="date"
                value={formData.dateInscription}
                onChange={(e) => handleChange("dateInscription", e.target.value)}
                className="h-11 focus:ring-blue-500 transition-all"
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t("lawyers.modal.registrationDate.help")}
              </p>
            </div>
          </div>

          <DialogFooter className="pt-6 border-t border-gray-200 dark:border-gray-800 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="min-w-[100px] h-11 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {t("lawyers.modal.cancel")}
            </Button>
            <Button
              type="submit"
              className="gradient-accent h-11 px-8 font-semibold shadow-md hover:shadow-lg transition-all"
            >
              {t("lawyers.modal.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
