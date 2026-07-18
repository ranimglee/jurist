import { useState } from "react";
import { Case, CaseStatus } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Send, CheckCircle, XCircle, Clock, AlertCircle, ArrowUpDown, FileText, Search, LockIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DeleteModal } from "./DeleteModal";
import PdfModal from "./PdfModal";
import { useLanguage } from "@/i18n";
import { API_BASE_URL } from "@/lib/config";

interface CaseTableProps {
  cases: Case[];
  onEdit: (caseItem: Case) => void;
  onAssign: (caseId: number) => void;
  onDelete: (caseId: number) => void;
  getLawyerName: (lawyerId?: string) => string;

  isLoading?: boolean;
}

const statusConfig: Record<
  CaseStatus,
  {
    labelKey: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: React.ElementType;
  }
> = {
  en_attente: {
    labelKey: "cases.status.en_attente",
    variant: "outline",
    icon: Clock,
  },
  en_cours: {
    labelKey: "cases.status.en_cours",
    variant: "secondary",
    icon: AlertCircle,
  },
  acceptee: {
    labelKey: "cases.status.acceptee",
    variant: "default",
    icon: CheckCircle,
  },
  refusee: {
    labelKey: "cases.status.refusee",
    variant: "destructive",
    icon: XCircle,
  },
  cloturee: {
    labelKey: "cases.status.cloturee",
    variant: "secondary",
    icon: LockIcon,

  },
};

// Loading skeleton component
const TableSkeleton = () => (
  <TableBody>
    {[...Array(5)].map((_, i) => (
      <TableRow key={i}>
        {[...Array(8)].map((_, j) => (
          <TableCell key={j}>
            <div 
              className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded animate-pulse" 
              style={{ 
                animationDelay: `${j * 0.1}s`,
                animationDuration: '1.5s',
                animationIterationCount: 'infinite'
              }} 
            />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </TableBody>
);

// Empty state component
const EmptyState = ({
  hasFilters,
  onClearFilters,
}: {
  hasFilters: boolean;
  onClearFilters: () => void;
}) => {
  const { t } = useLanguage();

  return (
    <TableBody>
      <TableRow>
        <TableCell colSpan={8} className="h-96">
          <div className="flex flex-col items-center justify-center space-y-4 text-center py-12">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full" />
              <div className="relative bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-full">
                {hasFilters ? (
                  <Search className="h-16 w-16 text-primary/40" />
                ) : (
                  <FileText className="h-16 w-16 text-primary/40" />
                )}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-700">
                {hasFilters
                  ? t("cases.table.emptyFiltered.title")
                  : t("cases.table.empty.title")}
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                {hasFilters
                  ? t("cases.table.emptyFiltered.subtitle")
                  : t("cases.table.empty.subtitle")}
              </p>
            </div>
            {hasFilters && (
              <Button variant="outline" size="sm" onClick={onClearFilters}>
                {t("cases.table.resetFilters")}
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>
    </TableBody>
  );
};

export function CaseTable({
  cases,
  onEdit,
  onDelete,
  getLawyerName,
  isLoading = false,
}: CaseTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<CaseStatus | "all">("all");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [caseToDelete, setCaseToDelete] = useState<number | null>(null);
  const [sortField, setSortField] = useState<keyof Case | "courtDate" | "status" | "assignedLawyerName">("caseNumber");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [openPdf, setOpenPdf] = useState(false);
  const { t } = useLanguage();

  const handleDeleteClick = (caseId: number) => {
    setCaseToDelete(caseId);
    setDeleteModalOpen(true);
  };


// Download PDF function using backend API
const handleDownloadPdf = async (caseItem: Case) => {
  try {
    const baseUrl = API_BASE_URL;
    const response = await fetch(`${baseUrl}/api/affaires/export/${caseItem.id}/pdf`, {
      method: "GET",
      headers: { Accept: "application/pdf" },
    });

    if (!response.ok) throw new Error("Failed to download PDF");

    const blob = await response.blob();
    if (blob.type !== "application/pdf") throw new Error("Received file is not a PDF");

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    const disposition = response.headers.get("Content-Disposition");
    let filename = `affaire_${caseItem.caseNumber}.pdf`;
    if (disposition && disposition.includes("filename=")) {
      filename = disposition.split("filename=")[1].split(";")[0].replace(/"/g, "").trim();
    }

    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);
    alert("Erreur lors du téléchargement du PDF.");
  }
};

  const handleSort = (field: keyof Case | "courtDate" | "status" | "assignedLawyerName") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedStatus("all");
  };

  const filteredAndSortedCases = cases
    .filter((caseItem) => {
      if (selectedStatus !== "all" && caseItem.status !== selectedStatus) return false;

      const lawyerName =
        caseItem.assignedLawyerName || (caseItem.assignedLawyerId ? getLawyerName(caseItem.assignedLawyerId) : "");
      return (
        caseItem.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caseItem.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lawyerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      const multiplier = sortOrder === "asc" ? 1 : -1;

      if (sortField === "courtDate") {
        return multiplier * ((a.courtDate ? new Date(a.courtDate).getTime() : 0) - (b.courtDate ? new Date(b.courtDate).getTime() : 0));
      }

      if (sortField === "status") {
        return multiplier * a.status.localeCompare(b.status);
      }

      if (sortField === "assignedLawyerName") {
        const aName = a.assignedLawyerName || (a.assignedLawyerId ? getLawyerName(a.assignedLawyerId) : "");
        const bName = b.assignedLawyerName || (b.assignedLawyerId ? getLawyerName(b.assignedLawyerId) : "");
        return multiplier * aName.localeCompare(bName);
      }

      const aValue = (a[sortField] as string) || "";
      const bValue = (b[sortField] as string) || "";
      return multiplier * aValue.localeCompare(bValue);
    });

  const hasFilters = searchTerm !== "" || selectedStatus !== "all";
  const hasData = filteredAndSortedCases.length > 0;

  return (
    <div className="space-y-6">
      {/* Loading bar */}
      {isLoading && (
        <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary via-primary/60 to-primary"
            style={{
              width: '40%',
              animation: 'loading 1.5s ease-in-out infinite'
            }}
          />
        </div>
      )}

      {/* Filters section with enhanced styling */}
      <div className="flex gap-4 flex-wrap items-center bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={t("cases.table.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        
        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) =>
              setSelectedStatus(e.target.value as CaseStatus | "all")
            }
            className="appearance-none border border-gray-300 rounded-lg px-4 py-2 pr-10 bg-white text-sm font-medium shadow-sm hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
          >
            <option value="all">{t("cases.table.status.all")}</option>
            {Object.entries(statusConfig).map(([key, status]) => (
              <option key={key} value={key}>
                {t(status.labelKey)}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </div>

        {(hasFilters || isLoading) && (
          <div className="text-sm text-muted-foreground bg-white px-3 py-2 rounded-lg border border-gray-200">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="h-3 w-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    {t("cases.table.loading")}
                  </span>
                ) : (
                  <span className="font-medium">
                    {t("cases.table.results", {
                      count: filteredAndSortedCases.length,
                      suffix: filteredAndSortedCases.length !== 1 ? "s" : "",
                    })}
                  </span>
                )}
          </div>
        )}
      </div>

      {/* Enhanced table with better styling */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
              <TableHead className="font-bold">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleSort("caseNumber")} 
                  className="font-bold hover:bg-gray-100
 transition-colors"
                >
                  {t("cases.table.columns.number")}
                  <ArrowUpDown className={`ml-2 h-4 w-4 ${sortField === "caseNumber" ? "text-primary" : ""}`} />
                </Button>
              </TableHead>

              <TableHead className="font-bold">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleSort("title")} 
                  className="font-bold hover:bg-white/50 transition-colors"
                >
                  {t("cases.table.columns.title")}
                  <ArrowUpDown className={`ml-2 h-4 w-4 ${sortField === "title" ? "text-primary" : ""}`} />
                </Button>
              </TableHead>

              <TableHead className="font-bold">
                {t("cases.table.columns.type")}
              </TableHead>
              <TableHead className="font-bold">
                {t("cases.table.columns.sousType")}
              </TableHead>


              <TableHead className="font-bold">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleSort("courtDate")} 
                  className="font-bold hover:bg-white/50 transition-colors"
                >
                  {t("cases.table.columns.courtDate")}
                  <ArrowUpDown className={`ml-2 h-4 w-4 ${sortField === "courtDate" ? "text-primary" : ""}`} />
                </Button>
              </TableHead>

              <TableHead className="font-bold">
                {t("cases.table.columns.status")}
              </TableHead>

              <TableHead className="font-bold">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleSort("assignedLawyerName")} 
                  className="font-bold hover:bg-white/50 transition-colors"
                >
                  {t("cases.table.columns.lawyer")}
                  <ArrowUpDown className={`ml-2 h-4 w-4 ${sortField === "assignedLawyerName" ? "text-primary" : ""}`} />
                </Button>
              </TableHead>

              <TableHead className="text-right font-bold">
                {t("cases.table.columns.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>

          {isLoading ? (
            <TableSkeleton />
          ) : !hasData ? (
            <EmptyState hasFilters={hasFilters} onClearFilters={clearFilters} />
          ) : (
            <TableBody>
              {filteredAndSortedCases.map((caseItem) => {
               const status = statusConfig[caseItem.status as CaseStatus] ?? {
  labelKey: "cases.status.unknown",
  variant: "outline",
  icon: AlertCircle,
};

const StatusIcon = status.icon;

                return (
                  <TableRow 
                    key={caseItem.id} 
                    className="hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent transition-all duration-200 border-b border-gray-100"
                  >
                    <TableCell className="font-mono text-sm font-bold text-primary">
                      {caseItem.caseNumber}
                    </TableCell>
                    <TableCell className="font-medium max-w-xs">
                      <div className="space-y-1">
                        <p className="font-semibold text-gray-900">{caseItem.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{caseItem.nomAccuse}</p>
                      </div>
                    </TableCell>
                    <TableCell>
  <Badge
    variant="outline"
    className="font-medium bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700"
  >
    {t(`cases.modal.type.${caseItem.type}`)}
  </Badge>
</TableCell>
                    <TableCell>
                     {caseItem.sousType
  ? t(`cases.sousType.${caseItem.sousType}`)
  : "-"}
                    </TableCell>

                    <TableCell className="text-muted-foreground font-medium">
                      {caseItem.courtDate ? new Date(caseItem.courtDate).toLocaleDateString("fr-FR") : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={status.variant}
                        className="flex items-center gap-1.5 w-fit font-medium shadow-sm"
                      >
                        <StatusIcon className="h-3.5 w-3.5" />
                        {t(status.labelKey)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {caseItem.assignedLawyerName ? (
                        <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-xs font-bold">
                            {caseItem.assignedLawyerName.charAt(0).toUpperCase()}
                          </div>
                          {caseItem.assignedLawyerName}
                        </span>
                      ) : caseItem.assignedLawyerId ? (
                        <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-xs font-bold">
                            {getLawyerName(caseItem.assignedLawyerId).charAt(0).toUpperCase()}
                          </div>
                          {getLawyerName(caseItem.assignedLawyerId)}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground italic flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xs text-gray-400">?</span>
                          </div>
                          {t("cases.table.unassigned")}
                        </span>
                      )}
                    </TableCell>
                   
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => onEdit(caseItem)}
                          className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                       
                  
 {/* Render PDF button only if status is not "en_attente" */}
    {caseItem.status !== "en_attente" && (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => handleDownloadPdf(caseItem)}
        className="hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-all"
      >
        <FileText className="h-4 w-4" />
      </Button>
    )}



                    
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleDeleteClick(caseItem.id)}
                          className="hover:bg-red-600 shadow-md hover:shadow-lg transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          )}
        </Table>
      </div>

      {caseToDelete && (
        <DeleteModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setCaseToDelete(null);
          }}
          onConfirm={() => {
            onDelete(caseToDelete);
            setDeleteModalOpen(false);
            setCaseToDelete(null);
          }}
          caseNumber={cases.find((c) => c.id === caseToDelete)?.caseNumber}
        />
      )}
{selectedCase && (
  <PdfModal
    isOpen={openPdf}
    onClose={() => setOpenPdf(false)}
    caseItem={selectedCase}
  />
)}

   

    </div>
  );
}
