import type { Metadata } from "next";
import { Syne, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Shell from "@/components/Shell";
import AuthGate from "@/components/auth/AuthGate";

const syne = Syne({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-syne",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "Habita — Gestion locative Espagne",
  description: "Plateforme de gestion locative pour biens en Espagne",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${syne.variable} ${inter.variable} ${jetbrains.variable} font-body`}>
        <AuthGate>
          <Shell>{children}</Shell>
        </AuthGate>
      </body>
    </html>
  );
}
