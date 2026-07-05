"use client";

import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { urgencyOf, visibleTasks } from "@/store/gestionSelectors";
import UrgencyDot, { PropertyBadge } from "../shared/UrgencyDot";
import { IconChevronRight } from "../icons";

function parseIncome(income: string) {
  const n = income.replace(/[^\d]/g, "");
  return n ? parseInt(n, 10) : 0;
}

export default function DashboardView() {
  const properties = useAppStore((s) => s.properties);
  const obFiscalRes = useAppStore((s) => s.obFiscalRes);
  const gestionTasks = useAppStore((s) => s.gestionTasks);
  const completedGestion = useAppStore((s) => s.completedGestion);
  const setExpandedGestion = useAppStore((s) => s.setExpandedGestion);
  const goToGestion = useAppStore((s) => s.goToGestion);
  const router = useRouter();

  const tasks = visibleTasks(obFiscalRes, gestionTasks);
  const pendingDeclarations = tasks.filter((t) => !completedGestion[t.id] && t.urgency !== "ok").length;
  const totalRevenue = properties.reduce((sum, p) => sum + parseIncome(p.income), 0);
  const activeCount = properties.filter((p) => p.status === "active").length;
  const occupancy = properties.length ? Math.round((activeCount / properties.length) * 78) : 0;

  const upcoming = [...tasks]
    .filter((t) => !completedGestion[t.id])
    .sort((a, b) => (a.urgency === "urgent" ? -1 : b.urgency === "urgent" ? 1 : 0))
    .slice(0, 6);

  function openTask(taskId: string) {
    setExpandedGestion(taskId);
    goToGestion(null);
    router.push("/gestion");
  }

  return (
    <div className="flex flex-col gap-6 max-w-[880px]">
      <div className="grid grid-cols-2 gap-4">
        <KpiCard label="Biens gérés" value={String(properties.length)} />
        <KpiCard label="Revenus du mois" value={`${totalRevenue.toLocaleString("fr-FR")} €`} />
        <KpiCard label="Taux d'occupation" value={`${occupancy}%`} />
        <KpiCard label="Déclarations en attente" value={String(pendingDeclarations)} accent={pendingDeclarations > 0} />
      </div>

      <div className="bg-white border border-border rounded-card">
        <div className="px-5 py-4 border-b border-border-lt">
          <h2 className="font-display font-bold text-[15px]">Prochaines échéances</h2>
        </div>
        <div>
          {upcoming.length === 0 && (
            <div className="px-5 py-6 text-[13px] text-ink-30">Aucune échéance en attente. 🎉</div>
          )}
          {upcoming.map((t) => {
            const property = properties.find((p) => p.id === t.propertyId);
            const done = !!completedGestion[t.id];
            return (
              <button
                key={t.id}
                onClick={() => openTask(t.id)}
                className="w-full flex items-center gap-3 px-5 py-3 border-b border-border-lt last:border-b-0 hover:bg-sand text-left"
              >
                <UrgencyDot urgency={urgencyOf(t, completedGestion)} />
                <span className={`flex-1 text-[13px] ${done ? "line-through text-ink-30" : "text-ink-80"}`}>
                  {t.title}
                </span>
                {property && <PropertyBadge name={property.name} />}
                <span className="font-mono text-[11px] text-ink-50 whitespace-nowrap">{t.deadline}</span>
                <IconChevronRight width={14} height={14} className="text-ink-30 shrink-0" />
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white border border-border rounded-card p-5">
        <h2 className="font-display font-bold text-[15px] mb-3">Activité récente</h2>
        <div className="flex flex-col gap-2 text-[13px] text-ink-50">
          <div>• Onboarding complété — profil fiscal configuré.</div>
          {properties.map((p) => (
            <div key={p.id}>
              • {p.name} — conformité à {p.pct}%.
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-white border border-border rounded-card p-5">
      <div className="text-[11px] uppercase tracking-wide text-ink-30 font-semibold">{label}</div>
      <div className={`font-display font-bold text-[26px] mt-1.5 ${accent ? "text-warn" : "text-ink"}`}>{value}</div>
    </div>
  );
}
