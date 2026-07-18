export interface Lawyer {
  id: number;
  prenom: string;
  identifiant:string;
  nom: string;
  email: string;
  telephone: string;
  region: string;
  adresse: string;
  dateInscription: string | null;
  affairesAcceptees?: number;
  affairesRefusees?: number;
  affairesEnCours?: number;
  lastAssignedAt?: string | null;
}

export type SousType =
  | "TRIBUNAL_PREMIERE_INSTANCE_NABEUL"
  | "TRIBUNAL_PREMIERE_INSTANCE_GROMBALIA"
  | "COUR_APPEL_NABEUL"
  | "NABEUL"
  | "ZAGHOUAN"
  | "GROMBALIA";

export type CaseType = "criminel" | "enquete" | "enqueteur_preliminaire";

export type CaseStatus = "en_attente" | "en_cours" | "acceptee" | "refusee" | "cloturee";

export type Case = {
  id: number;
  caseNumber: string;
  title?: string;
  type: CaseType;
  sousType?:SousType;
  nomAccuse: string; // nomAccuse
  createdAt: string;
  courtDate: string;
  status: CaseStatus;
  assignedLawyerId?: string;
  assignedLawyerName?: string; // on peut récupérer le nom depuis API avocat
  notificationSent?: string,
  assignmentMode:AssignmentMode
};


export interface DashboardStats {
  totalLawyers: number;
  totalCases: number;
  activeCases: number;
  completedCases: number;
}
export type AffaireFormData = {
  numero: string;
  titre: string;
  type: CaseType;
  sousType?: SousType;
  nomAccuse: string;
  dateTribunal: string;
};
export type AssignmentMode = "AUTOMATIC" | "MANUAL";

export type CourType =
  | "TRIBUNAL_PREMIERE_INSTANCE_GROMBALIA"
  | "TRIBUNAL_PREMIERE_INSTANCE_NABEUL"
  | "COUR_APPEL_NABEUL"
  | "TRIBUNAL_NAHAIYA_GROMBALIA";

export type CircuitType = "PENAL" | "CIVIL" | "FAMILLE" | "URGENT";

export interface AideJudiciaire {
  id: number;
  numeroDossier: string;
  cour: CourType;
  circuit: CircuitType;
  nomDemandeur: string;
  dateDecision: string;
  dateAudience: string;
  assignedAt?: string | null;
  avocatId?: number | null;
  avocatNom?: string | null;
  status: "ASSIGNED" | "UNASSIGNED";
}

export interface EligibleAvocat {
  id: number;
  nom: string;
  prenom: string;
  identifiant: string;
  email: string;
  telephone: string;
  region: string;
  aideJudiciaireCount: number;
  lastAssignedAt?: string | null;
  priorityScore: number;
}
