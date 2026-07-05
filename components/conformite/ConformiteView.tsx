"use client";

import { useState } from "react";
import { Property } from "@/store/types";
import { useAppStore } from "@/store/useAppStore";
import { IconCheck, IconChevronDown, IconUpload, IconX } from "../icons";

function StatusIcon({ status }: { status: "done" | "progress" | "missing" }) {
  if (status === "done")
    return (
      <span className="w-5 h-5 rounded-full bg-ok-lt border border-ok-bd flex items-center justify-center shrink-0">
        <IconCheck width={11} height={11} className="text-ok" />
      </span>
    );
  if (status === "progress")
    return <span className="w-5 h-5 rounded-full border-2 border-warn shrink-0" />;
  return (
    <span className="w-5 h-5 rounded-full bg-err-lt border border-err-bd flex items-center justify-center shrink-0">
      <IconX width={11} height={11} className="text-err" />
    </span>
  );
}

export default function ConformiteView({ property }: { property: Property }) {
  const categories = useAppStore((s) => s.conformiteByProperty[property.id] ?? []);
  const [open, setOpen] = useState<string | null>(categories[0]?.id ?? null);

  return (
    <div className="max-w-[720px] flex flex-col gap-3">
      {categories.map((cat, i) => {
        const isOpen = open === cat.id;
        return (
          <div key={cat.id} className="bg-white border border-border rounded-card overflow-hidden">
            <button
              onClick={() => setOpen(isOpen ? null : cat.id)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-sand"
            >
              <div className="flex items-center gap-3">
                <span className="w-6.5 h-6.5 rounded-full bg-brand-lt text-brand text-[12px] font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="font-display font-bold text-[14px]">{cat.title}</span>
              </div>
              <IconChevronDown
                width={16}
                height={16}
                className={`text-ink-30 transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-5 flex flex-col gap-4 border-t border-border-lt pt-4">
                {cat.items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <StatusIcon status={item.status} />
                    <div className="flex-1">
                      <div className="text-[13px] font-medium">{item.label}</div>
                      <div className="text-[12px] text-ink-30 mt-0.5">{item.description}</div>
                      <div className="flex items-center gap-3 mt-2">
                        {item.status !== "done" && (
                          <button className="flex items-center gap-1.5 text-[11px] text-brand border border-brand-mid bg-brand-lt rounded-md px-2.5 py-1">
                            <IconUpload width={12} height={12} />
                            Ajouter un document
                          </button>
                        )}
                        {item.obtainedDate && (
                          <span className="font-mono text-[11px] text-ink-50">
                            Obtenu le {item.obtainedDate}
                          </span>
                        )}
                        {item.hasExpiry && (
                          <span className="font-mono text-[11px] text-ink-50">
                            Expire le {item.expiryDate ?? "—"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
