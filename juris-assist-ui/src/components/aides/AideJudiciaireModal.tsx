import { useState, useEffect } from "react";
import { AideJudiciaire, CourType, CircuitType, EligibleAvocat } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Scale, User, Calendar, Hash, AlertCircle, Loader2, Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { AideJudiciaireService } from "@/services/aideJudiciaire.service";
import { useLanguage } from "@/i18n";
import { cn } from "@/lib/utils";

interface AideJudiciaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    numeroDossier: string;
    nomDemandeur: string;
    cour: CourType;
    circuit: CircuitType;
    dateDecision: string;
    dateAudience: string;
    avocatId?: number | null;
  }) => Promise<void>;
  aideData?: AideJudiciaire;
}

const COURTS: CourType[] = [
  "TRIBUNAL_PREMIERE_INSTANCE_GROMBALIA",
  "TRIBUNAL_PREMIERE_INSTANCE_NABEUL",
  "COUR_APPEL_NABEUL",
  "TRIBUNAL_NAHAIYA_GROMBALIA",
];

const CIRCUITS: CircuitType[] = ["PENAL", "CIVIL", "FAMILLE", "URGENT"];

export function AideJudiciaireModal({ isOpen, onClose, onSave, aideData }: AideJudiciaireModalProps) {
  const { t, lang } = useLanguage();
  const isRTL = lang === "ar";
  const isEdit = !!aideData;

  const [formData, setFormData] = useState({
    numeroDossier: "",
    nomDemandeur: "",
    cour: "" as CourType,
    circuit: "" as CircuitType,
    dateDecision: "",
    dateAudience: "",
  });

  const [eligibleLawyers, setEligibleLawyers] = useState<EligibleAvocat[]>([]);
  const [selectedLawyerId, setSelectedLawyerId] = useState<number | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEligibleLawyers = async () => {
      try {
        const lawyers = await AideJudiciaireService.getEligibleLawyers();
        setEligibleLawyers(lawyers);
      } catch (err) {
        console.error("Error fetching eligible lawyers:", err);
      }
    };

    if (isOpen && !isEdit) {
      void fetchEligibleLawyers();
    }
  }, [isOpen, isEdit]);

  useEffect(() => {
    if (aideData && isOpen) {
      setFormData({
        numeroDossier: aideData.numeroDossier || "",
        nomDemandeur: aideData.nomDemandeur || "",
        cour: aideData.cour || "" as CourType,
        circuit: aideData.circuit || "" as CircuitType,
        dateDecision: aideData.dateDecision ? aideData.dateDecision.split("T")[0] : "",
        dateAudience: aideData.dateAudience ? aideData.dateAudience.split("T")[0] : "",
      });
      setSelectedLawyerId(aideData.avocatId || null);
      setErrors({});
      setTouched({});
    } else if (isOpen) {
      setFormData({
        numeroDossier: "",
        nomDemandeur: "",
        cour: "" as CourType,
        circuit: "" as CircuitType,
        dateDecision: "",
        dateAudience: "",
      });
      setSelectedLawyerId(null);
      setErrors({});
      setTouched({});
    }
  }, [aideData, isOpen]);

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "numeroDossier":
        if (!value) return t("aides.modal.error.numberRequired");
        break;
      case "nomDemandeur":
        if (!value) return t("aides.modal.error.applicantRequired");
        break;
      case "cour":
        if (!value) return t("aides.modal.error.courtRequired");
        break;
      case "circuit":
        if (!value) return t("aides.modal.error.circuitRequired");
        break;
      case "dateDecision":
        if (!value) return t("aides.modal.error.decisionDateRequired");
        break;
      case "dateAudience":
        if (!value) return t("aides.modal.error.courtDateRequired");
        break;
    }
    return "";
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, String(formData[field as keyof typeof formData] || ""));
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const isFormValid = () => {
    return (
      formData.numeroDossier &&
      formData.nomDemandeur &&
      formData.cour &&
      formData.circuit &&
      formData.dateDecision &&
      formData.dateAudience
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach((key) => {
      const val = String(formData[key as keyof typeof formData] || "");
      const error = validateField(key, val);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched(
        Object.keys(formData).reduce(
          (acc, key) => ({ ...acc, [key]: true }),
          {}
        )
      );
      return;
    }

    try {
      setIsLoading(true);
      await onSave({
        numeroDossier: formData.numeroDossier,
        nomDemandeur: formData.nomDemandeur,
        cour: formData.cour,
        circuit: formData.circuit,
        dateDecision: formData.dateDecision + "T00:00:00",
        dateAudience: formData.dateAudience + "T00:00:00",
        avocatId: selectedLawyerId,
      });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedLawyerText = () => {
    if (!selectedLawyerId) return t("aides.table.unassigned");
    const lawyer = eligibleLawyers.find((l) => l.id === selectedLawyerId);
    return lawyer ? `${lawyer.prenom} ${lawyer.nom}` : t("aides.modal.selectLawyerPlaceholder");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3 pb-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
              <Scale className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold">
                {isEdit ? t("aides.modal.title.edit") : t("aides.modal.title.create")}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-4 py-4 space-y-6 bg-white dark:bg-gray-900" dir={isRTL ? "rtl" : "ltr"}>
          {/* Numero de dossier */}
          <div className="space-y-2">
            <Label htmlFor="numeroDossier" className="flex items-center gap-2 text-sm font-semibold">
              <Hash className="w-4 h-4" /> {t("aides.modal.number")} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="numeroDossier"
              value={formData.numeroDossier}
              onChange={(e) => handleChange("numeroDossier", e.target.value)}
              onBlur={() => handleBlur("numeroDossier")}
              placeholder={t("aides.modal.number.placeholder")}
              className={`h-11 transition-all ${
                errors.numeroDossier && touched.numeroDossier ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
              }`}
            />
            {errors.numeroDossier && touched.numeroDossier && (
              <div className="flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="h-3 w-3" /> {errors.numeroDossier}
              </div>
            )}
          </div>

          {/* Nom du demandeur */}
          <div className="space-y-2">
            <Label htmlFor="nomDemandeur" className="flex items-center gap-2 text-sm font-semibold">
              <User className="w-4 h-4" /> {t("aides.modal.applicant")} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nomDemandeur"
              value={formData.nomDemandeur}
              onChange={(e) => handleChange("nomDemandeur", e.target.value)}
              onBlur={() => handleBlur("nomDemandeur")}
              placeholder={t("aides.modal.applicant.placeholder")}
              className={`h-11 transition-all ${
                errors.nomDemandeur && touched.nomDemandeur ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
              }`}
            />
            {errors.nomDemandeur && touched.nomDemandeur && (
              <div className="flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="h-3 w-3" /> {errors.nomDemandeur}
              </div>
            )}
          </div>

          {/* Court/Tribunal */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-semibold">
              <Scale className="w-4 h-4" /> {t("aides.modal.court")} <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.cour}
              onValueChange={(val) => handleChange("cour", val)}
            >
              <SelectTrigger className={`h-11 transition-all ${isRTL ? "text-right" : "text-left"}`}>
                <SelectValue placeholder={t("aides.modal.court.placeholder")} />
              </SelectTrigger>
              <SelectContent dir={isRTL ? "rtl" : "ltr"}>
                {COURTS.map((court) => (
                  <SelectItem key={court} value={court} className={isRTL ? "text-right" : "text-left"}>
                    {t(`aides.cour.${court}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.cour && touched.cour && (
              <div className="flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="h-3 w-3" /> {errors.cour}
              </div>
            )}
          </div>

          {/* Circuit */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-semibold">
              <Scale className="w-4 h-4" /> {t("aides.modal.circuit")} <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.circuit}
              onValueChange={(val) => handleChange("circuit", val)}
            >
              <SelectTrigger className={`h-11 transition-all ${isRTL ? "text-right" : "text-left"}`}>
                <SelectValue placeholder={t("aides.modal.circuit.placeholder")} />
              </SelectTrigger>
              <SelectContent dir={isRTL ? "rtl" : "ltr"}>
                {CIRCUITS.map((circuit) => (
                  <SelectItem key={circuit} value={circuit} className={isRTL ? "text-right" : "text-left"}>
                    {t(`aides.circuit.${circuit}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.circuit && touched.circuit && (
              <div className="flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="h-3 w-3" /> {errors.circuit}
              </div>
            )}
          </div>

          {/* Dates row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date Decision */}
            <div className="space-y-2">
              <Label htmlFor="dateDecision" className="flex items-center gap-2 text-sm font-semibold">
                <Calendar className="w-4 h-4" /> {t("aides.modal.decisionDate")} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="dateDecision"
                type="date"
                value={formData.dateDecision}
                onChange={(e) => handleChange("dateDecision", e.target.value)}
                onBlur={() => handleBlur("dateDecision")}
                className={`h-11 transition-all ${
                  errors.dateDecision && touched.dateDecision ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
                }`}
              />
              {errors.dateDecision && touched.dateDecision && (
                <div className="flex items-center gap-1 text-xs text-red-600">
                  <AlertCircle className="h-3 w-3" /> {errors.dateDecision}
                </div>
              )}
            </div>

            {/* Date Audience */}
            <div className="space-y-2">
              <Label htmlFor="dateAudience" className="flex items-center gap-2 text-sm font-semibold">
                <Calendar className="w-4 h-4" /> {t("aides.modal.courtDate")} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="dateAudience"
                type="date"
                value={formData.dateAudience}
                onChange={(e) => handleChange("dateAudience", e.target.value)}
                onBlur={() => handleBlur("dateAudience")}
                className={`h-11 transition-all ${
                  errors.dateAudience && touched.dateAudience ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
                }`}
              />
              {errors.dateAudience && touched.dateAudience && (
                <div className="flex items-center gap-1 text-xs text-red-600">
                  <AlertCircle className="h-3 w-3" /> {errors.dateAudience}
                </div>
              )}
            </div>
          </div>

          {/* Lawyer Selection (Optional) - Only display during creation */}
          {!isEdit && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-semibold">
                <User className="w-4 h-4" /> {t("aides.modal.assignLawyerOptional")}
              </Label>
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={popoverOpen}
                    className="w-full justify-between h-11 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <span>{selectedLawyerText()}</span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-[600px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder={t("lawyers.table.searchPlaceholder")} />
                    <CommandEmpty>{t("cases.modal.noLawyerFound")}</CommandEmpty>
                    <CommandGroup className="max-h-80 overflow-y-auto">
                      {/* Option for Unassigned */}
                      <CommandItem
                        value="none"
                        onSelect={() => {
                          setSelectedLawyerId(null);
                          setPopoverOpen(false);
                        }}
                        className="flex items-center justify-between py-2.5 px-4 cursor-pointer text-muted-foreground border-b border-gray-100"
                      >
                        <div className="flex items-center gap-3">
                          <Check className={cn("h-4 w-4 text-primary shrink-0", selectedLawyerId === null ? "opacity-100" : "opacity-0")} />
                          <span className="font-medium">{t("aides.table.unassigned")}</span>
                        </div>
                      </CommandItem>

                      {/* Lawyer List */}
                      {eligibleLawyers.map((lawyer) => (
                        <CommandItem
                          key={lawyer.id}
                          value={`${lawyer.prenom} ${lawyer.nom} ${lawyer.identifiant}`}
                          onSelect={() => {
                            setSelectedLawyerId(lawyer.id);
                            setPopoverOpen(false);
                          }}
                          className="flex items-center justify-between py-3 px-4 cursor-pointer border-b border-gray-100 hover:bg-slate-50"
                        >
                          <div className="flex items-center gap-3">
                            <Check className={cn("h-4 w-4 text-primary shrink-0", selectedLawyerId === lawyer.id ? "opacity-100" : "opacity-0")} />
                            <div>
                              <div className="font-semibold text-gray-900">{lawyer.prenom} {lawyer.nom}</div>
                              <div className="text-xs text-gray-500">#{lawyer.identifiant} · {lawyer.region}</div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                              Rank #{lawyer.priorityScore}
                            </span>
                            <span className="text-[10px] text-gray-500">
                              Cases: {lawyer.aideJudiciaireCount} · Last: {lawyer.lastAssignedAt ? new Date(lawyer.lastAssignedAt).toLocaleDateString("fr-FR") : "-"}
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          )}

          <DialogFooter className="gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="h-11 px-6" disabled={isLoading}>
              {t("aides.modal.cancel")}
            </Button>
            <Button type="submit" className="gradient-accent h-11 px-8 font-semibold" disabled={isLoading || !isFormValid()}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading
                ? t("cases.modal.saving")
                : isEdit
                ? t("aides.modal.save")
                : t("aides.modal.createAndAssign")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
