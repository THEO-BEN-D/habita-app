"use client";

import { Property } from "@/store/types";

function barColor(pct: number) {
  if (pct >= 80) return "bg-ok";
  if (pct >= 55) return "bg-warn";
  return "bg-err";
}
function dotColor(status: Property["status"], pct: number) {
  if (status === "pending") return pct === 0 ? "bg-err" : "bg-warn";
  return "bg-ok";
}

export default function PropertyCard({ property, onClick }: { property: Property; onClick: () => void }) {
  const pendingSteps = Math.max(0, Math.round((100 - property.pct) / 20));

  return (
    <button
      onClick={onClick}
      className="w-full bg-white border border-border rounded-card p-5 flex items-center gap-5 hover:shadow-[0_4px_16px_rgba(30,24,20,.06)] transition-shadow text-left"
    >
      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${dotColor(property.status, property.pct)}`} />
      <div className="flex-1 min-w-0">
        <div className="font-display font-bold text-[15px] truncate">{property.name}</div>
        <div className="text-[12px] text-ink-30 mt-0.5">{property.location}</div>
        <div className="flex items-center gap-2 mt-2.5">
          <div className="flex-1 h-1.5 bg-border-lt rounded-full overflow-hidden max-w-[180px]">
            <div
              className={`h-full ${barColor(property.pct)} transition-[width] duration-300`}
              style={{ width: `${property.pct}%` }}
            />
          </div>
          <span className="text-[11px] font-mono text-ink-50">{property.pct}%</span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1.5 shrink-0 text-right">
        <span className="text-[11px] text-ink-30">
          {property.pct < 100 ? `${pendingSteps} étape(s) restante(s)` : "Conformité complète"}
        </span>
        <span
          className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${
            property.airbnbOk ? "bg-ok-lt text-ok" : "bg-border-lt text-ink-30"
          }`}
        >
          {property.airbnbOk ? "Airbnb en ligne" : "Airbnb hors ligne"}
        </span>
      </div>
    </button>
  );
}
