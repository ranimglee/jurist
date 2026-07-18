import { CaseStatus, CaseType, SousType } from "@/types";

/** Backend enums (exactly as backend sends them) */
export type BackendCaseStatus =
  | "EN_ATTENTE"
  | "EN_COURS"
  | "ACCEPTEE"
  | "REFUSEE"
  | "CLOTUREE";

export interface BackendCase {
  id: number;
  numero: string;
  titre: string;
  type: string;
  sousType?: string | null;
  nomAccuse: string;
  dateCreation: string;
  dateTribunal: string;
  statut: BackendCaseStatus;
  avocatId?: number | null;
  avocatNom?: string | null;
}

/** Payload sent to backend */
export interface SaveCaseDTO {
  numero: string;
  titre: string;
  type: Uppercase<CaseType>;
  sousType?: Uppercase<SousType> | null;
  nomAccuse: string;
  dateTribunal: string;
  assignmentMode: "AUTOMATIC" | "MANUAL";
  avocatId?: number | null;
}
