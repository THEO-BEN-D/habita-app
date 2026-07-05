"use client";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fails loudly at build/runtime instead of silently hitting an invalid backend.
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY — copy .env.example to .env.local."
  );
}

// Single browser-side Supabase client, shared across the app (auth + Postgres via PostgREST).
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
