import { useState, useEffect, useCallback } from "react";
import { Layout } from "@/components/layout/Layout";
import { CaseTable } from "@/components/cases/CaseTable";
import { Case, CaseStatus, CaseType, SousType } from "@/types";
import { CaseModal } from "@/components/cases/CaseModal";
import { Button } from "@/components/ui/button";
import { Plus, Briefcase, Scale, FileText, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/i18n";
import { CaseService } from "@/services/case.service";
import { SaveCaseDTO } from "@/services/case.types";

import { CASE_TYPE_TO_BACKEND, toBackendSousType } from "@/services/case.mapper";
const ACTIVE_STATUSES: CaseStatus[] = ["en_attente", "en_cours", "acceptee"];

export default function Cases() {
  const [cases, setCases] = useState<Case[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<Case | undefined>();
  const { t } = useLanguage();
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage] = useState(10); // You can adjust this number
const indexOfLast = currentPage * itemsPerPage;
const indexOfFirst = indexOfLast - itemsPerPage;
const currentCases = cases.slice(indexOfFirst, indexOfLast);
const totalPages = Math.ceil(cases.length / itemsPerPage);
const loadCases = useCallback(async () => {
  try {
    const data = await CaseService.getAll();
    setCases(data);
  } catch (error) {
    toast.error(t("cases.toast.loadError"));
    console.error(error);
  }
}, [t]);

useEffect(() => {
  loadCases();
}, [loadCases]);

const handleDelete = async (caseId: number) => {
  try {
    setDeletingId(caseId);

    await CaseService.remove(caseId);

    setCases((prev) => prev.filter((c) => c.id !== caseId));

    toast.success(t("cases.toast.deleteSuccess"));
  } catch (error: any) {
    toast.error(error.message || t("cases.toast.deleteError"));
  } finally {
    setDeletingId(null);
  }
};

const handleSave = async (caseData: {
  numero: string;
  titre: string;
  type: CaseType;
  sousType?: SousType;
  nomAccuse: string;
  dateTribunal: string;
  assignmentMode: "AUTOMATIC" | "MANUAL";
  assignedLawyerId?: string | null;
}) => {

  const dto: SaveCaseDTO = {
  numero: caseData.numero,
  titre: caseData.titre,
  type: CASE_TYPE_TO_BACKEND[caseData.type],
  sousType: toBackendSousType(caseData.sousType),
  nomAccuse: caseData.nomAccuse,
  dateTribunal: caseData.dateTribunal,
  assignmentMode: caseData.assignmentMode,
  avocatId: caseData.assignmentMode === "MANUAL" ? Number(caseData.assignedLawyerId) : null,
};


  try {
    const savedCase = editingCase
      ? await CaseService.update(editingCase.id, dto)
      : await CaseService.create(dto);

    setCases((prev) =>
      editingCase
        ? prev.map((c) => (c.id === savedCase.id ? savedCase : c))
        : [savedCase, ...prev]
    );

    toast.success(
      editingCase
        ? t("cases.toast.updateSuccess")
        : t("cases.toast.createSuccess")
    );

    setIsModalOpen(false);
    setEditingCase(undefined);
  } catch (error: any) {
    toast.error(error.message || t("cases.toast.saveError"));
    console.error(error);
  }
};

  // Calculate statistics
  const stats = {
    total: cases.length,
    en_attente: cases.filter(c => c.status === "en_attente").length,
    acceptee: cases.filter(c => c.status === "acceptee").length,
    cloturee: cases.filter(c => c.status === "cloturee").length,
  };

  return (
    <Layout>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="mx-auto max-w-7xl space-y-6 p-4 sm:space-y-8 sm:p-6 md:p-8">

        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-3">
              <div className="shrink-0 rounded-lg bg-gradient-to-br gradient-accent to-indigo-600 p-2">
                <Scale className="h-5 w-5 text-white sm:h-6 sm:w-6" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-gray-100 dark:to-gray-400 sm:text-3xl">
                {t("cases.title")}
              </h1>
            </div>
            <p className="text-sm text-muted-foreground sm:pl-14">
              {t("cases.subtitle")}
            </p>
          </div>

          <Button
            onClick={() => {
              setEditingCase(undefined);
              setIsModalOpen(true);
            }}
            className="gradient-accent w-full shrink-0 sm:w-auto"
          >
            <Plus className="mr-2 h-5 w-5" />
            {t("cases.new")}
          </Button>

        </div>



       

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    {t("cases.stats.total")}
                  </p>
                  <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    {t("cases.stats.en_attente")}
                  </p>
                  <p className="text-3xl font-bold text-amber-600">{stats.en_attente}</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl">
                  <FileText className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    {t("cases.stats.acceptee")}
                  </p>
                  <p className="text-3xl font-bold text-indigo-600">{stats.acceptee}</p>
                </div>
                <div className="p-3 bg-indigo-50 rounded-xl">
                  <Scale className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    {t("cases.stats.cloturee")}
                  </p>
                  <p className="text-3xl font-bold text-green-600">{stats.cloturee}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Cases Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-xl font-semibold text-slate-900">
                  {t("cases.list.title")}
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  {t("cases.list.count", {
                    count: cases.length,
                    suffix: cases.length !== 1 ? "s" : "",
                  })}
                </p>
              </div>
            <div className="overflow-x-auto">
              <CaseTable
                cases={currentCases}
                onEdit={(c) => {
                  setEditingCase(c);
                  setIsModalOpen(true);
                }}
                onAssign={() => {}}
                onDelete={handleDelete}
                getLawyerName={(lawyerId) => {
                  const lawyer = cases.find(c => c.assignedLawyerId === lawyerId);
                  return lawyer?.assignedLawyerName || "-";
                }}
              />
            </div>
          </div>

                 {/* Pagination */}
{cases.length > itemsPerPage && (
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

        <CaseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          caseData={editingCase}
        />
      </div>
    </Layout>
  );
}