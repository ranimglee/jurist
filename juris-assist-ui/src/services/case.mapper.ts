import { Case, CaseStatus, CaseType, SousType } from "@/types";
import { BackendCase, BackendCaseStatus } from "./case.types";

const STATUS_MAP: Record<BackendCaseStatus, CaseStatus> = {
  EN_ATTENTE: "en_attente",
  EN_COURS: "en_cours",
  ACCEPTEE: "acceptee",
  REFUSEE: "refusee",
  CLOTUREE: "cloturee",
};

export const mapBackendCaseToCase = (a: BackendCase): Case => ({
  id: a.id,
  caseNumber: a.numero,
  title: a.titre,
  type: a.type.toLowerCase() as CaseType,
  sousType: a.sousType
    ? (a.sousType.toLowerCase() as SousType)
    : undefined,
  nomAccuse: a.nomAccuse,
  createdAt: a.dateCreation,
  courtDate: a.dateTribunal,
  status: STATUS_MAP[a.statut],
  assignedLawyerId: a.avocatId ? String(a.avocatId) : undefined,
  assignedLawyerName: a.avocatNom ?? undefined,
});
/** Frontend → Backend */
export const CASE_TYPE_TO_BACKEND: Record<
  CaseType,
  "CRIMINEL" | "ENQUETE" | "ENQUETEUR_PRELIMINAIRE"
> = {
  criminel: "CRIMINEL",
  enquete: "ENQUETE",
  enqueteur_preliminaire: "ENQUETEUR_PRELIMINAIRE",
};

export const toBackendSousType = (
  value?: SousType
): Uppercase<SousType> | null =>
  value ? (value.toUpperCase() as Uppercase<SousType>) : null;