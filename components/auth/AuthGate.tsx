"use client";

import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import { useAppStore } from "@/store/useAppStore";
import { IconHouse } from "../icons";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null | undefined>(undefined); // undefined = still checking
  const hydrate = useAppStore((s) => s.hydrate);
  const hydrated = useAppStore((s) => s.hydrated);
  const resetLocal = useAppStore((s) => s.resetLocal);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (!newSession) resetLocal();
    });
    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (session?.user?.id && !hydrated) {
      hydrate(session.user.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id, hydrated]);

  if (session === undefined) {
    return <FullScreenState>Chargement…</FullScreenState>;
  }

  if (!session) {
    return <SignInScreen />;
  }

  if (!hydrated) {
    return <FullScreenState>Chargement de vos biens…</FullScreenState>;
  }

  return <>{children}</>;
}

function FullScreenState({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-sand text-[13px] text-ink-50">{children}</div>
  );
}

function SignInScreen() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    if (error) {
      setErrorMsg(error.message);
      setStatus("error");
    } else {
      setStatus("sent");
    }
  }

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-[380px] flex flex-col items-center gap-5 text-center">
        <div className="w-12 h-12 rounded-xl bg-brand flex items-center justify-center">
          <IconHouse width={24} height={24} className="text-white" />
        </div>
        <h1 className="font-display font-bold text-[24px]">Habita</h1>
        <p className="text-[13px] text-ink-50 -mt-2">
          Gestion locative espagnole. Connectez-vous pour accéder à vos biens.
        </p>

        {status === "sent" ? (
          <div className="bg-ok-lt border border-ok-bd rounded-xl p-4 text-[13px] text-ink-80">
            Un lien de connexion a été envoyé à <strong>{email}</strong>. Ouvrez-le pour continuer.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className="w-full border border-border rounded-lg px-3 py-2.5 text-[14px] input-focus text-center"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full py-2.5 rounded-[9px] text-[13px] font-semibold bg-brand text-white hover:bg-brand-dk disabled:opacity-60"
            >
              {status === "sending" ? "Envoi…" : "Recevoir un lien de connexion"}
            </button>
            {status === "error" && <p className="text-[12px] text-err">{errorMsg}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
