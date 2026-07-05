"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { IconX } from "../icons";
import { PropertyType } from "@/store/types";

const TYPES: { value: PropertyType; label: string; emoji: string }[] = [
  { value: "appartement", label: "Appartement", emoji: "🏢" },
  { value: "maison", label: "Maison", emoji: "🏡" },
  { value: "studio", label: "Studio", emoji: "🛏️" },
  { value: "villa", label: "Villa", emoji: "🏖️" },
];

export default function AddPropertyModal() {
  const modal = useAppStore((s) => s.addPropModal);
  const closeAddPropModal = useAppStore((s) => s.closeAddPropModal);
  const setAddPropStep = useAppStore((s) => s.setAddPropStep);
  const setAddPropField = useAppStore((s) => s.setAddPropField);
  const setAddPropType = useAppStore((s) => s.setAddPropType);
  const setAddPropStatus = useAppStore((s) => s.setAddPropStatus);
  const addProperty = useAppStore((s) => s.addProperty);
  const goToPropHub = useAppStore((s) => s.goToPropHub);
  const obLicenseInfo = useAppStore((s) => s.obLicenseInfo);
  const router = useRouter();

  if (!modal.show) return null;

  const step1Valid = modal.name.trim().length > 0 && modal.address.trim().length > 0 && !!modal.type;
  const step2Valid = !!modal.status;
  const [saving, setSaving] = useState(false);

  // If the documents were already collected during onboarding, carry them over
  // so the property is created pre-marked compliant instead of starting empty.
  const hasCollectedLicense = Object.values(obLicenseInfo).some(Boolean);

  async function confirm() {
    setSaving(true);
    try {
      const id = await addProperty(
        {
          name: modal.name,
          location: modal.address,
          region: "",
          type: TYPES.find((t) => t.value === modal.type)?.label ?? "",
        },
        modal.status === "licensed" && hasCollectedLicense ? obLicenseInfo : undefined
      );
      closeAddPropModal();
      goToPropHub(id, "list");
      router.push(`/biens/${id}/conformite`);
    } catch (err) {
      console.error("Failed to add property", err);
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[999] bg-ink-30 backdrop-blur-sm flex items-center justify-center animate-fade-in">
      <div className="bg-white rounded-modal shadow-modal w-full max-w-[480px] animate-slide-up">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border-lt">
          <h3 className="font-display font-bold text-[16px]">
            {modal.step === 0 ? "Ajouter un bien" : "Statut du bien"}
          </h3>
          <button onClick={closeAddPropModal} className="text-ink-30 hover:text-ink">
            <IconX width={18} height={18} />
          </button>
        </div>

        <div className="px-6 py-6 flex flex-col gap-4">
          {modal.step === 0 ? (
            <>
              <div>
                <label className="text-[12px] uppercase tracking-wide text-ink-30 font-semibold block mb-1.5">
                  Nom du bien
                </label>
                <input
                  value={modal.name}
                  onChange={(e) => setAddPropField("name", e.target.value)}
                  placeholder="Ex : Appartement Tarragona"
                  className="w-full border border-border rounded-lg px-3 py-2.5 text-[14px] input-focus"
                />
              </div>
              <div>
                <label className="text-[12px] uppercase tracking-wide text-ink-30 font-semibold block mb-1.5">
                  Adresse
                </label>
                <input
                  value={modal.address}
                  onChange={(e) => setAddPropField("address", e.target.value)}
                  placeholder="Ville, région"
                  className="w-full border border-border rounded-lg px-3 py-2.5 text-[14px] input-focus"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 mt-1">
                {TYPES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setAddPropType(t.value)}
                    className={`p-3 rounded-xl border-2 text-[13px] font-medium flex items-center gap-2 transition-colors ${
                      modal.type === t.value ? "border-brand bg-brand-lt" : "border-border hover:border-brand-mid"
                    }`}
                  >
                    <span>{t.emoji}</span>
                    {t.label}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setAddPropStatus("new")}
                  className={`p-4 rounded-xl border-2 text-left transition-colors ${
                    modal.status === "new" ? "border-brand bg-brand-lt" : "border-border hover:border-brand-mid"
                  }`}
                >
                  <div className="text-[14px] font-semibold">Pas encore de licence HUTG</div>
                </button>
                <button
                  onClick={() => setAddPropStatus("licensed")}
                  className={`p-4 rounded-xl border-2 text-left transition-colors ${
                    modal.status === "licensed" ? "border-brand bg-brand-lt" : "border-border hover:border-brand-mid"
                  }`}
                >
                  <div className="text-[14px] font-semibold">J&apos;ai déjà une licence HUTG active</div>
                </button>
              </div>
              <div className="bg-brand-lt border border-brand-mid rounded-xl p-3.5 text-[12px] text-ink-80">
                Les deux options mènent ensuite à Conformité &amp; docs pour finaliser le dossier de ce bien.
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-border-lt">
          {modal.step === 1 ? (
            <button onClick={() => setAddPropStep(0)} className="text-[13px] text-ink-50 hover:text-ink">
              ← Retour
            </button>
          ) : (
            <span />
          )}
          {modal.step === 0 ? (
            <button
              onClick={() => setAddPropStep(1)}
              disabled={!step1Valid}
              className={`px-5 py-2.5 rounded-[9px] text-[13px] font-semibold ${
                step1Valid ? "bg-brand text-white hover:bg-brand-dk" : "bg-ink-12 text-ink-30 cursor-not-allowed"
              }`}
            >
              Continuer →
            </button>
          ) : (
            <button
              onClick={confirm}
              disabled={!step2Valid || saving}
              className={`px-5 py-2.5 rounded-[9px] text-[13px] font-semibold ${
                step2Valid && !saving ? "bg-brand text-white hover:bg-brand-dk" : "bg-ink-12 text-ink-30 cursor-not-allowed"
              }`}
            >
              {saving ? "Ajout en cours…" : "Ajouter le bien"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
