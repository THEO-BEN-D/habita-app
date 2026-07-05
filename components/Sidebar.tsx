"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { supabase } from "@/lib/supabase/client";
import {
  IconHouse,
  IconBuilding,
  IconClipboard,
  IconShield,
  IconCalendar,
  IconUsers,
  IconReceipt,
  IconHelp,
} from "./icons";

const NAV = [
  { id: "dashboard", label: "Dashboard", href: "/", Icon: IconHouse, group: "biens" },
  { id: "biens", label: "Mes biens", href: "/biens", Icon: IconBuilding, group: "biens" },
  { id: "gestion", label: "Gestion opérationnelle", href: "/gestion", Icon: IconClipboard, group: "gestion" },
  { id: "conformite", label: "Conformité & docs", href: "/conformite", Icon: IconShield, group: "gestion" },
  { id: "calendrier", label: "Calendrier", href: "/calendrier", Icon: IconCalendar, group: "gestion" },
  { id: "voyageurs", label: "Voyageurs", href: "/voyageurs", Icon: IconUsers, group: "gestion" },
  { id: "fiscalite", label: "Fiscalité", href: "/fiscalite", Icon: IconReceipt, group: "gestion" },
  { id: "aide", label: "Aide & experts", href: "/aide", Icon: IconHelp, group: "aide" },
];

function activeGroup(pathname: string): string {
  if (pathname === "/" || pathname.startsWith("/biens")) return "biens";
  if (
    pathname.startsWith("/gestion") ||
    pathname.startsWith("/conformite") ||
    pathname.startsWith("/calendrier") ||
    pathname.startsWith("/voyageurs") ||
    pathname.startsWith("/fiscalite")
  )
    return "gestion";
  if (pathname.startsWith("/aide")) return "aide";
  return "biens";
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const properties = useAppStore((s) => s.properties);
  const goToPropHub = useAppStore((s) => s.goToPropHub);
  const group = activeGroup(pathname || "/");

  function jumpToProperty(id: number) {
    goToPropHub(id, "list");
    router.push(`/biens/${id}`);
  }

  return (
    <aside className="w-[220px] shrink-0 bg-ink flex flex-col h-full">
      <div className="flex items-center gap-2.5 px-5 py-6">
        <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center shrink-0">
          <IconHouse className="w-4.5 h-4.5 text-white" width={18} height={18} />
        </div>
        <span className="font-display font-bold text-white text-lg tracking-tight">Habita</span>
      </div>

      <nav className="flex-1 px-3 flex flex-col gap-0.5 overflow-y-auto">
        {NAV.map(({ id, label, href, Icon, group: itemGroup }) => {
          const active = itemGroup === group;
          return (
            <Link
              key={id}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${
                active ? "bg-brand text-white" : "text-white/45 hover:bg-white/[.08] hover:text-white/70"
              }`}
            >
              <Icon width={16} height={16} className="shrink-0" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {properties.length > 0 && (
        <div className="px-3 pb-5 pt-3 border-t border-white/10 mt-2">
          <div className="px-3 pb-2 text-[10px] uppercase tracking-wide text-white/30 font-semibold">
            Biens
          </div>
          <div className="flex flex-col gap-0.5">
            {properties.map((p) => (
              <button
                key={p.id}
                onClick={() => jumpToProperty(p.id)}
                className="text-left px-3 py-1.5 rounded-md text-[12px] text-white/50 hover:bg-white/[.08] hover:text-white/80 truncate"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="px-3 pb-5">
        <button
          onClick={() => supabase.auth.signOut()}
          className="w-full text-left px-3 py-2 rounded-md text-[12px] text-white/40 hover:bg-white/[.08] hover:text-white/70"
        >
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}
