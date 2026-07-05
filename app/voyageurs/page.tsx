"use client";

import { useAppStore } from "@/store/useAppStore";

export default function Page() {
  const properties = useAppStore((s) => s.properties);

  return (
    <div className="max-w-[720px] flex flex-col gap-3">
      <div className="bg-white border border-border rounded-card p-5 text-[13px] text-ink-50">
        Suivi des voyageurs (registre SES / Registre Únic) — à connecter aux réservations de chaque bien.
      </div>
      {properties.map((p) => (
        <div key={p.id} className="bg-white border border-border rounded-card p-4 flex items-center justify-between">
          <span className="font-display font-bold text-[13px]">{p.name}</span>
          <span className="text-[12px] text-ink-30">
            {p.status === "active" ? "Registre à jour" : "En attente de conformité"}
          </span>
        </div>
      ))}
    </div>
  );
}
