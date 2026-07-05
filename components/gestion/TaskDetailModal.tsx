"use client";

import { useAppStore } from "@/store/useAppStore";
import { GestionTask, Property } from "@/store/types";
import { PropertyBadge, UrgencyBadge } from "../shared/UrgencyDot";
import { IconExternalLink, IconFile, IconX } from "../icons";
import { urgencyOf } from "@/store/gestionSelectors";

export default function TaskDetailModal({
  task,
  property,
  onClose,
}: {
  task: GestionTask;
  property?: Property;
  onClose: () => void;
}) {
  const completedGestion = useAppStore((s) => s.completedGestion);
  const toggleGestionDone = useAppStore((s) => s.toggleGestionDone);
  const done = !!completedGestion[task.id];
  const urgency = urgencyOf(task, completedGestion);

  return (
    <div className="fixed inset-0 z-[999] bg-ink-30 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-modal shadow-modal w-full max-w-[520px] max-h-[85vh] overflow-y-auto animate-slide-up">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border-lt">
          <div className="flex items-center gap-2">
            {property && <PropertyBadge name={property.name} />}
            <UrgencyBadge urgency={urgency} />
          </div>
          <button onClick={onClose} className="text-ink-30 hover:text-ink">
            <IconX width={18} height={18} />
          </button>
        </div>

        <div className="px-6 pt-5">
          <h3 className="font-display font-bold text-[18px]">{task.title}</h3>
          <p className="text-[13px] text-ink-30 mt-1">{task.subLabel}</p>
          <p className="font-mono text-[12px] text-ink-50 mt-2">Échéance : {task.deadline}</p>
        </div>

        <div className="h-px bg-border-lt my-5" />

        <div className="px-6 flex flex-col gap-5">
          {task.explanation && (
            <p className="text-[13px] leading-[1.75] text-ink-80">{task.explanation}</p>
          )}

          {task.docs.length > 0 && (
            <div>
              <div className="text-[11px] uppercase tracking-wide text-ink-30 font-semibold mb-2">
                Documents officiels
              </div>
              <div className="flex flex-col gap-1.5">
                {task.docs.map((d) => (
                  <div key={d.label} className="flex items-center gap-2 text-[13px] text-ink-80">
                    <IconFile width={14} height={14} className="text-ink-30 shrink-0" />
                    <span className="flex-1">{d.label}</span>
                    {d.flagged && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-warn-lt text-warn border border-warn-bd">
                        URL à vérifier
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {task.platforms.length > 0 && (
            <div>
              <div className="text-[11px] uppercase tracking-wide text-ink-30 font-semibold mb-2">
                Plateformes officielles
              </div>
              <div className="flex flex-col gap-1.5">
                {task.platforms.map((p) => (
                  <a
                    key={p.label}
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-[13px] text-brand hover:underline"
                  >
                    <IconExternalLink width={14} height={14} className="shrink-0" />
                    {p.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-5 mt-4">
          <button
            onClick={() => toggleGestionDone(task.id)}
            className={`w-full py-2.5 rounded-[9px] text-[13px] font-semibold transition-colors ${
              done ? "bg-ok text-white" : "bg-brand text-white hover:bg-brand-dk"
            }`}
          >
            {done ? "✓ Terminé" : "Marquer comme terminé"}
          </button>
        </div>
      </div>
    </div>
  );
}
