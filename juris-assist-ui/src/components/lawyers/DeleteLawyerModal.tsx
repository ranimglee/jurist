import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n";

interface DeleteLawyerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  lawyerName?: string;
}

export function DeleteLawyerModal({ isOpen, onClose, onConfirm, lawyerName }: DeleteLawyerModalProps) {
  const { t, lang } = useLanguage();
  const isRTL = lang === "ar";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent dir={isRTL ? "rtl" : "ltr"} className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{t("deleteLawyerModal.title")}</DialogTitle>
        </DialogHeader>

        <p className="mb-6">
          {t("deleteLawyerModal.message", { name: lawyerName })}
        </p>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            {t("deleteLawyerModal.cancel")}
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {t("deleteLawyerModal.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
