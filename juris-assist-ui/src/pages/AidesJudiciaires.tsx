import { useState, useEffect, useCallback } from "react";
import { Layout } from "@/components/layout/Layout";
import { AideJudiciaireTable } from "@/components/aides/AideJudiciaireTable";
import { AideJudiciaire } from "@/types";
import { AideJudiciaireModal } from "@/components/aides/AideJudiciaireModal";
import { AideJudiciaireAssignModal } from "@/components/aides/AideJudiciaireAssignModal";
import { Button } from "@/components/ui/button";
import { Plus, Briefcase, Scale, UserCheck, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/i18n";
import { AideJudiciaireService } from "@/services/aideJudiciaire.service";

export default function AidesJudiciaires() {
  const [aides, setAides] = useState<AideJudiciaire[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAide, setEditingAide] = useState<AideJudiciaire | undefined>();
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assigningAide, setAssigningAide] = useState<AideJudiciaire | undefined>();
  const { t } = useLanguage();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentAides = aides.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(aides.length / itemsPerPage);

  const loadAides = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await AideJudiciaireService.getAll();
      setAides(data);
    } catch (error) {
      toast.error(t("aides.toast.loadError"));
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadAides();
  }, [loadAides]);

  const handleDelete = async (id: number) => {
    try {
      await AideJudiciaireService.remove(id);
      setAides((prev) => prev.filter((a) => a.id !== id));
      toast.success(t("aides.toast.deleteSuccess"));
    } catch (error: any) {
      toast.error(error.message || t("aides.toast.deleteError"));
    }
  };

  const handleSave = async (aideData: {
    numeroDossier: string;
    nomDemandeur: string;
    cour: any; // using any or CourType
    circuit: any; // using any or CircuitType
    dateDecision: string;
    dateAudience: string;
    avocatId?: number | null;
  }) => {
    try {
      const savedAide = editingAide
        ? await AideJudiciaireService.update(editingAide.id, aideData)
        : await AideJudiciaireService.create(aideData);

      setAides((prev) =>
        editingAide
          ? prev.map((a) => (a.id === savedAide.id ? savedAide : a))
          : [savedAide, ...prev]
      );

      toast.success(editingAide ? t("aides.toast.updateSuccess") : t("aides.toast.createSuccess"));
      setIsModalOpen(false);
      setEditingAide(undefined);
    } catch (error: any) {
      toast.error(error.message || t("aides.toast.saveError"));
      console.error(error);
    }
  };

  const handleEditClick = (aide: AideJudiciaire) => {
    setEditingAide(aide);
    setIsModalOpen(true);
  };

  const handleAssignClick = (aide: AideJudiciaire) => {
    setAssigningAide(aide);
    setIsAssignModalOpen(true);
  };

  const stats = {
    total: aides.length,
    assigned: aides.filter((a) => a.status === "ASSIGNED").length,
    unassigned: aides.filter((a) => a.status === "UNASSIGNED").length,
  };

  return (
    <Layout>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="mx-auto max-w-7xl space-y-6 p-4 sm:space-y-8 sm:p-6 md:p-8">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-3">
                <div className="shrink-0 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 p-2">
                  <Scale className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-gray-100 dark:to-gray-400 sm:text-3xl">
                  {t("aides.title")}
                </h1>
              </div>
              <p className="text-sm text-muted-foreground sm:pl-14">{t("aides.subtitle")}</p>
            </div>

            <Button
              onClick={() => {
                setEditingAide(undefined);
                setIsModalOpen(true);
              }}
              className="gradient-accent w-full shrink-0 sm:w-auto"
            >
              <Plus className="mr-2 h-5 w-5" />
              {t("aides.new")}
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Total */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">{t("aides.stats.total")}</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Assigned */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">{t("aides.stats.assigned")}</p>
                  <p className="text-3xl font-bold text-emerald-600">{stats.assigned}</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl">
                  <UserCheck className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>

            {/* Unassigned */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">{t("aides.stats.unassigned")}</p>
                  <p className="text-3xl font-bold text-amber-600">{stats.unassigned}</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl">
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">{t("aides.list.title")}</h2>
              <p className="text-sm text-slate-600 mt-1">
                {t("aides.list.count", {
                  count: aides.length,
                  suffix: aides.length !== 1 ? "s" : "",
                })}
              </p>
            </div>
            <div className="overflow-x-auto">
              <AideJudiciaireTable
                aides={currentAides}
                onEdit={handleEditClick}
                onAssign={handleAssignClick}
                onDelete={handleDelete}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* Pagination */}
          {aides.length > itemsPerPage && (
            <div className="mt-4 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                size="sm"
                variant="outline"
              >
                {t("pagination.prev")}
              </Button>
              <span className="px-2 py-1 text-sm font-medium">
                {t("pagination.pageOf", { current: currentPage, total: totalPages })}
              </span>
              <Button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                size="sm"
                variant="outline"
              >
                {t("pagination.next")}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Editor Modal */}
      <AideJudiciaireModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAide(undefined);
        }}
        onSave={handleSave}
        aideData={editingAide}
      />

      {/* Assignment Modal */}
      {assigningAide && (
        <AideJudiciaireAssignModal
          isOpen={isAssignModalOpen}
          onClose={() => {
            setIsAssignModalOpen(false);
            setAssigningAide(undefined);
          }}
          aide={assigningAide}
          onAssigned={loadAides}
        />
      )}
    </Layout>
  );
}
