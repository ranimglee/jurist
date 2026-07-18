import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRef, useState } from "react";
import { 
  Download, 
  FileText, 
  Calendar, 
  User, 
  Scale, 
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  PenTool
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useLanguage } from "@/i18n";
import { CaseStatus } from "@/types";

interface CaseItem {
  caseNumber: string;
  title?: string;
  type: string;
  nomAccuse?: string;
  assignedLawyerName?: string;
  createdAt: string;
  courtDate?: string;
  status: string;
}

interface SignaturePadProps {
  onSign: (dataUrl: string) => void;
}

function SignaturePad({ onSign }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) onSign(canvas.toDataURL());
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onSign("");
  };

  return (
    <div className="space-y-2">
      <canvas
        ref={canvasRef}
        width={400}
        height={150}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="border-2 border-dashed border-gray-300 rounded-lg cursor-crosshair bg-white w-full"
        style={{ touchAction: 'none' }}
      />
      <Button variant="outline" size="sm" onClick={clearSignature} className="w-full">
        Effacer la signature
      </Button>
    </div>
  );
}

interface PdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseItem: CaseItem;
}

export default function PdfModal({ isOpen, onClose, caseItem }: PdfModalProps) {
  const pdfRef = useRef<HTMLDivElement>(null);
const { t, lang } = useLanguage();

  const handleDownload = async () => {
    if (!pdfRef.current) return;

    const element = pdfRef.current;

    const originalStyle = {
      height: element.style.height,
      overflow: element.style.overflow,
    };

    element.style.height = "auto";
    element.style.overflow = "visible";

    await new Promise((r) => setTimeout(r, 100));

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      scrollY: -window.scrollY,
    });

    element.style.height = originalStyle.height;
    element.style.overflow = originalStyle.overflow;

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Affaire_${caseItem.caseNumber}.pdf`);
  };
const normalizeStatus = (status: string) =>
  status?.trim().toUpperCase();


 const getStatusLabel = (status: string) => {
  return t(`status.${normalizeStatus(status)}`);
};

const getStatusIcon = (status: string) => {
  const map: Record<string, any> = {
    EN_ATTENTE: AlertCircle,
    EN_COURS: Clock,
    ACCEPTEE: CheckCircle,
    REFUSEE: XCircle,
    CLOTUREE: CheckCircle,
  };
  return map[normalizeStatus(status)] || AlertCircle;
};

const getStatusBadgeColor = (status: string) => {
  const map: Record<string, string> = {
    EN_ATTENTE: "bg-orange-100 text-orange-800",
    EN_COURS: "bg-blue-100 text-blue-800",
    ACCEPTEE: "bg-green-100 text-green-800",
    REFUSEE: "bg-red-100 text-red-800",
    CLOTUREE: "bg-gray-200 text-gray-800",
  };
  return map[normalizeStatus(status)] || "bg-gray-100 text-gray-800";
};
  const StatusIconComponent = getStatusIcon(caseItem.status);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] overflow-hidden flex flex-col p-0">
        
        {/* RTL SUPPORT */}
        <div dir={lang === "ar" ? "rtl" : "ltr"} className="flex flex-col h-full">

          {/* Header */}
          <DialogHeader className="px-6 pt-6 pb-4 bg-gradient-to-r from-slate-700 to-slate-900 text-white">
            <DialogTitle className="text-2xl font-bold text-white">
              {t("pdf.title")}
            </DialogTitle>
            <p className="text-sm text-slate-200 mt-1">
              {t("pdf.subtitle", { caseNumber: caseItem.caseNumber })}
            </p>
          </DialogHeader>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 bg-gray-50">
            <div ref={pdfRef} className="max-w-3xl mx-auto space-y-6">

              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold">
                        {caseItem.title}
                      </h2>
                      <p className="text-sm">REF: {caseItem.caseNumber}</p>
                    </div>

                    <Badge className={getStatusBadgeColor(caseItem.status)}>
                      <StatusIconComponent className="w-3 h-3 mr-1" />
                      {getStatusLabel(caseItem.status)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>
                      <p className="text-xs">{t("pdf.caseType")}</p>
                      <p>{caseItem.type}</p>
                    </div>

                    <div>
                      <p className="text-xs">{t("pdf.creationDate")}</p>
                      <p>
                        {new Date(caseItem.createdAt).toLocaleDateString(
  lang === "ar" ? "ar-TN" : "fr-FR"
)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs">{t("pdf.courtDate")}</p>
                      <p>
                        {caseItem.courtDate
                          ? new Date(caseItem.courtDate).toLocaleDateString(lang === "ar" ? "ar" : "fr-FR")
                          : t("pdf.notScheduled")}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs">{t("pdf.currentStatus")}</p>
                      <p>{getStatusLabel(caseItem.status)}</p>
                    </div>

                    <div>
                      <p className="text-xs">{t("pdf.accusedName")}</p>
                      <p>{caseItem.nomAccuse || t("pdf.notProvided")}</p>
                    </div>

                    <div>
                      <p className="text-xs">{t("pdf.lawyer")}</p>
                      <p>{caseItem.assignedLawyerName || t("pdf.noLawyer")}</p>
                    </div>

                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">
                    {t("pdf.description")}
                  </h3>
                  <p>{caseItem.title}</p>
                </CardContent>
              </Card>

              {/* Footer */}
              <Card>
                <CardContent className="p-4 text-center text-xs">
                  <p>{t("pdf.generatedText")}</p>
                  <p>
                    {t("pdf.generatedOn", {
                      date: new Date().toLocaleString(lang === "ar" ? "ar" : "fr-FR"),
                    })}
                  </p>
                </CardContent>
              </Card>

            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 border-t flex justify-between">
            <Button variant="outline" onClick={onClose}>
              {t("common.close")}
            </Button>

            <Button onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              {t("pdf.download")}
            </Button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}