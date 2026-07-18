import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Home, Briefcase, Calendar, FileText } from "lucide-react";
import { Case, Lawyer } from "@/types";
import { getAffairesByAvocatId } from "@/services/affaireService";
import { useLanguage } from "@/i18n";

interface LawyerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lawyer: Lawyer | null;
}

export default function LawyerDetailsModal({ isOpen, onClose, lawyer }: LawyerDetailsModalProps) {
  const { t, lang } = useLanguage();
  const isRTL = lang === "ar";

  const [affaires, setAffaires] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (lawyer && isOpen) {
      setIsLoading(true);
      setError(null);
      getAffairesByAvocatId(Number(lawyer.id))
        .then(setAffaires)
        .catch((err) => setError(err.message))
        .finally(() => setIsLoading(false));
    }
  }, [lawyer, isOpen]);

  if (!lawyer) return null;

const getStatusColor = (status: string) => {
  const statusMap: Record<string, string> = {
    ACCEPTEE: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    REFUSEE: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    EN_COURS: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    CLOTUREE: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    EN_ATTENTE: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
  };

  return statusMap[status] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
};
const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    ACCEPTEE: t("status.acceptee"),
    REFUSEE: t("status.refusee"),
    EN_COURS: t("status.en_cours"),
    CLOTUREE: t("status.cloturee"),
    EN_ATTENTE: t("status.en_attente"),
  };

  return map[status] || status;
};
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        dir={isRTL ? "rtl" : "ltr"}
        className="sm:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col p-0"
      >
        <DialogHeader className="px-6 pt-6 pb-4 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground border-b border-primary/20">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold text-white border border-white/30">
              {lawyer.prenom[0]}{lawyer.nom[0]}
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-white">
                {lawyer.prenom} {lawyer.nom}
              </DialogTitle>
              <p className="text-white/80 text-sm mt-1">{t("lawyerDetails.lawyer")}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto px-6 py-4 space-y-6 flex-1">
          {/* Contact Information Cards */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-foreground">
              <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-primary" />
              </span>
              {t("lawyerDetails.contactInfo")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Card className="border border-gray-200 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">{t("lawyerDetails.email")}</p>
                    <p className="text-sm font-medium truncate text-foreground">{lawyer.email}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 dark:border-gray-800 hover:border-green-200 dark:hover:border-green-800 transition-colors">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-950 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">{t("lawyerDetails.phone")}</p>
                    <p className="text-sm font-medium text-foreground">{lawyer.telephone}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">{t("lawyerDetails.region")}</p>
                    <p className="text-sm font-medium text-foreground">{lawyer.region}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 dark:border-gray-800 hover:border-amber-200 dark:hover:border-amber-800 transition-colors">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-950 flex items-center justify-center flex-shrink-0">
                    <Home className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">{t("lawyerDetails.address")}</p>
                    <p className="text-sm font-medium text-foreground">{lawyer.adresse}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Cases Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-primary" />
                </span>
                {t("lawyerDetails.assignedCases")}
              </h3>
              {!isLoading && affaires.length > 0 && (
                <Badge className="text-xs bg-primary/10 text-primary border border-primary/20 hover:bg-primary/10">
                  {affaires.length} {affaires.length > 1 ? t("lawyerDetails.assignedCases") : t("lawyerDetails.assignedCases")}
                </Badge>
              )}
            </div>

            {isLoading ? (
              <Card className="border border-gray-200 dark:border-gray-800">
                <CardContent className="p-8">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-sm text-muted-foreground">{t("lawyerDetails.loadingCases")}</p>
                  </div>
                </CardContent>
              </Card>
            ) : error ? (
              <Card className="border border-destructive/30 bg-destructive/5">
                <CardContent className="p-8 text-center text-destructive">
                  {t("lawyerDetails.error")}: {error}
                </CardContent>
              </Card>
            ) : affaires.length === 0 ? (
              <Card className="border border-gray-200 dark:border-gray-800">
                <CardContent className="p-8">
                  <div className="text-center text-muted-foreground">
                    <Briefcase className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
                    <p>{t("lawyerDetails.noCases")}</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {affaires.map((a) => (
                  <Card key={a.id} className="border border-gray-200 dark:border-gray-800 hover:border-primary/30 hover:shadow-card transition-all">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-mono text-xs text-muted-foreground mb-1">{a.caseNumber}</p>
                              <h4 className="font-semibold text-base text-foreground">{a.title}</h4>
                            </div>
                            <Badge className={getStatusColor(a.status)} variant="secondary">
                            {getStatusLabel(a.status)}    
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4 text-primary/70" />
                              <span>
                                {t("lawyerDetails.createdOn")} {new Date(a.createdAt).toLocaleDateString(lang)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4 text-primary/70" />
                              <span className="font-medium text-foreground">
                                {t("lawyerDetails.courtDate")}: {new Date(a.courtDate).toLocaleDateString(lang)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-muted/30 border-border">
          <Button variant="default" onClick={onClose}>
            {t("lawyerDetails.close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
