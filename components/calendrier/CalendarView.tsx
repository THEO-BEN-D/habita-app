"use client";

import { Property } from "@/store/types";

const MONTH_LABEL = "Juillet 2026";
const DAYS_IN_MONTH = 31;
const START_WEEKDAY = 3; // 1 juillet 2026 is a Wednesday (0 = Monday)

// Deterministic mock occupancy so the calendar has something to look at.
function isBooked(day: number, seed: number) {
  return (day + seed * 3) % 7 < 3;
}

export default function CalendarView({ property }: { property: Property }) {
  const cells: (number | null)[] = [
    ...Array(START_WEEKDAY).fill(null),
    ...Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1),
  ];

  return (
    <div className="max-w-[720px] flex flex-col gap-4">
      <div className="bg-white border border-border rounded-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-[15px]">{MONTH_LABEL}</h3>
          <div className="flex items-center gap-3 text-[11px] text-ink-50">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand" /> Réservé
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-border" /> Libre
            </span>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] text-ink-30 mb-2">
          {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
            <div key={i}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {cells.map((day, i) => (
            <div
              key={i}
              className={`aspect-square rounded-md flex items-center justify-center text-[11px] font-mono ${
                day === null
                  ? ""
                  : isBooked(day, property.id)
                  ? "bg-brand text-white"
                  : "bg-border-lt text-ink-50"
              }`}
            >
              {day ?? ""}
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white border border-border rounded-card p-5 text-[13px] text-ink-50">
        Taux d&apos;occupation estimé ce mois-ci pour <strong className="text-ink">{property.name}</strong> : ~60%.
      </div>
    </div>
  );
}
