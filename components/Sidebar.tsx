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
  { id: "dashboard", label: "Dashboard", href: "/", Icon: IconHouse },
  { id: "biens", label: "Mes biens", href: "/biens", Icon: IconBuilding },
  { id: "gestion", label: "Gestion opérationnelle", href: "/gestion", Icon: IconClipboard },
  { id: "conformite", label: "Conformité & docs", href: "/conformite", Icon: IconShield },
  { id: "calendrier", label: "Calendrier", href: "/calendrier", Icon: IconCalendar },
  { id: "voyageurs", label: "Voyageurs", href: "/voyageurs", Icon: IconUsers },
  { id: "fiscalite", label: "Fiscalité", href: "/fiscalite", Icon: IconReceipt },
  { id: "aide", label: "Aide & experts", href: "/aide", Icon: IconHelp },
];

// Only ONE nav item should ever be highlighted — the one that owns the
// current route. Sub-routes reached through a property (e.g. /biens/3/conformite)
// belong to that specific section, not to "Mes biens", so check the most
// specific patterns first.
function activeNavId(pathname: string): string {
  if (/^\/biens\/[^/]+\/conformite/.test(pathname)) return "conformite";
  if (/^\/biens\/[^/]+\/calendrier/.test(pathname)) return "calendrier";
  if (pathname === "/") return "dashboard";
  if (pathname.startsWith("/biens")) return "biens";
  if (pathname.startsWith("/conformite")) return "conformite";
  if (pathname.startsWith("/calendrier")) return "calendrier";
  if (pathname.startsWith("/gestion")) return "gestion";
  if (pathname.startsWith("/voyageurs")) return "voyageurs";
  if (pathname.startsWith("/fiscalite")) return "fiscalite";
  if (pathname.startsWith("/aide")) return "aide";
  return "dashboard";
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const properties = useAppStore((s) => s.properties);
  const goToPropHub = useAppStore((s) => s.goToPropHub);
  const activeId = activeNavId(pathname || "/");

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
        {NAV.map(({ id, label, href, Icon }) => {
          const active = id === activeId;
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
