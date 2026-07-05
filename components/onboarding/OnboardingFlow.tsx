"use client";

import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { IconHouse, IconCheck, IconShield, IconAlertCircle, IconUpload } from "../icons";

const TOTAL_STEPS = 6;

function isStepValid(step: number, s: ReturnType<typeof useAppStore.getState>) {
  switch (step) {
    case 0:
      return true; // language pre-selected by default
    case 1:
      return !!s.obNationality && !!s.obFiscalRes;
    case 2:
      return !!s.obPropStatus;
    case 3:
      return true; // optional fields
    case 4:
      return true; // slider always has a value
    case 5:
      return true;
    default:
      return true;
  }
}

export default function OnboardingFlow() {
  const obStep = useAppStore((s) => s.obStep);
  const setObStep = useAppStore((s) => s.setObStep);
  const skipOnboarding = useAppStore((s) => s.skipOnboarding);
  const state = useAppStore();

  const progressPct = ((obStep + 1) / TOTAL_STEPS) * 100;
  const canContinue = isStepValid(obStep, state);

  function next() {
    if (obStep < 5) setObStep((obStep + 1) as typeof obStep);
  }
  function back() {
    if (obStep > 0) setObStep((obStep - 1) as typeof obStep);
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col animate-fade-in">
      <div className="h-[3px] bg-border-lt w-full">
        <div
          className="h-full bg-brand transition-[width] duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="flex items-center justify-between px-8 py-5">
        <span className="font-display font-bold text-ink text-base">Habita</span>
        <span className="text-[12px] font-mono text-ink-30">
          {obStep + 1} / {TOTAL_STEPS}
        </span>
        <span className="w-14" />
      </div>

      <div className="flex-1 flex items-center justify-center overflow-y-auto px-6">
        <div className="w-full max-w-[580px] py-8 animate-slide-up" key={obStep}>
          {obStep === 0 && <StepWelcome />}
          {obStep === 1 && <StepFiscal />}
          {obStep === 2 && <StepPropStatus />}
          {obStep === 3 && <StepAuthorization />}
          {obStep === 4 && <StepReminders />}
          {obStep === 5 && <StepSummary />}
        </div>
      </div>

      <div className="px-8 py-6 flex flex-col items-center gap-4 border-t border-border-lt">
        <div className="w-full max-w-[580px] flex items-center justify-between">
          <button
            onClick={back}
            disabled={obStep === 0}
            className={`text-[13px] font-medium ${
              obStep === 0 ? "text-ink-12 cursor-default" : "text-ink-50 hover:text-ink"
            }`}
          >
            ← Retour
          </button>
          {obStep < 5 ? (
            <button
              onClick={next}
              disabled={!canContinue}
              className={`px-5 py-2.5 rounded-[9px] text-[13px] font-semibold transition-colors ${
                canContinue
                  ? "bg-brand text-white hover:bg-brand-dk"
                  : "bg-ink-12 text-ink-30 cursor-not-allowed"
              }`}
            >
              Continuer →
            </button>
          ) : (
            <FinalCta />
          )}
        </div>
        {obStep < 5 && (
          <button onClick={skipOnboarding} className="text-[12px] text-ink-30 hover:text-ink-50">
            Passer l&apos;onboarding →
          </button>
        )}
      </div>
    </div>
  );
}

function StepWelcome() {
  const obLang = useAppStore((s) => s.obLang);
  const setObLang = useAppStore((s) => s.setObLang);

  return (
    <div className="text-center flex flex-col items-center gap-5">
      <div className="w-12 h-12 rounded-xl bg-brand flex items-center justify-center">
        <IconHouse width={24} height={24} className="text-white" />
      </div>
      <h1 className="font-display font-bold text-[36px] leading-tight">Bienvenue sur Habita</h1>
      <p className="text-[15px] text-ink-50">Gestion locative espagnole. Configuration en 5 minutes.</p>
      <div className="flex gap-3 w-full mt-2">
        <button
          onClick={() => setObLang("fr")}
          className={`flex-1 py-4 rounded-xl border-2 text-[14px] font-medium transition-colors ${
            obLang === "fr" ? "border-brand bg-brand-lt text-ink" : "border-border text-ink-50"
          }`}
        >
          🇫🇷 Français
        </button>
        <button
          onClick={() => setObLang("es")}
          className={`flex-1 py-4 rounded-xl border-2 text-[14px] font-medium transition-colors ${
            obLang === "es" ? "border-brand bg-brand-lt text-ink" : "border-border text-ink-50"
          }`}
        >
          🇪🇸 Español
        </button>
      </div>
    </div>
  );
}

function OptionCard({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl border-2 text-left transition-colors ${
        selected ? "border-brand bg-brand-lt" : "border-border hover:border-brand-mid"
      }`}
    >
      {children}
    </button>
  );
}

function StepFiscal() {
  const obNationality = useAppStore((s) => s.obNationality);
  const setObNationality = useAppStore((s) => s.setObNationality);
  const obFiscalRes = useAppStore((s) => s.obFiscalRes);
  const setObFiscalRes = useAppStore((s) => s.setObFiscalRes);

  return (
    <div className="flex flex-col gap-7">
      <h2 className="font-display font-bold text-[28px]">Votre profil fiscal</h2>

      <div>
        <div className="text-[12px] uppercase tracking-wide text-ink-30 font-semibold mb-2">Nationalité</div>
        <div className="grid grid-cols-2 gap-3">
          <OptionCard selected={obNationality === "FR"} onClick={() => setObNationality("FR")}>
            <div className="text-[14px] font-semibold">🇫🇷 Français</div>
            <div className="text-[12px] text-ink-50 mt-1">Modelo 210 + 2044/2047</div>
          </OptionCard>
          <OptionCard selected={obNationality === "ES"} onClick={() => setObNationality("ES")}>
            <div className="text-[14px] font-semibold">🇪🇸 Espagnol</div>
            <div className="text-[12px] text-ink-50 mt-1">Modelo 210 uniquement</div>
          </OptionCard>
        </div>
      </div>

      <div>
        <div className="text-[12px] uppercase tracking-wide text-ink-30 font-semibold mb-2">Résidence fiscale</div>
        <div className="grid grid-cols-2 gap-3">
          <OptionCard selected={obFiscalRes === "FR"} onClick={() => setObFiscalRes("FR")}>
            <div className="text-[14px] font-semibold">🇫🇷 En France</div>
          </OptionCard>
          <OptionCard selected={obFiscalRes === "ES"} onClick={() => setObFiscalRes("ES")}>
            <div className="text-[14px] font-semibold">🇪🇸 En Espagne</div>
          </OptionCard>
          <div className="col-span-2">
            <OptionCard selected={obFiscalRes === "OTHER"} onClick={() => setObFiscalRes("OTHER")}>
              <div className="text-[14px] font-semibold">🌍 Autre pays</div>
            </OptionCard>
          </div>
        </div>
      </div>

      {obFiscalRes && (
        <div className="bg-ok-lt border border-ok-bd rounded-xl p-4 text-[13px] text-ink-80 flex gap-2.5">
          <IconCheck width={16} height={16} className="text-ok shrink-0 mt-0.5" />
          <span>
            {obFiscalRes === "FR"
              ? "Bloc fiscal complet activé : Modelo 210 (Espagne) + 2044/2047 (France) + suivi IEET."
              : "Bloc fiscal simplifié activé : Modelo 210 uniquement. Le bloc fiscal français sera masqué."}
          </span>
        </div>
      )}
    </div>
  );
}

function StepPropStatus() {
  const obPropStatus = useAppStore((s) => s.obPropStatus);
  const setObPropStatus = useAppStore((s) => s.setObPropStatus);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display font-bold text-[28px]">Votre bien est-il déjà autorisé ?</h2>
      <div className="flex flex-col gap-3">
        <button
          onClick={() => setObPropStatus("new")}
          className={`p-5 rounded-xl border-2 text-left flex gap-4 items-start transition-colors ${
            obPropStatus === "new" ? "border-brand bg-brand-lt" : "border-border hover:border-brand-mid"
          }`}
        >
          <IconAlertCircle width={22} height={22} className="text-warn shrink-0 mt-0.5" />
          <div>
            <div className="text-[15px] font-semibold">Pas encore de licence HUTG</div>
            <div className="text-[13px] text-ink-50 mt-1">
              Habita vous guide pas à pas dans toutes les démarches légales, fiscales et techniques nécessaires.
            </div>
          </div>
        </button>
        <button
          onClick={() => setObPropStatus("licensed")}
          className={`p-5 rounded-xl border-2 text-left flex gap-4 items-start transition-colors ${
            obPropStatus === "licensed" ? "border-brand bg-brand-lt" : "border-border hover:border-brand-mid"
          }`}
        >
          <IconShield width={22} height={22} className="text-ok shrink-0 mt-0.5" />
          <div>
            <div className="text-[15px] font-semibold">J&apos;ai déjà une licence HUTG active</div>
            <div className="text-[13px] text-ink-50 mt-1">
              Importez votre licence et laissez Habita suivre son renouvellement automatiquement.
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

function StepAuthorization() {
  const obPropStatus = useAppStore((s) => s.obPropStatus);

  if (obPropStatus === "licensed") {
    return (
      <div className="flex flex-col gap-6">
        <h2 className="font-display font-bold text-[28px]">Votre autorisation</h2>
        <div>
          <label className="text-[12px] uppercase tracking-wide text-ink-30 font-semibold block mb-1.5">
            Numéro HUTG
          </label>
          <input
            className="w-full border border-border rounded-lg px-3 py-2.5 text-[14px] font-mono input-focus"
            placeholder="HUTG-XXXXXX"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[12px] uppercase tracking-wide text-ink-30 font-semibold block mb-1.5">
              Date d&apos;obtention
            </label>
            <input type="date" className="w-full border border-border rounded-lg px-3 py-2.5 text-[14px] input-focus" />
          </div>
          <div>
            <label className="text-[12px] uppercase tracking-wide text-ink-30 font-semibold block mb-1.5">
              Date d&apos;expiration
            </label>
            <input type="date" className="w-full border border-border rounded-lg px-3 py-2.5 text-[14px] input-focus" />
          </div>
        </div>
        <div className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center gap-2 text-center">
          <IconUpload width={20} height={20} className="text-ink-30" />
          <div className="text-[13px] text-ink-50">Glissez votre document de licence ici (optionnel)</div>
        </div>
      </div>
    );
  }

  const steps = [
    "Vérifications légales (zonage, NIE, registres)",
    "Obtention de la licence HUTG",
    "Inscription SES / Registre Únic",
    "Mise en place de la gestion fiscale",
  ];

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display font-bold text-[28px]">Ce que Habita va vous faire suivre</h2>
      <ol className="flex flex-col gap-3">
        {steps.map((s, i) => (
          <li key={s} className="flex gap-3 items-start">
            <div className="w-6 h-6 rounded-full bg-brand-lt text-brand text-[12px] font-bold flex items-center justify-center shrink-0">
              {i + 1}
            </div>
            <span className="text-[14px] text-ink-80 pt-0.5">{s}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function StepReminders() {
  const obReminderDelay = useAppStore((s) => s.obReminderDelay);
  const setObReminderDelay = useAppStore((s) => s.setObReminderDelay);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-display font-bold text-[28px]">Alertes d&apos;expiration</h2>
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="font-display font-bold text-[26px] text-brand">{obReminderDelay} mois</div>
        <input
          type="range"
          min={1}
          max={12}
          value={obReminderDelay}
          onChange={(e) => setObReminderDelay(Number(e.target.value))}
          className="w-full accent-brand"
        />
        <div className="flex justify-between w-full text-[11px] text-ink-30">
          <span>1 mois</span>
          <span>12 mois</span>
        </div>
      </div>
      <div className="bg-ok-lt border border-ok-bd rounded-xl p-4 text-[13px] text-ink-80">
        Vous serez alerté {obReminderDelay} mois avant l&apos;expiration de vos licences, assurances et documents à renouveler.
      </div>
    </div>
  );
}

function StepSummary() {
  const s = useAppStore();

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="w-14 h-14 rounded-full bg-ok-lt border border-ok-bd flex items-center justify-center">
        <IconCheck width={26} height={26} className="text-ok" />
      </div>
      <h2 className="font-display font-bold text-[28px]">Tout est prêt !</h2>

      <div className="bg-sand rounded-xl p-5 grid grid-cols-2 gap-4 w-full text-left">
        <SummaryItem label="Nationalité" value={s.obNationality === "FR" ? "🇫🇷 Français" : "🇪🇸 Espagnol"} />
        <SummaryItem
          label="Résidence fiscale"
          value={s.obFiscalRes === "FR" ? "🇫🇷 France" : s.obFiscalRes === "ES" ? "🇪🇸 Espagne" : "🌍 Autre"}
        />
        <SummaryItem label="Statut du bien" value={s.obPropStatus === "licensed" ? "Licence active" : "Nouveau bien"} />
        <SummaryItem label="Rappels" value={`${s.obReminderDelay} mois avant échéance`} />
        <div className="col-span-2">
          <SummaryItem
            label="Bloc fiscal activé"
            value={s.obFiscalRes === "FR" ? "Modelo 210 + 2044/2047 + IEET" : "Modelo 210 uniquement"}
          />
        </div>
      </div>

      {s.obPropStatus === "licensed" && (
        <div className="bg-brand-lt border border-brand-mid rounded-xl p-4 text-[13px] text-ink-80 text-left">
          Vous allez être redirigé vers <strong>Mes biens</strong> pour ajouter votre propriété, puis vers{" "}
          <strong>Conformité &amp; docs</strong> pour importer votre licence.
        </div>
      )}
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-ink-30 font-semibold">{label}</div>
      <div className="text-[14px] font-medium mt-0.5">{value}</div>
    </div>
  );
}

function FinalCta() {
  const obPropStatus = useAppStore((s) => s.obPropStatus);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const router = useRouter();

  async function handleClick() {
    const target = await completeOnboarding();
    // Client-side nav — keeps the in-memory store (obComplete) intact.
    router.push(target === "biens" ? "/biens" : "/");
  }

  return (
    <button
      onClick={handleClick}
      className="px-5 py-2.5 rounded-[9px] text-[13px] font-semibold bg-brand text-white hover:bg-brand-dk transition-colors"
    >
      {obPropStatus === "licensed" ? "Ajouter mon bien →" : "Accéder à la plateforme →"}
    </button>
  );
}
