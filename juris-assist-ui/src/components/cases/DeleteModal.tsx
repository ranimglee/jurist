import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  caseNumber?: string;
}

export function DeleteModal({ isOpen, onClose, onConfirm, caseNumber }: DeleteModalProps) {
  const { t, lang } = useLanguage();
  const isRTL = lang === "ar";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent dir={isRTL ? "rtl" : "ltr"} className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{t("deleteCaseModal.title")}</DialogTitle>
        </DialogHeader>

        <p className="mb-6">
          {t("deleteCaseModal.message", { caseNumber })}
        </p>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            {t("deleteCaseModal.cancel")}
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {t("deleteCaseModal.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
