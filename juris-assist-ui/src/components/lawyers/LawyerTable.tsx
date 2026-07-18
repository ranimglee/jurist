import { useState } from "react";
import { Lawyer } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, ArrowUpDown, Search, Mail, Phone, MapPin, Calendar, Briefcase, TrendingUp, TrendingDown, Minus, FileText } from "lucide-react";
import { DeleteLawyerModal } from "./DeleteLawyerModal";
import LawyerDetailsModal from "./LawyerDetailsModal";
import { useLanguage } from "@/i18n";

interface LawyerTableProps {
  lawyers: Lawyer[];
  onEdit: (lawyer: Lawyer) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

type SortField = "nom" | "region" | "dateInscription" | "affairesEnCours";
type SortOrder = "asc" | "desc";

// Skeleton for loading state
const TableSkeleton = () => (
  <TableBody>
    {[...Array(5)].map((_, i) => (
      <TableRow key={i}>
        {[...Array(7)].map((_, j) => (
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
      <TableCell colSpan={7} className="h-96">
        <div className="flex flex-col items-center justify-center space-y-4 text-center py-12">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full" />
            <div className="relative bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-full">
              {hasFilters ? <Search className="h-16 w-16 text-primary/40" /> : <FileText className="h-16 w-16 text-primary/40" />}
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-700">
              {hasFilters
                ? t("lawyers.table.emptyFiltered.title")
                : t("lawyers.table.empty.title")}
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {hasFilters
                ? t("lawyers.table.emptyFiltered.subtitle")
                : t("lawyers.table.empty.subtitle")}
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
export function LawyerTable({ lawyers, onEdit, onDelete, isLoading = false }: LawyerTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("nom");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [lawyerToDelete, setLawyerToDelete] = useState<number | null>(null);
  const [selectedLawyer, setSelectedLawyer] = useState<Lawyer | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { t } = useLanguage();

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const clearFilters = () => setSearchTerm("");

  const filteredAndSortedLawyers = lawyers
    .filter((lawyer) =>
      `${lawyer.prenom} ${lawyer.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lawyer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lawyer.region.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const multiplier = sortOrder === "asc" ? 1 : -1;
      if (sortField === "dateInscription") return multiplier * (new Date(a.dateInscription).getTime() - new Date(b.dateInscription).getTime());
      if (sortField === "affairesEnCours") return multiplier * (a.affairesEnCours - b.affairesEnCours);
      return multiplier * a[sortField].localeCompare(b[sortField]);
    });

  const getPerformanceBadge = (lawyer: Lawyer) => {
    const total = lawyer.affairesAcceptees + lawyer.affairesRefusees;
    if (total === 0) return { text: "Nouveau", color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300", icon: Minus };
    const acceptanceRate = (lawyer.affairesAcceptees / total) * 100;
    if (acceptanceRate >= 80) return { text: `${acceptanceRate.toFixed(0)}%`, color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", icon: TrendingUp };
    if (acceptanceRate >= 50) return { text: `${acceptanceRate.toFixed(0)}%`, color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400", icon: Minus };
    return { text: `${acceptanceRate.toFixed(0)}%`, color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", icon: TrendingDown };
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    return sortOrder === "asc" ? <ArrowUpDown className="ml-2 h-4 w-4 text-primary" /> : <ArrowUpDown className="ml-2 h-4 w-4 text-primary rotate-180" />;
  };

  const handleDeleteClick = (id: number) => {
    setLawyerToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleViewDetails = (lawyer: Lawyer) => {
    setSelectedLawyer(lawyer);
    setModalOpen(true);
  };

  const hasFilters = searchTerm !== "";
  const hasData = filteredAndSortedLawyers.length > 0;

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="flex gap-4 flex-wrap items-center bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={t("lawyers.table.searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        {hasFilters && (
          <div className="text-sm text-muted-foreground bg-white px-3 py-2 rounded-lg border border-gray-200">
            <span className="font-medium">
              {t("lawyers.table.results", {
                count: filteredAndSortedLawyers.length,
                suffix: filteredAndSortedLawyers.length !== 1 ? "s" : "",
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
  {t("lawyers.table.columns.identifiant")}
</TableHead>

              <TableHead className="font-bold">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("nom")}
                  className="font-bold hover:bg-gray-100 transition-colors"
                >
                  {t("lawyers.table.columns.name")}
                  {getSortIcon("nom")}
                </Button>
              </TableHead>
              <TableHead className="font-bold">
                {t("lawyers.table.columns.contact")}
              </TableHead>
              <TableHead className="font-bold">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("region")}
                  className="font-bold hover:bg-gray-100 transition-colors"
                >
                  {t("lawyers.table.columns.region")}
                  {getSortIcon("region")}
                </Button>
              </TableHead>
              <TableHead className="font-bold">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("dateInscription")}
                  className="font-bold hover:bg-gray-100 transition-colors"
                >
                  {t("lawyers.table.columns.registration")}
                  {getSortIcon("dateInscription")}
                </Button>
              </TableHead>
              <TableHead className="font-bold">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("affairesEnCours")}
                  className="font-bold hover:bg-gray-100 transition-colors"
                >
                  {t("lawyers.table.columns.cases")}
                  {getSortIcon("affairesEnCours")}
                </Button>
              </TableHead>
              <TableHead className="font-bold">
                {t("lawyers.table.columns.performance")}
              </TableHead>
              <TableHead className="text-right font-bold">
                {t("lawyers.table.columns.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>

          {isLoading ? (
            <TableSkeleton />
          ) : !hasData ? (
            <EmptyState hasFilters={hasFilters} onClearFilters={clearFilters} />
          ) : (
            <TableBody>
              {filteredAndSortedLawyers.map((lawyer) => {
                const badge = getPerformanceBadge(lawyer);
                const Icon = badge.icon;

                return (
                  <TableRow
                    key={lawyer.id}
                    onClick={() => handleViewDetails(lawyer)}
                    className="transition-all duration-200 border-b border-gray-100 cursor-pointer
                               hover:bg-gradient-to-r hover:from-primary/10 hover:to-transparent hover:shadow-sm"
                  >
                    <TableCell>
  <div className="flex items-center gap-2 text-sm text-gray-700">
    <FileText className="h-3.5 w-3.5 text-gray-400" />
    {lawyer.identifiant}
  </div>
</TableCell>

                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold text-sm">
                          {lawyer.prenom.charAt(0)}
                          {lawyer.nom.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{lawyer.nom} {lawyer.prenom}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Briefcase className="h-3 w-3" /> Avocat #{lawyer.id}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Mail className="h-3.5 w-3.5 text-gray-400" /> {lawyer.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-3.5 w-3.5 text-gray-400" /> {lawyer.telephone}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-500" />
                        <span className="font-medium text-gray-700">{lawyer.region}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">{new Date(lawyer.dateInscription).toLocaleDateString("fr-FR")}</span>
                      </div>
                    </TableCell>

                   <TableCell>
                     <div className="space-y-1">
                       <div className="flex items-center gap-2"> 
                        <div className="px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold"> 
                        {lawyer.affairesEnCours} {t("lawyers.table.inProgress")}
                         </div> 
                        </div>
                         <div className="flex gap-2 text-xs">
                           <span className="text-emerald-600 dark:text-emerald-400 font-medium"> ✓ {lawyer.affairesAcceptees} </span>
                            <span className="text-gray-400">·</span>
                             <span className="text-red-600 dark:text-red-400 font-medium"> ✗ {lawyer.affairesRefusees} </span>
                              </div> 
                              </div>
                     </TableCell>

                    <TableCell>
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${badge.color} text-xs font-semibold`}>
                        <Icon className="h-3.5 w-3.5" /> {badge.text}
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => { e.stopPropagation(); onEdit(lawyer); }}
                          className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => { e.stopPropagation(); handleDeleteClick(lawyer.id); }}
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

      {/* Modal détails avocat */}
      <LawyerDetailsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        lawyer={selectedLawyer}
      />

      {/* Modal suppression */}
      {lawyerToDelete && (
        <DeleteLawyerModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setLawyerToDelete(null);
          }}
          onConfirm={() => {
            onDelete(lawyerToDelete);
            setDeleteModalOpen(false);
            setLawyerToDelete(null);
          }}
          lawyerName={lawyers.find((l) => l.id === lawyerToDelete)?.nom + " " + lawyers.find((l) => l.id === lawyerToDelete)?.prenom}
        />
      )}
    </div>
  );
}
