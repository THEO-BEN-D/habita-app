"use client";

// Data-access layer: every read/write against Supabase lives here, and returns
// data already shaped like the app's local types (store/types.ts) so the rest
// of the codebase never has to think about DB rows vs UI models.

import { supabase } from "@/lib/supabase/client";
import { ConformiteCategory, FiscalRes, GestionTask, Nationality, Property, PropStatus } from "./types";

export interface ProfileData {
  onboardingComplete: boolean;
  nationality: Nationality;
  fiscalRes: FiscalRes;
  propStatus: PropStatus;
  reminderDelay: number;
  lang: "fr" | "es";
}

export interface HydratedState {
  profile: ProfileData;
  properties: Property[];
  gestionTasks: GestionTask[];
  completedGestion: Record<string, boolean>;
  conformiteByProperty: Record<number, ConformiteCategory[]>;
}

// Default checklist created for every newly-added property (mirrors the "not
// yet licensed" onboarding path — see components/onboarding for the copy).
function defaultConformiteTemplate() {
  return [
    {
      title: "Démarches légales & licence",
      items: [
        { label: "Licence HUTG", description: "Numéro de registre du tourisme (Habitatge d'Ús Turístic)", hasExpiry: true },
        { label: "Inscription SES / Registre Únic", description: "Enregistrement des voyageurs auprès des autorités" },
      ],
    },
    {
      title: "Préparation technique du logement",
      items: [
        { label: "Cédula d'habitabilité", description: "Certificat d'habitabilité du logement" },
        { label: "Certificat de performance énergétique", description: "Diagnostic énergétique obligatoire" },
      ],
    },
    {
      title: "Assurance & sécurité",
      items: [
        { label: "Assurance habitation location saisonnière", description: "Couverture adaptée aux voyageurs court séjour", hasExpiry: true },
      ],
    },
  ];
}

export async function fetchAll(userId: string): Promise<HydratedState> {
  const [{ data: profileRow }, { data: propertyRows }, { data: tagRows }] = await Promise.all([
    supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle(),
    supabase.from("properties").select("*").eq("user_id", userId).order("created_at", { ascending: true }),
    supabase
      .from("property_tags")
      .select("*, properties!inner(user_id)")
      .eq("properties.user_id", userId),
  ]);

  const propRows = propertyRows ?? [];
  const dbIdToIndex = new Map(propRows.map((p, i) => [p.id, i]));

  const properties: Property[] = propRows.map((row, index) => ({
    id: index,
    dbId: row.id,
    name: row.name,
    location: row.location,
    region: row.region,
    type: row.type,
    pct: row.pct,
    status: row.status as Property["status"],
    income: row.income_cents > 0 ? `${(row.income_cents / 100).toLocaleString("fr-FR")} €` : "—",
    airbnbOk: row.airbnb_ok,
    docsOk: row.docs_ok,
    licenseNumber: row.license_number ?? undefined,
    licenseObtainedDate: row.license_obtained_date ?? undefined,
    licenseExpiryDate: row.license_expiry_date ?? undefined,
    tags: (tagRows ?? [])
      .filter((t: any) => t.property_id === row.id)
      .map((t: any) => ({
        label: t.label as string,
        ok: t.variant === "ok" ? true : undefined,
        warn: t.variant === "warn" ? true : undefined,
        err: t.variant === "err" ? true : undefined,
      })),
  }));

  const propertyIds = propRows.map((p) => p.id);

  const [{ data: taskRows }, { data: categoryRows }] = await Promise.all([
    propertyIds.length
      ? supabase.from("gestion_tasks").select("*").eq("user_id", userId)
      : Promise.resolve({ data: [] as any[] }),
    propertyIds.length
      ? supabase.from("conformite_categories").select("*").in("property_id", propertyIds).order("sort_order")
      : Promise.resolve({ data: [] as any[] }),
  ]);

  const categoryIds = (categoryRows ?? []).map((c: any) => c.id);
  const { data: itemRows } = categoryIds.length
    ? await supabase.from("conformite_items").select("*").in("category_id", categoryIds).order("sort_order")
    : { data: [] as any[] };

  const gestionTasks: GestionTask[] = (taskRows ?? []).map((row: any) => ({
    id: row.id,
    propertyId: dbIdToIndex.get(row.property_id) ?? -1,
    cat: row.cat,
    urgency: row.urgency,
    title: row.title,
    subLabel: row.sub_label,
    nextAction: row.next_action,
    deadline: row.deadline,
    explanation: row.explanation,
    docs: row.docs ?? [],
    platforms: row.platforms ?? [],
  }));

  const completedGestion: Record<string, boolean> = {};
  for (const row of taskRows ?? []) {
    if ((row as any).completed) completedGestion[(row as any).id] = true;
  }

  const conformiteByProperty: Record<number, ConformiteCategory[]> = {};
  for (const cat of categoryRows ?? []) {
    const propIndex = dbIdToIndex.get((cat as any).property_id);
    if (propIndex === undefined) continue;
    const category: ConformiteCategory = {
      id: (cat as any).id,
      title: (cat as any).title,
      items: (itemRows ?? [])
        .filter((it: any) => it.category_id === (cat as any).id)
        .map((it: any) => ({
          id: it.id,
          label: it.label,
          description: it.description,
          status: it.status,
          hasExpiry: it.has_expiry,
          expiryDate: it.expiry_date ?? undefined,
        })),
    };
    conformiteByProperty[propIndex] = [...(conformiteByProperty[propIndex] ?? []), category];
  }

  const profile: ProfileData = profileRow
    ? {
        onboardingComplete: profileRow.onboarding_complete,
        nationality: (profileRow.nationality as Nationality) ?? null,
        fiscalRes: (profileRow.fiscal_res as FiscalRes) ?? null,
        propStatus: (profileRow.prop_status as PropStatus) ?? null,
        reminderDelay: profileRow.reminder_delay_months,
        lang: (profileRow.lang as "fr" | "es") ?? "fr",
      }
    : {
        onboardingComplete: false,
        nationality: null,
        fiscalRes: null,
        propStatus: null,
        reminderDelay: 3,
        lang: "fr",
      };

  return { profile, properties, gestionTasks, completedGestion, conformiteByProperty };
}

export async function persistProfile(
  userId: string,
  profile: {
    onboardingComplete: boolean;
    nationality: Nationality;
    fiscalRes: FiscalRes;
    propStatus: PropStatus;
    reminderDelay: number;
    lang: "fr" | "es";
  }
) {
  const { error } = await supabase.from("profiles").upsert({
    user_id: userId,
    onboarding_complete: profile.onboardingComplete,
    nationality: profile.nationality,
    fiscal_res: profile.fiscalRes,
    prop_status: profile.propStatus,
    reminder_delay_months: profile.reminderDelay,
    lang: profile.lang,
  });
  if (error) throw error;
}

export async function insertProperty(
  userId: string,
  input: { name: string; location: string; region: string; type: string }
): Promise<{ dbId: string; categories: ConformiteCategory[] }> {
  const { data: propRow, error: propError } = await supabase
    .from("properties")
    .insert({
      user_id: userId,
      name: input.name,
      location: input.location,
      region: input.region,
      type: input.type,
      pct: 0,
      status: "pending",
    })
    .select()
    .single();
  if (propError || !propRow) throw propError ?? new Error("Property insert failed");

  await supabase.from("property_tags").insert({
    property_id: propRow.id,
    label: "Conformité à démarrer",
    variant: "warn",
  });

  const template = defaultConformiteTemplate();
  const categories: ConformiteCategory[] = [];

  for (let i = 0; i < template.length; i++) {
    const cat = template[i];
    const { data: catRow, error: catError } = await supabase
      .from("conformite_categories")
      .insert({ property_id: propRow.id, title: cat.title, sort_order: i })
      .select()
      .single();
    if (catError || !catRow) throw catError ?? new Error("Category insert failed");

    const itemsToInsert = cat.items.map((item, idx) => ({
      category_id: catRow.id,
      label: item.label,
      description: item.description,
      status: "missing" as const,
      has_expiry: !!item.hasExpiry,
      sort_order: idx,
    }));
    const { data: itemRows, error: itemError } = await supabase
      .from("conformite_items")
      .insert(itemsToInsert)
      .select();
    if (itemError) throw itemError;

    categories.push({
      id: catRow.id,
      title: catRow.title,
      items: (itemRows ?? []).map((it) => ({
        id: it.id,
        label: it.label,
        description: it.description,
        status: it.status as "done" | "progress" | "missing",
        hasExpiry: it.has_expiry,
        expiryDate: it.expiry_date ?? undefined,
      })),
    });
  }

  return { dbId: propRow.id, categories };
}

export async function setTaskCompleted(taskDbId: string, completed: boolean) {
  const { error } = await supabase.from("gestion_tasks").update({ completed }).eq("id", taskDbId);
  if (error) throw error;
}
