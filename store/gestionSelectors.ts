import { GestionTask, Property, Urgency } from "./types";

// Tasks now come from the `gestion_tasks` table (per-user, via store.gestionTasks) —
// there is no static seed list anymore. Callers must pass their own task array.
export function visibleTasks(fiscalRes: string | null, tasks: GestionTask[]) {
  return tasks.filter((t) => (fiscalRes === "FR" ? true : t.cat !== "Fiscalité française"));
}

export function urgencyLabel(u: Urgency) {
  return u === "urgent" ? "Urgent" : u === "warn" ? "À faire" : "À jour";
}

export function urgencyOf(task: GestionTask, completed: Record<string, boolean>): Urgency {
  if (completed[task.id]) return "ok";
  return task.urgency;
}

export function isLocked(property: Property) {
  return property.status === "pending";
}
