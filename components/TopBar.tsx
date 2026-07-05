"use client";

import { usePathname } from "next/navigation";

const TITLES: { match: (p: string) => boolean; title: string; subtitle: string }[] = [
  { match: (p) => p === "/", title: "Dashboard", subtitle: "Vue d'ensemble de vos biens en Espagne" },
  { match: (p) => p === "/biens", title: "Mes biens", subtitle: "Tous vos biens gérés depuis un seul endroit" },
  { match: (p) => /^\/biens\/\d+$/.test(p), title: "Fiche du bien", subtitle: "Centre de commande de la propriété" },
  { match: (p) => /^\/biens\/\d+\/conformite$/.test(p), title: "Conformité & docs", subtitle: "Checklist réglementaire du bien" },
  { match: (p) => /^\/biens\/\d+\/calendrier$/.test(p), title: "Calendrier", subtitle: "Occupation du bien" },
  { match: (p) => p === "/gestion", title: "Gestion opérationnelle", subtitle: "Toutes vos tâches, tous vos biens" },
  { match: (p) => p === "/conformite", title: "Conformité & docs", subtitle: "Sélectionnez un bien pour voir sa checklist" },
  { match: (p) => /^\/conformite\/\d+$/.test(p), title: "Conformité & docs", subtitle: "Checklist réglementaire du bien" },
  { match: (p) => p === "/calendrier", title: "Calendrier", subtitle: "Occupation de vos biens" },
  { match: (p) => p === "/voyageurs", title: "Voyageurs", subtitle: "Suivi des séjours et des voyageurs" },
  { match: (p) => p === "/fiscalite", title: "Fiscalité", subtitle: "Déclarations et obligations fiscales" },
  { match: (p) => p === "/aide", title: "Aide & experts", subtitle: "Gestors, avocats et ressources utiles" },
];

export default function TopBar() {
  const pathname = usePathname() || "/";
  const entry = TITLES.find((t) => t.match(pathname)) ?? TITLES[0];

  return (
    <div className="flex items-center justify-between px-8 py-5 border-b border-border shrink-0">
      <div>
        <h1 className="font-display font-bold text-[18px] leading-tight">{entry.title}</h1>
        <p className="text-[12px] text-ink-30 mt-0.5">{entry.subtitle}</p>
      </div>
      <div className="w-9 h-9 rounded-full bg-brand-lt border border-brand-mid flex items-center justify-center text-brand font-display font-bold text-sm">
        TB
      </div>
    </div>
  );
}
