"use client";

import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { isLocked, urgencyLabel, urgencyOf, visibleTasks } from "@/store/gestionSelectors";
import { GestionTask, Urgency } from "@/store/types";
import { PropertyBadge, UrgencyBadge } from "../shared/UrgencyDot";
import { IconChevronLeft, IconClipboard, IconLock } from "../icons";
import TaskDetailModal from "./TaskDetailModal";

const URGENCY_ORDER: Urgency[] = ["urgent", "warn", "ok"];
const URGENCY_BORDER: Record<Urgency, string> = {
  urgent: "border-l-err",
  warn: "border-l-warn",
  ok: "border-l-ok",
};
const URGENCY_TEXT: Record<Urgency, string> = {
  urgent: "text-err",
  warn: "text-warn",
  ok: "text-ok",
};

export default function GestionView() {
  const properties = useAppStore((s) => s.properties);
  const obFiscalRes = useAppStore((s) => s.obFiscalRes);
  const gestionTasks = useAppStore((s) => s.gestionTasks);
  const gestionSort = useAppStore((s) => s.gestionSort);
  const setGestionSort = useAppStore((s) => s.setGestionSort);
  const gestionFilter = useAppStore((s) => s.gestionFilter);
  const goToGestion = useAppStore((s) => s.goToGestion);
  const completedGestion = useAppStore((s) => s.completedGestion);
  const expandedGestion = useAppStore((s) => s.expandedGestion);
  const setExpandedGestion = useAppStore((s) => s.setExpandedGestion);
  const router = useRouter();

  const tasks = visibleTasks(obFiscalRes, gestionTasks).filter(
    (t) => gestionFilter === null || t.propertyId === gestionFilter
  );

  const filteredProperty = gestionFilter !== null ? properties.find((p) => p.id === gestionFilter) : null;

  function openTask(task: GestionTask) {
    const property = properties.find((p) => p.id === task.propertyId);
    if (property && isLocked(property)) {
      router.push(`/biens/${property.id}/conformite`);
      return;
    }
    setExpandedGestion(task.id);
  }

  function backToPropHub() {
    if (filteredProperty) {
      goToGestion(null);
      router.push(`/biens/${filteredProperty.id}`);
    }
  }

  const activeTask = tasks.find((t) => t.id === expandedGestion);
  const activeProperty = activeTask ? properties.find((p) => p.id === activeTask.propertyId) : undefined;

  return (
    <div className="max-w-[920px] flex flex-col gap-5">
      {filteredProperty && (
        <button onClick={backToPropHub} className="flex items-center gap-1.5 text-[13px] text-ink-50 hover:text-ink w-fit">
          <IconChevronLeft width={16} height={16} />
          {filteredProperty.name}
        </button>
      )}

      <div className="flex items-center gap-2">
        <ToggleButton active={gestionSort === "urgency"} onClick={() => setGestionSort("urgency")}>
          Par urgence
        </ToggleButton>
        <ToggleButton active={gestionSort === "property"} onClick={() => setGestionSort("property")}>
          Par bien
        </ToggleButton>
      </div>

      {gestionSort === "urgency"
        ? URGENCY_ORDER.map((urg) => {
            const group = tasks.filter((t) => urgencyOf(t, completedGestion) === urg);
            if (group.length === 0) return null;
            const byProperty = groupBy(group, (t) => t.propertyId);
            return (
              <Group key={urg} title={urgencyLabel(urg)} accent={URGENCY_TEXT[urg]}>
                {Object.entries(byProperty).map(([pid, list]) => {
                  const property = properties.find((p) => p.id === Number(pid));
                  return (
                    <SubSection key={pid} label={property?.name ?? "—"}>
                      {list.map((t) => (
                        <TaskCard
                          key={t.id}
                          task={t}
                          property={property}
                          locked={!!property && isLocked(property)}
                          done={!!completedGestion[t.id]}
                          onClick={() => openTask(t)}
                        />
                      ))}
                    </SubSection>
                  );
                })}
              </Group>
            );
          })
        : Object.entries(groupBy(tasks, (t) => t.propertyId)).map(([pid, list]) => {
            const property = properties.find((p) => p.id === Number(pid));
            const byUrgency = groupBy(list, (t) => urgencyOf(t, completedGestion));
            return (
              <Group key={pid} title={property?.name ?? "—"} icon>
                {URGENCY_ORDER.map((urg) => {
                  const sub = byUrgency[urg];
                  if (!sub || sub.length === 0) return null;
                  return (
                    <SubSection key={urg} label={urgencyLabel(urg)}>
                      {sub.map((t) => (
                        <TaskCard
                          key={t.id}
                          task={t}
                          property={property}
                          locked={!!property && isLocked(property)}
                          done={!!completedGestion[t.id]}
                          onClick={() => openTask(t)}
                        />
                      ))}
                    </SubSection>
                  );
                })}
              </Group>
            );
          })}

      {activeTask && (
        <TaskDetailModal task={activeTask} property={activeProperty} onClose={() => setExpandedGestion(null)} />
      )}
    </div>
  );
}

function groupBy<T, K extends string | number>(arr: T[], keyFn: (t: T) => K): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const key = String(keyFn(item));
    acc[key] = acc[key] ?? [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

function ToggleButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${
        active ? "bg-ink text-white" : "bg-white border border-border text-ink-50 hover:border-ink-30"
      }`}
    >
      {children}
    </button>
  );
}

function Group({
  title,
  accent,
  icon,
  children,
}: {
  title: string;
  accent?: string;
  icon?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        {icon && <IconClipboard width={14} height={14} className="text-ink-30" />}
        <h3 className={`font-display font-bold text-[13px] ${accent ?? "text-ink"}`}>{title}</h3>
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

function SubSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 pl-3 border-l border-border-lt">
      <div className="text-[11px] text-ink-30 font-medium">{label}</div>
      {children}
    </div>
  );
}

function TaskCard({
  task,
  property,
  locked,
  done,
  onClick,
}: {
  task: GestionTask;
  property?: { name: string };
  locked: boolean;
  done: boolean;
  onClick: () => void;
}) {
  const urgency: Urgency = done ? "ok" : task.urgency;
  return (
    <button
      onClick={onClick}
      className={`w-full bg-white border border-border border-l-[3px] ${URGENCY_BORDER[urgency]} rounded-card p-4 flex items-center gap-4 text-left transition-opacity ${
        locked ? "opacity-65" : "hover:shadow-[0_4px_16px_rgba(30,24,20,.06)]"
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          {property && <PropertyBadge name={property.name} />}
          <UrgencyBadge urgency={urgency} />
        </div>
        <div className={`font-display font-bold text-[13px] ${done ? "line-through text-ink-30" : ""}`}>
          {task.title}
        </div>
        <div className="text-[12px] text-ink-30 mt-0.5">{task.subLabel}</div>
        {!locked && <div className="text-[12px] text-ink-50 mt-1">{task.nextAction}</div>}
      </div>
      {locked ? (
        <div className="flex items-center gap-1.5 text-[12px] font-medium text-warn shrink-0">
          <IconLock width={13} height={13} />
          Finaliser la conformité →
        </div>
      ) : (
        <span className={`font-mono text-[12px] shrink-0 ${URGENCY_TEXT[urgency]}`}>{task.deadline}</span>
      )}
    </button>
  );
}
