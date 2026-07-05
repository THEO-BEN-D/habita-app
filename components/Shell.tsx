"use client";

import { useAppStore } from "@/store/useAppStore";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import OnboardingFlow from "./onboarding/OnboardingFlow";

export default function Shell({ children }: { children: React.ReactNode }) {
  const obComplete = useAppStore((s) => s.obComplete);

  if (!obComplete) {
    return <OnboardingFlow />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <div className="flex-1 overflow-y-auto px-8 py-7">{children}</div>
      </main>
    </div>
  );
}
