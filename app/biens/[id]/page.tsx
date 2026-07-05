"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import PropHubView from "@/components/prophub/PropHubView";

export default function Page() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const properties = useAppStore((s) => s.properties);
  const activeProp = useAppStore((s) => s.activeProp);
  const goToPropHub = useAppStore((s) => s.goToPropHub);

  useEffect(() => {
    if (activeProp !== id) goToPropHub(id, "list");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const property = properties.find((p) => p.id === id);
  if (!property) return <div className="text-[13px] text-ink-30">Bien introuvable.</div>;

  return <PropHubView property={property} />;
}
