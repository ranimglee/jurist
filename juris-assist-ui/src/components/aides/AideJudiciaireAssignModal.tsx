import { useState, useEffect } from "react";
import { AideJudiciaire, EligibleAvocat } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AideJudiciaireService } from "@/services/aideJudiciaire.service";
import { useLanguage } from "@/i18n";
import { toast } from "sonner";
import { Scale, ShieldAlert, Check, Loader2, ArrowUpDown } from "lucide-react";

interface AideJudiciaireAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  aide: AideJudiciaire;
  onAssigned: () => void;
}

export function AideJudiciaireAssignModal({ isOpen, onClose, aide, onAssigned }: AideJudiciaireAssignModalProps) {
  const { t, lang } = useLanguage();
  const isRTL = lang === "ar";

  const [lawyers, setLawyers] = useState<EligibleAvocat[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAssigningId, setIsAssigningId] = useState<number | null>(null);

  useEffect(() => {
    const fetchEligibleLawyers = async () => {
      try {
        setIsLoading(true);
        const data = await AideJudiciaireService.getEligibleLawyers();
        setLawyers(data);
      } catch (error) {
        console.error(error);
        toast.error(t("aides.toast.loadError"));
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchEligibleLawyers();
    }
  }, [isOpen, t]);

  const handleAssign = async (lawyerId: number) => {
    try {
      setIsAssigningId(lawyerId);
      await AideJudiciaireService.reassign(aide.id, lawyerId);
      toast.success(t("aides.toast.assignSuccess"));
      onAssigned();
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || t("aides.toast.assignError"));
    } finally {
      setIsAssigningId(null);
    }
  };

  const getPriorityBadge = (score: number, total: number) => {
    // Score is the 1-based rank. Rank 1 is highest priority.
    if (total === 0) return { label: t("aides.assign.modal.priority.high"), color: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400" };

    const percentile = score / total;
    if (percentile <= 0.33) {
      return {
        label: `${t("aides.assign.modal.priority.high")} (#${score})`,
        color: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400",
      };
    } else if (percentile <= 0.66) {
      return {
        label: `${t("aides.assign.modal.priority.medium")} (#${score})`,
        color: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400",
      };
    } else {
      return {
        label: `${t("aides.assign.modal.priority.low")} (#${score})`,
        color: "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400",
      };
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[850px] max-h-[85vh] overflow-y-auto">
        <DialogHeader className="space-y-3 pb-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg">
              <Scale className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold">
                {aide.status === "ASSIGNED" ? t("aides.assign.modal.reassign") : t("aides.assign.modal.title")}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">{t("aides.assign.modal.subtitle")}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4 space-y-4" dir={isRTL ? "rtl" : "ltr"}>
          {/* Aide Judiciaire Summary */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <div>
              <span className="font-semibold text-slate-500">{t("aides.table.columns.number")}:</span>{" "}
              <span className="font-mono font-bold text-primary">{aide.numeroDossier}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-500">{t("aides.table.columns.applicant")}:</span>{" "}
              <span className="font-bold">{aide.nomDemandeur}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-500">{t("aides.table.columns.court")}:</span>{" "}
              <span>{t(`aides.cour.${aide.cour}`)}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-500">{t("aides.table.columns.circuit")}:</span>{" "}
              <span>{t(`aides.circuit.${aide.circuit}`)}</span>
            </div>
          </div>

          {/* Eligible Lawyers Table */}
          <div className="rounded-xl border border-gray-200 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-800">
                  <TableHead className="font-bold">{t("aides.assign.modal.columns.lawyer")}</TableHead>
                  <TableHead className="font-bold">{t("aides.assign.modal.columns.region")}</TableHead>
                  <TableHead className="font-bold">{t("aides.assign.modal.columns.count")}</TableHead>
                  <TableHead className="font-bold">{t("aides.assign.modal.columns.lastAssigned")}</TableHead>
                  <TableHead className="font-bold">{t("aides.assign.modal.columns.priority")}</TableHead>
                  <TableHead className="text-right font-bold">{t("aides.assign.modal.columns.action")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2 py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className="text-sm text-muted-foreground">{t("aides.assign.modal.loading")}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : lawyers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2 py-8">
                        <ShieldAlert className="h-10 w-10 text-amber-500" />
                        <span className="text-sm font-semibold text-gray-700">{t("aides.assign.modal.noEligible")}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  lawyers.map((lawyer) => {
                    const badge = getPriorityBadge(lawyer.priorityScore, lawyers.length);
                    const isCurrentAssigned = aide.avocatId === lawyer.id;

                    return (
                      <TableRow key={lawyer.id} className={`hover:bg-slate-50 transition-all border-b border-gray-100 ${isCurrentAssigned ? "bg-primary/5" : ""}`}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                              {lawyer.prenom.charAt(0).toUpperCase()}
                              {lawyer.nom.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{lawyer.prenom} {lawyer.nom}</div>
                              <div className="text-xs text-gray-500">#{lawyer.identifiant}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-700 text-sm">{lawyer.region}</TableCell>
                        <TableCell className="font-semibold text-sm">{lawyer.aideJudiciaireCount}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {lawyer.lastAssignedAt ? new Date(lawyer.lastAssignedAt).toLocaleDateString("fr-FR") : "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`font-semibold text-xs px-2.5 py-1 ${badge.color}`}>
                            {badge.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {isCurrentAssigned ? (
                            <Badge className="bg-emerald-500 text-white gap-1 py-1 px-2.5">
                              <Check className="w-3.5 h-3.5" /> Assigned
                            </Badge>
                          ) : (
                            <Button
                              size="sm"
                              className="gradient-accent h-8"
                              onClick={() => handleAssign(lawyer.id)}
                              disabled={isAssigningId !== null}
                            >
                              {isAssigningId === lawyer.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                t("aides.assign.modal.columns.action")
                              )}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <DialogFooter className="border-t border-gray-100 pt-4">
          <Button variant="outline" onClick={onClose} className="h-10">
            {t("lawyers.modal.cancel")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
