import { Urgency } from "@/store/types";

const COLORS: Record<Urgency, string> = {
  urgent: "bg-err",
  warn: "bg-warn",
  ok: "bg-ok",
};

export default function UrgencyDot({ urgency, className = "" }: { urgency: Urgency; className?: string }) {
  return <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${COLORS[urgency]} ${className}`} />;
}

export function PropertyBadge({ name }: { name: string }) {
  return (
    <span className="px-2 py-0.5 rounded-md bg-ink text-white text-[10px] font-medium whitespace-nowrap">
      {name}
    </span>
  );
}

export function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  const labels: Record<Urgency, string> = { urgent: "Urgent", warn: "À faire", ok: "À jour" };
  const styles: Record<Urgency, string> = {
    urgent: "bg-err-lt text-err border-err-bd",
    warn: "bg-warn-lt text-warn border-warn-bd",
    ok: "bg-ok-lt text-ok border-ok-bd",
  };
  return (
    <span className={`px-2 py-0.5 rounded-md border text-[10px] font-semibold ${styles[urgency]}`}>
      {labels[urgency]}
    </span>
  );
}
