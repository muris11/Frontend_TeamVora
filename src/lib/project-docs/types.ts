import { LucideIcon } from "lucide-react";

export type ProjectDocStatus = "Verified" | "Inferred" | "Partial" | "Needs verification";

export interface ProjectDocFact {
  label: string;
  value: string;
}

export interface ProjectDocKeyFile {
  path: string;
  note: string;
  status: ProjectDocStatus;
}

export interface ProjectDocFlow {
  title: string;
  steps: string[];
  status: ProjectDocStatus;
}

export interface ProjectDocRisk {
  title: string;
  detail: string;
  status: ProjectDocStatus;
}

export interface ProjectDocPage {
  id: string;
  slug: string[];
  category: string;
  title: string;
  summary: string;
  audience: string[];
  overallStatus: ProjectDocStatus;
  statusNote: string;
  facts: ProjectDocFact[];
  responsibilities: string[];
  keyFiles: ProjectDocKeyFile[];
  flows: ProjectDocFlow[];
  dependencies: string[];
  sensitiveAreas: ProjectDocRisk[];
  safeChangeGuide: string[];
  validationChecklist: string[];
  affectedSurfaces: string[];
  relatedPageIds: string[];
}

export interface ProjectDocCategory {
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
  pageIds: string[];
}