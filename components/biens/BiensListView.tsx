"use client";

import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import PropertyCard from "./PropertyCard";
import AddPropertyModal from "./AddPropertyModal";

export default function BiensListView() {
  const properties = useAppStore((s) => s.properties);
  const goToPropHub = useAppStore((s) => s.goToPropHub);
  const openAddPropModal = useAppStore((s) => s.openAddPropModal);
  const router = useRouter();

  function openProperty(id: number) {
    goToPropHub(id, "list");
    router.push(`/biens/${id}`);
  }

  return (
    <div className="max-w-[880px] flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-ink-30">{properties.length} bien(s) géré(s)</span>
        <button
          onClick={openAddPropModal}
          className="px-4 py-2.5 rounded-[9px] bg-brand text-white text-[13px] font-semibold hover:bg-brand-dk"
        >
          + Ajouter un bien
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {properties.map((p) => (
          <PropertyCard key={p.id} property={p} onClick={() => openProperty(p.id)} />
        ))}
      </div>

      <AddPropertyModal />
    </div>
  );
}
