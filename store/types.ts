export type Screen =
  | "dashboard"
  | "biens"
  | "property"
  | "gestion"
  | "voyageurs"
  | "fiscalite"
  | "calendrier"
  | "conformite"
  | "aide";

export type PropScreen = "list" | "detail";
export type PropertyFrom = "list" | "propHub";
export type PropHubTab = "overview" | "checklist" | "documents" | "calendrier" | "finances";

export type Nationality = "FR" | "ES" | null;
export type FiscalRes = "FR" | "ES" | "OTHER" | null;
export type PropStatus = "new" | "licensed" | null;
export type PropertyType = "appartement" | "maison" | "studio" | "villa" | null;

export interface PropertyTag {
  label: string;
  ok?: boolean;
  warn?: boolean;
  err?: boolean;
}

export interface Property {
  id: number; // position in the loaded array — used for routing/URLs (/biens/0, /biens/1, ...)
  dbId: string; // real Supabase row id (uuid) — used for all backend reads/writes
  name: string;
  location: string;
  pct: number;
  status: "active" | "pending";
  income: string;
  region: string;
  type: string;
  airbnbOk: boolean;
  docsOk: boolean;
  tags: PropertyTag[];
  licenseNumber?: string;
  licenseObtainedDate?: string;
  licenseExpiryDate?: string;
}

export type Urgency = "urgent" | "warn" | "ok";

export interface GestionTask {
  id: string;
  propertyId: number;
  cat: string;
  urgency: Urgency;
  title: string;
  subLabel: string;
  nextAction: string;
  deadline: string;
  explanation: string;
  docs: { label: string; flagged?: boolean }[];
  platforms: { label: string; url: string }[];
}

export interface ConformiteItem {
  id: string;
  label: string;
  description: string;
  status: "done" | "progress" | "missing";
  hasExpiry?: boolean;
  expiryDate?: string;
  obtainedDate?: string;
}

export interface ConformiteCategory {
  id: string;
  title: string;
  items: ConformiteItem[];
}
