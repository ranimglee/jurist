import { useState } from "react";
import { AideJudiciaire } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, UserPlus, ArrowUpDown, FileText, Search, Scale, Calendar, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useLanguage } from "@/i18n";

interface AideJudiciaireTableProps {
  aides: AideJudiciaire[];
  onEdit: (aide: AideJudiciaire) => void;
  onAssign: (aide: AideJudiciaire) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

// Skeleton for loading state
const TableSkeleton = () => (
  <TableBody>
    {[...Array(5)].map((_, i) => (
      <TableRow key={i}>
        {[...Array(9)].map((_, j) => (
          <TableCell key={j}>
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </TableBody>
);

// Empty state component
const EmptyState = ({ hasFilters, onClearFilters }: { hasFilters: boolean; onClearFilters: () => void }) => {
  const { t } = useLanguage();

  return (
    <TableBody>
      <TableRow>
        <TableCell colSpan={9} className="h-96">
          <div className="flex flex-col items-center justify-center space-y-4 text-center py-12">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full" />
              <div className="relative bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-full">
                {hasFilters ? <Search className="h-16 w-16 text-primary/40" /> : <FileText className="h-16 w-16 text-primary/40" />}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-700">
                {hasFilters ? t("lawyers.table.emptyFiltered.title") : t("lawyers.table.empty.title")}
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                {hasFilters ? t("lawyers.table.emptyFiltered.subtitle") : t("lawyers.table.empty.subtitle")}
              </p>
            </div>
            {hasFilters && (
              <Button variant="outline" size="sm" onClick={onClearFilters}>
                {t("lawyers.table.resetFilters")}
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>
    </TableBody>
  );
};

export function AideJudiciaireTable({
  aides,
  onEdit,
  onAssign,
  onDelete,
  isLoading = false,
}: AideJudiciaireTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof AideJudiciaire>("numeroDossier");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [aideToDelete, setAideToDelete] = useState<AideJudiciaire | null>(null);
  const { t, lang } = useLanguage();
  const isRTL = lang === "ar";

  const handleSort = (field: keyof AideJudiciaire) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (field: keyof AideJudiciaire) => {
    if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    return sortOrder === "asc" ? <ArrowUpDown className="ml-2 h-4 w-4 text-primary" /> : <ArrowUpDown className="ml-2 h-4 w-4 text-primary rotate-180" />;
  };

  const clearFilters = () => setSearchTerm("");

  const filteredAndSortedAides = aides
    .filter((aide) => {
      const term = searchTerm.toLowerCase();
      const lawyerName = aide.avocatNom || "";
      const statusText = t(`aides.status.${aide.status}`).toLowerCase();
      return (
        aide.numeroDossier.toLowerCase().includes(term) ||
        aide.nomDemandeur.toLowerCase().includes(term) ||
        lawyerName.toLowerCase().includes(term) ||
        statusText.includes(term)
      );
    })
    .sort((a, b) => {
      const multiplier = sortOrder === "asc" ? 1 : -1;
      const aVal = String(a[sortField] || "");
      const bVal = String(b[sortField] || "");
      return multiplier * aVal.localeCompare(bVal);
    });

  const handleDeleteClick = (aide: AideJudiciaire) => {
    setAideToDelete(aide);
    setDeleteModalOpen(true);
  };

  const hasFilters = searchTerm !== "";
  const hasData = filteredAndSortedAides.length > 0;

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="flex gap-4 flex-wrap items-center bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={t("aides.table.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        {hasFilters && (
          <div className="text-sm text-muted-foreground bg-white px-3 py-2 rounded-lg border border-gray-200">
            <span className="font-medium">
              {t("lawyers.table.results", {
                count: filteredAndSortedAides.length,
                suffix: filteredAndSortedAides.length !== 1 ? "s" : "",
              })}
            </span>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
              <TableHead className="font-bold">
                <Button variant="ghost" size="sm" onClick={() => handleSort("numeroDossier")} className="font-bold hover:bg-gray-100 transition-colors">
                  {t("aides.table.columns.number")}
                  {getSortIcon("numeroDossier")}
                </Button>
              </TableHead>
              <TableHead className="font-bold">
                <Button variant="ghost" size="sm" onClick={() => handleSort("nomDemandeur")} className="font-bold hover:bg-gray-100 transition-colors">
                  {t("aides.table.columns.applicant")}
                  {getSortIcon("nomDemandeur")}
                </Button>
              </TableHead>
              <TableHead className="font-bold">{t("aides.table.columns.court")}</TableHead>
              <TableHead className="font-bold">{t("aides.table.columns.circuit")}</TableHead>
              <TableHead className="font-bold">
                <Button variant="ghost" size="sm" onClick={() => handleSort("dateDecision")} className="font-bold hover:bg-gray-100 transition-colors">
                  {t("aides.table.columns.decisionDate")}
                  {getSortIcon("dateDecision")}
                </Button>
              </TableHead>
              <TableHead className="font-bold">
                <Button variant="ghost" size="sm" onClick={() => handleSort("dateAudience")} className="font-bold hover:bg-gray-100 transition-colors">
                  {t("aides.table.columns.courtDate")}
                  {getSortIcon("dateAudience")}
                </Button>
              </TableHead>
              <TableHead className="font-bold">
                <Button variant="ghost" size="sm" onClick={() => handleSort("status")} className="font-bold hover:bg-gray-100 transition-colors">
                  {t("cases.table.columns.status")}
                  {getSortIcon("status")}
                </Button>
              </TableHead>
              <TableHead className="font-bold">
                <Button variant="ghost" size="sm" onClick={() => handleSort("avocatNom")} className="font-bold hover:bg-gray-100 transition-colors">
                  {t("aides.table.columns.lawyer")}
                  {getSortIcon("avocatNom")}
                </Button>
              </TableHead>
              <TableHead className="text-right font-bold">{t("aides.table.columns.actions")}</TableHead>
            </TableRow>
          </TableHeader>

          {isLoading ? (
            <TableSkeleton />
          ) : !hasData ? (
            <EmptyState hasFilters={hasFilters} onClearFilters={clearFilters} />
          ) : (
            <TableBody>
              {filteredAndSortedAides.map((aide) => (
                <TableRow key={aide.id} className="transition-all duration-200 border-b border-gray-100 hover:bg-gradient-to-r hover:from-primary/10 hover:to-transparent hover:shadow-sm">
                  <TableCell className="font-mono text-sm font-bold text-primary">{aide.numeroDossier}</TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="font-semibold text-gray-900">{aide.nomDemandeur}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-700">{t(`aides.cour.${aide.cour}`)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-medium bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700">
                      {t(`aides.circuit.${aide.circuit}`)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground font-medium text-sm">
                    {aide.dateDecision ? new Date(aide.dateDecision).toLocaleDateString("fr-FR") : "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground font-medium text-sm">
                    {aide.dateAudience ? new Date(aide.dateAudience).toLocaleDateString("fr-FR") : "-"}
                  </TableCell>
                  <TableCell>
                    {aide.status === "ASSIGNED" ? (
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400" variant="outline">
                        {t("aides.status.ASSIGNED")}
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400" variant="outline">
                        {t("aides.status.UNASSIGNED")}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {aide.avocatNom ? (
                      <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-xs font-bold">
                          {aide.avocatNom.charAt(0).toUpperCase()}
                        </div>
                        {aide.avocatNom}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground italic flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs text-gray-400">?</span>
                        </div>
                        {t("aides.table.unassigned")}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onAssign(aide)}
                        className="hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-all"
                        title={aide.status === "ASSIGNED" ? t("aides.assign.modal.reassign") : t("aides.assign.modal.columns.action")}
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(aide)}
                        className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(aide)}
                        className="hover:bg-red-600 shadow-md hover:shadow-lg transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </div>

      {/* Delete Confirmation Modal */}
      {aideToDelete && (
        <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
          <DialogContent dir={isRTL ? "rtl" : "ltr"} className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">{t("deleteAideModal.title")}</DialogTitle>
            </DialogHeader>

            <p className="mb-6 text-sm text-gray-600">
              {t("deleteAideModal.message", { number: aideToDelete.numeroDossier })}
            </p>

            <DialogFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
                {t("deleteAideModal.cancel")}
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  onDelete(aideToDelete.id);
                  setDeleteModalOpen(false);
                  setAideToDelete(null);
                }}
              >
                {t("deleteAideModal.confirm")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
