"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import ConformiteView from "@/components/conformite/ConformiteView";
import { IconChevronLeft } from "@/components/icons";

export default function Page() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const router = useRouter();
  const properties = useAppStore((s) => s.properties);
  const goToConformite = useAppStore((s) => s.goToConformite);

  useEffect(() => {
    goToConformite(id, "list");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const property = properties.find((p) => p.id === id);
  if (!property) return <div className="text-[13px] text-ink-30">Bien introuvable.</div>;

  return (
    <div className="flex flex-col gap-5">
      <button
        onClick={() => router.push("/conformite")}
        className="flex items-center gap-1.5 text-[13px] text-ink-50 hover:text-ink w-fit"
      >
        <IconChevronLeft width={16} height={16} />
        Conformité &amp; docs
      </button>
      <ConformiteView property={property} />
    </div>
  );
}
