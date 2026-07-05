"use client";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// Baked-in defaults so the app runs with zero configuration (no env vars to set
// in Vercel or anywhere else). Safe to keep here: this is the anon/publishable
// key, which is meant to be public — every table is protected by Row Level
// Security, so it can only ever read/write data the signed-in user owns.
const DEFAULT_SUPABASE_URL = "https://xhssqgzsjlvvzbsyshhu.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_SWBfdMFa9rCy9C-OUstenQ_AqDBneEM";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

// Single browser-side Supabase client, shared across the app (auth + Postgres via PostgREST).
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
