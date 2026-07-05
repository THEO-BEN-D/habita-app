"use client";

import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { IconChevronRight, IconShield } from "@/components/icons";

export default function Page() {
  const properties = useAppStore((s) => s.properties);
  const goToConformite = useAppStore((s) => s.goToConformite);
  const router = useRouter();

  function open(id: number) {
    goToConformite(id, "list");
    router.push(`/conformite/${id}`);
  }

  return (
    <div className="max-w-[720px] flex flex-col gap-3">
      <p className="text-[13px] text-ink-30 mb-1">Sélectionnez un bien pour voir sa checklist de conformité.</p>
      {properties.map((p) => (
        <button
          key={p.id}
          onClick={() => open(p.id)}
          className="w-full bg-white border border-border rounded-card p-5 flex items-center gap-4 hover:bg-sand text-left"
        >
          <span className="w-9 h-9 rounded-lg bg-brand-lt flex items-center justify-center shrink-0">
            <IconShield width={17} height={17} className="text-brand" />
          </span>
          <div className="flex-1">
            <div className="font-display font-bold text-[14px]">{p.name}</div>
            <div className="text-[12px] text-ink-30 mt-0.5">{p.pct}% de conformité complétée</div>
          </div>
          <IconChevronRight width={16} height={16} className="text-ink-30" />
        </button>
      ))}
    </div>
  );
}
