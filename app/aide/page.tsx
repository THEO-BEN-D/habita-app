export default function Page() {
  return (
    <div className="max-w-[720px] flex flex-col gap-3">
      <div className="bg-white border border-border rounded-card p-5 text-[13px] text-ink-50">
        Annuaire de gestors, avocats et experts locaux — à connecter à un répertoire réel.
      </div>
      <div className="bg-warn-lt border border-warn-bd rounded-card p-4 text-[12px] text-ink-80">
        Les intitulés de tâches (HUTG, Modelo 210, IEET, NIE, cédula, certificat énergétique…) sont des repères
        génériques, pas un conseil juridique ou fiscal. Faites vérifier votre situation par un professionnel local
        avant toute démarche.
      </div>
    </div>
  );
}
