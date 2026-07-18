import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { LawyerTable } from "@/components/lawyers/LawyerTable";
import { LawyerModal } from "@/components/lawyers/LawyerModal";
import { Lawyer } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus, Users, Scale, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/i18n";
import { apiUrl } from "@/lib/config";

import {
  getAllLawyers,
  createLawyer,
  updateLawyer,
  deleteLawyer,
} from "@/lib/api/lawyerApi";

export default function Lawyers() {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLawyer, setEditingLawyer] = useState<Lawyer | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage] = useState(10); // You can adjust this number
const indexOfLast = currentPage * itemsPerPage;
const indexOfFirst = indexOfLast - itemsPerPage;
const currentLawyers = lawyers.slice(indexOfFirst, indexOfLast);
const totalPages = Math.ceil(lawyers.length / itemsPerPage);

  useEffect(() => {
    loadLawyers();
  }, []);

  const loadLawyers = async () => {
    setIsLoading(true);
    try {
      const data = await getAllLawyers();
      setLawyers(data);
    } catch (e) {
      toast.error(t("lawyers.toast.loadError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingLawyer(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (lawyer: Lawyer) => {
    setEditingLawyer(lawyer);
    setIsModalOpen(true);
  };

  const handleSave = async (lawyerData: Omit<Lawyer, "id">) => {
    try {
      if (editingLawyer) {
        const updated = await updateLawyer(
          Number(editingLawyer.id),
          lawyerData,
        );
        setLawyers(lawyers.map((l) => (l.id === updated.id ? updated : l)));
        toast.success(t("lawyers.toast.saveUpdate"));
      } else {
        const created = await createLawyer(lawyerData);
        setLawyers([...lawyers, created]);
        toast.success(t("lawyers.toast.saveCreate"));
      }
      setIsModalOpen(false);
    } catch {
      toast.error(t("lawyers.toast.saveError"));
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteLawyer(Number(id));
      setLawyers(lawyers.filter((l) => l.id !== id));
      toast.success(t("lawyers.toast.deleteSuccess"));
    } catch {
      toast.error(t("lawyers.toast.deleteError"));
    }
  };
const exportPdf = async () => {
  try {
    const res = await fetch(apiUrl("/api/lawyers/export/pdf/design"));
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "avocats.pdf";
    a.click();

    toast.success(t("lawyers.toast.exportPdfSuccess"));
  } catch (e) {
    toast.error(t("lawyers.toast.exportPdfError"));
  }
};

const exportExcel = async () => {
  try {
    const res = await fetch(apiUrl("/api/lawyers/export/excel"));
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "avocats.xlsx";
    a.click();

    toast.success(t("lawyers.toast.exportExcelSuccess"));
  } catch (e) {
    toast.error(t("lawyers.toast.exportExcelError"));
  }
};

  return (
    <Layout>
      <div className="space-y-6 p-4 sm:space-y-8 sm:p-6 md:p-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-3">
              <div className="shrink-0 rounded-lg bg-gradient-to-br gradient-accent to-indigo-600 p-2">
                <Scale className="h-5 w-5 text-white sm:h-6 sm:w-6" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-gray-100 dark:to-gray-400 sm:text-3xl">
                {t("lawyers.title")}
              </h1>
            </div>
            <p className="text-sm text-muted-foreground sm:pl-14">
              {t("lawyers.subtitle")}
            </p>
          </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Button
            onClick={handleAdd}
            size="lg"
            className="gradient-accent flex w-full items-center justify-center gap-2 sm:w-auto"
          >
            <Plus className="h-5 w-5" />
            {t("lawyers.add")}
          </Button>
            <Button
              onClick={exportPdf}
              variant="outline"
              size="lg"
              className="w-full gap-2 sm:w-auto"
            >
              <Scale className="h-5 w-5" />
              {t("lawyers.exportPdf")}
            </Button>
            <Button
              onClick={exportExcel}
              variant="outline"
              size="lg"
              className="w-full gap-2 sm:w-auto"
            >
              <Briefcase className="h-5 w-5" />
              {t("lawyers.exportExcel")}
            </Button>
          </div>
        </div>


   
        {/* Main Content Card */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          {isLoading ? (
            <div className="p-12">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative w-16 h-16">
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 dark:border-blue-900 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {t("lawyers.loading.title")}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t("lawyers.loading.subtitle")}
                  </p>
                </div>
              </div>
            </div>
          ) : lawyers.length === 0 ? (
            <div className="p-12">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full blur-xl opacity-20"></div>
                  <div className="relative p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-full border-2 border-blue-200 dark:border-blue-800">
                    <Users className="h-16 w-16 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>

                <div className="text-center space-y-3 max-w-md">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {t("lawyers.empty.title")}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t("lawyers.empty.subtitle")}
                  </p>
                  
                  <Button 
                    onClick={handleAdd}
                    className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    {t("lawyers.empty.button")}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
   <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-xl font-semibold text-slate-900">
                  {t("lawyers.list.title")}
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  {t("lawyers.list.count", {
                    count: lawyers.length,
                    suffix: lawyers.length !== 1 ? "s" : "",
                  })}
                </p>
              </div>

            <div className="overflow-x-auto">
             <LawyerTable
  lawyers={currentLawyers}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>

            </div>

            {/* Pagination */}
{lawyers.length > itemsPerPage && (
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
            
          )}
          
        </div>

        <LawyerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          lawyer={editingLawyer}
        />
      </div>

    </Layout>
  );
}
