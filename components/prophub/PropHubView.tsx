"use client";

import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { Property, PropHubTab } from "@/store/types";
import { IconChevronLeft } from "../icons";
import ConformiteView from "../conformite/ConformiteView";

const TABS: { id: PropHubTab; label: string }[] = [
  { id: "overview", label: "Vue d'ensemble" },
  { id: "checklist", label: "Checklist & conformité" },
  { id: "documents", label: "Documents" },
  { id: "calendrier", label: "Calendrier" },
  { id: "finances", label: "Finances" },
];

export default function PropHubView({ property }: { property: Property }) {
  const tab = useAppStore((s) => s.tab);
  const setTab = useAppStore((s) => s.setTab);
  const goToBiens = useAppStore((s) => s.goToBiens);
  const goToGestion = useAppStore((s) => s.goToGestion);
  const router = useRouter();

  function back() {
    goToBiens();
    router.push("/biens");
  }

  function onTabClick(t: PropHubTab) {
    setTab(t);
    if (t === "calendrier") {
      router.push(`/biens/${property.id}/calendrier`);
    } else if (t === "checklist") {
      router.push(`/biens/${property.id}/conformite`);
    }
  }

  return (
    <div className="max-w-[880px] flex flex-col gap-5">
      <button onClick={back} className="flex items-center gap-1.5 text-[13px] text-ink-50 hover:text-ink w-fit">
        <IconChevronLeft width={16} height={16} />
        Mes biens
      </button>

      <div className="bg-white border border-border rounded-card p-6 flex items-center justify-between">
        <div>
          <div className="font-display font-bold text-[20px]">{property.name}</div>
          <div className="text-[13px] text-ink-30 mt-1">{property.location}</div>
        </div>
        <div className="flex gap-2">
          <span
            className={`text-[11px] px-2.5 py-1 rounded-md font-medium ${
              property.status === "active" ? "bg-ok-lt text-ok" : "bg-warn-lt text-warn"
            }`}
          >
            {property.status === "active" ? "Actif" : "En attente"}
          </span>
          <span className="text-[11px] px-2.5 py-1 rounded-md font-medium bg-border-lt text-ink-50">
            {property.pct}% conformité
          </span>
        </div>
      </div>

      <div className="flex gap-1 border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => onTabClick(t.id)}
            className={`px-4 py-2.5 text-[13px] font-medium border-b-2 -mb-px transition-colors ${
              tab === t.id ? "border-brand text-brand" : "border-transparent text-ink-30 hover:text-ink-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid grid-cols-3 gap-4">
          <InfoCard label="Revenus" value={property.income} />
          <InfoCard label="Type" value={property.type || "—"} />
          <InfoCard label="Région" value={property.region || "—"} />
        </div>
      )}

      {tab === "checklist" && <ConformiteView property={property} />}

      {tab === "documents" && (
        <div className="bg-white border border-border rounded-card p-6 text-[13px] text-ink-50">
          Les documents de conformité sont gérés depuis l&apos;onglet Checklist &amp; conformité.
        </div>
      )}

      {tab === "finances" && (
        <div className="bg-white border border-border rounded-card p-6 text-[13px] text-ink-50">
          Revenus du mois : <strong className="text-ink">{property.income}</strong>
        </div>
      )}

      <div className="pt-2">
        <button
          onClick={() => {
            goToGestion(property.id);
            router.push("/gestion");
          }}
          className="text-[13px] text-brand font-medium hover:underline"
        >
          Voir les tâches de gestion de ce bien →
        </button>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-border rounded-card p-4">
      <div className="text-[11px] uppercase tracking-wide text-ink-30 font-semibold">{label}</div>
      <div className="text-[14px] font-medium mt-1">{value}</div>
    </div>
  );
}
