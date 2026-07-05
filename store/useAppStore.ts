"use client";

import { create } from "zustand";
import {
  ConformiteCategory,
  FiscalRes,
  GestionTask,
  Nationality,
  Property,
  PropertyFrom,
  PropertyType,
  PropHubTab,
  PropScreen,
  PropStatus,
  Screen,
} from "./types";
import { fetchAll, insertProperty, persistProfile, setTaskCompleted } from "./backend";

interface AddPropModalState {
  show: boolean;
  step: 0 | 1;
  name: string;
  address: string;
  type: PropertyType;
  status: PropStatus;
}

interface AppState {
  // Auth / data lifecycle
  userId: string | null;
  hydrated: boolean;
  hydrating: boolean;

  // Navigation
  screen: Screen;
  propScreen: PropScreen;
  propertyFrom: PropertyFrom;
  activeProp: number | null;
  gestionFilter: number | null;
  tab: PropHubTab;

  // Data loaded from Supabase
  properties: Property[];
  gestionTasks: GestionTask[];
  conformiteByProperty: Record<number, ConformiteCategory[]>;

  // Onboarding (mirrors the `profiles` table row for the signed-in user)
  obComplete: boolean;
  obStep: 0 | 1 | 2 | 3 | 4 | 5;
  obNationality: Nationality;
  obFiscalRes: FiscalRes;
  obPropStatus: PropStatus;
  obReminderDelay: number;
  obLang: "fr" | "es";

  // Task management
  completedGestion: Record<string, boolean>;
  expandedGestion: string | null;
  gestionSort: "urgency" | "property";

  // Add property modal
  addPropModal: AddPropModalState;

  // Actions — data lifecycle
  hydrate: (userId: string) => Promise<void>;
  resetLocal: () => void;

  // Actions — navigation
  goToDashboard: () => void;
  goToBiens: () => void;
  goToPropHub: (id: number, from: PropertyFrom) => void;
  goToConformite: (id: number | null, from: PropertyFrom) => void;
  goToGestion: (filter: number | null) => void;
  goToCalendrier: (id: number | null) => void;
  goToVoyageurs: () => void;
  goToFiscalite: () => void;
  goToAide: () => void;
  setTab: (tab: PropHubTab) => void;

  // Actions — onboarding
  setObStep: (step: 0 | 1 | 2 | 3 | 4 | 5) => void;
  setObNationality: (n: Nationality) => void;
  setObFiscalRes: (f: FiscalRes) => void;
  setObPropStatus: (s: PropStatus) => void;
  setObReminderDelay: (n: number) => void;
  setObLang: (l: "fr" | "es") => void;
  completeOnboarding: () => Promise<"biens" | "dashboard">;
  skipOnboarding: () => Promise<void>;

  // Actions — properties
  addProperty: (p: { name: string; location: string; region: string; type: string }) => Promise<number>;

  // Actions — gestion
  toggleGestionDone: (taskId: string) => void;
  setExpandedGestion: (id: string | null) => void;
  setGestionSort: (s: "urgency" | "property") => void;

  // Actions — add property modal
  openAddPropModal: () => void;
  closeAddPropModal: () => void;
  setAddPropStep: (s: 0 | 1) => void;
  setAddPropField: (field: "name" | "address", value: string) => void;
  setAddPropType: (t: PropertyType) => void;
  setAddPropStatus: (s: PropStatus) => void;
}

const defaultAddPropModal: AddPropModalState = {
  show: false,
  step: 0,
  name: "",
  address: "",
  type: null,
  status: null,
};

const emptyState = {
  screen: "dashboard" as Screen,
  propScreen: "list" as PropScreen,
  propertyFrom: "list" as PropertyFrom,
  activeProp: null,
  gestionFilter: null,
  tab: "overview" as PropHubTab,

  properties: [] as Property[],
  gestionTasks: [] as GestionTask[],
  conformiteByProperty: {} as Record<number, ConformiteCategory[]>,

  obComplete: false,
  obStep: 0 as const,
  obNationality: null,
  obFiscalRes: null,
  obPropStatus: null,
  obReminderDelay: 3,
  obLang: "fr" as const,

  completedGestion: {} as Record<string, boolean>,
  expandedGestion: null,
  gestionSort: "urgency" as const,

  addPropModal: defaultAddPropModal,
};

export const useAppStore = create<AppState>((set, get) => ({
  userId: null,
  hydrated: false,
  hydrating: false,

  ...emptyState,

  hydrate: async (userId) => {
    if (get().hydrating) return;
    set({ hydrating: true });
    try {
      const { profile, properties, gestionTasks, completedGestion, conformiteByProperty } = await fetchAll(userId);
      set({
        userId,
        properties,
        gestionTasks,
        completedGestion,
        conformiteByProperty,
        obComplete: profile.onboardingComplete,
        obNationality: profile.nationality,
        obFiscalRes: profile.fiscalRes,
        obPropStatus: profile.propStatus,
        obReminderDelay: profile.reminderDelay,
        obLang: profile.lang,
        hydrated: true,
        hydrating: false,
      });
    } catch (err) {
      console.error("Failed to hydrate Habita data from Supabase", err);
      set({ hydrating: false, hydrated: true });
    }
  },

  resetLocal: () => set({ ...emptyState, userId: null, hydrated: false, hydrating: false }),

  goToDashboard: () => set({ screen: "dashboard" }),
  goToBiens: () => set({ screen: "biens", propScreen: "list" }),
  goToPropHub: (id, from) =>
    set({ screen: "property", propScreen: "detail", activeProp: id, propertyFrom: from, tab: "overview" }),
  goToConformite: (id, from) =>
    set({ screen: "conformite", activeProp: id, propertyFrom: from }),
  goToGestion: (filter) => set({ screen: "gestion", gestionFilter: filter }),
  goToCalendrier: (id) => set({ screen: "calendrier", activeProp: id }),
  goToVoyageurs: () => set({ screen: "voyageurs" }),
  goToFiscalite: () => set({ screen: "fiscalite" }),
  goToAide: () => set({ screen: "aide" }),
  setTab: (tab) => set({ tab }),

  setObStep: (obStep) => set({ obStep }),
  setObNationality: (obNationality) => set({ obNationality }),
  setObFiscalRes: (obFiscalRes) => set({ obFiscalRes }),
  setObPropStatus: (obPropStatus) => set({ obPropStatus }),
  setObReminderDelay: (obReminderDelay) => set({ obReminderDelay }),
  setObLang: (obLang) => set({ obLang }),

  completeOnboarding: async () => {
    const { obPropStatus, obNationality, obFiscalRes, obReminderDelay, obLang, userId } = get();
    set({ obComplete: true });
    const target = obPropStatus === "licensed" ? "biens" : "dashboard";
    set({ screen: target });
    if (userId) {
      persistProfile(userId, {
        onboardingComplete: true,
        nationality: obNationality,
        fiscalRes: obFiscalRes,
        propStatus: obPropStatus,
        reminderDelay: obReminderDelay,
        lang: obLang,
      }).catch((err) => console.error("Failed to save onboarding profile", err));
    }
    return target;
  },

  skipOnboarding: async () => {
    const { obNationality, obFiscalRes, obPropStatus, obReminderDelay, obLang, userId } = get();
    set({ obComplete: true, screen: "dashboard" });
    if (userId) {
      persistProfile(userId, {
        onboardingComplete: true,
        nationality: obNationality,
        fiscalRes: obFiscalRes,
        propStatus: obPropStatus,
        reminderDelay: obReminderDelay,
        lang: obLang,
      }).catch((err) => console.error("Failed to save onboarding profile", err));
    }
  },

  addProperty: async (p) => {
    const { properties, userId } = get();
    if (!userId) throw new Error("Cannot add a property while signed out");
    const id = properties.length;
    const { dbId, categories } = await insertProperty(userId, p);
    const newProp: Property = {
      id,
      dbId,
      name: p.name,
      location: p.location,
      region: p.region,
      type: p.type,
      pct: 0,
      status: "pending",
      income: "—",
      airbnbOk: false,
      docsOk: false,
      tags: [{ label: "Conformité à démarrer", warn: true }],
    };
    set({
      properties: [...properties, newProp],
      conformiteByProperty: { ...get().conformiteByProperty, [id]: categories },
    });
    return id;
  },

  toggleGestionDone: (taskId) => {
    const { completedGestion } = get();
    const nextValue = !completedGestion[taskId];
    set({ completedGestion: { ...completedGestion, [taskId]: nextValue } });
    setTaskCompleted(taskId, nextValue).catch((err) => console.error("Failed to save task status", err));
  },
  setExpandedGestion: (expandedGestion) => set({ expandedGestion }),
  setGestionSort: (gestionSort) => set({ gestionSort }),

  openAddPropModal: () => set({ addPropModal: { ...defaultAddPropModal, show: true } }),
  closeAddPropModal: () => set({ addPropModal: defaultAddPropModal }),
  setAddPropStep: (step) => set((s) => ({ addPropModal: { ...s.addPropModal, step } })),
  setAddPropField: (field, value) =>
    set((s) => ({ addPropModal: { ...s.addPropModal, [field]: value } })),
  setAddPropType: (type) => set((s) => ({ addPropModal: { ...s.addPropModal, type } })),
  setAddPropStatus: (status) => set((s) => ({ addPropModal: { ...s.addPropModal, status } })),
}));

// screenToNav map — used by Sidebar to decide which nav item to highlight.
// Per spec: voyageurs/fiscalite/licence(conformite)/calendrier/gestion -> "Gestion opérationnelle";
// dashboard/propHub(property)/biens -> "Mes biens".
export function screenToNav(screen: Screen): string {
  if (["voyageurs", "fiscalite", "calendrier", "gestion", "conformite"].includes(screen)) return "gestion";
  if (["dashboard", "property", "biens"].includes(screen)) return "biens";
  if (screen === "aide") return "aide";
  return screen;
}
