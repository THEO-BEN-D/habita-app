"use client";

import { useAppStore } from "@/store/useAppStore";

export default function Page() {
  const obFiscalRes = useAppStore((s) => s.obFiscalRes);
  const fullBlock = obFiscalRes === "FR";

  return (
    <div className="max-w-[720px] flex flex-col gap-4">
      <div className="bg-white border border-border rounded-card p-5">
        <h3 className="font-display font-bold text-[14px] mb-2">Modelo 210</h3>
        <p className="text-[13px] text-ink-50">
          Déclaration trimestrielle des revenus locatifs non-résident, obligatoire pour tous les profils.
        </p>
      </div>
      {fullBlock && (
        <>
          <div className="bg-white border border-border rounded-card p-5">
            <h3 className="font-display font-bold text-[14px] mb-2">2044 / 2047</h3>
            <p className="text-[13px] text-ink-50">
              Déclaration des revenus fonciers étrangers en France, avec application de la convention fiscale
              franco-espagnole.
            </p>
          </div>
          <div className="bg-white border border-border rounded-card p-5">
            <h3 className="font-display font-bold text-[14px] mb-2">IEET</h3>
            <p className="text-[13px] text-ink-50">Taxe de séjour catalane, à suivre trimestriellement.</p>
          </div>
        </>
      )}
      {!fullBlock && (
        <div className="bg-brand-lt border border-brand-mid rounded-card p-4 text-[12px] text-ink-80">
          Bloc fiscal français masqué — votre résidence fiscale n&apos;est pas en France.
        </div>
      )}
    </div>
  );
}
