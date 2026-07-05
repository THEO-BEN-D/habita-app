"use client";

import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import CalendarView from "@/components/calendrier/CalendarView";

export default function Page() {
  const properties = useAppStore((s) => s.properties);
  const [selected, setSelected] = useState<number | null>(properties[0]?.id ?? null);

  if (properties.length === 0) {
    return <div className="text-[13px] text-ink-30">Ajoutez un bien pour voir son calendrier.</div>;
  }

  const property = properties.find((p) => p.id === selected) ?? properties[0];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-2">
        {properties.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelected(p.id)}
            className={`px-3.5 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${
              property.id === p.id ? "bg-ink text-white" : "bg-white border border-border text-ink-50"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>
      <CalendarView property={property} />
    </div>
  );
}
