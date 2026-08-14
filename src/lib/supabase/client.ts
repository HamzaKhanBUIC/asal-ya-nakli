// Asal ya Nakli - Supabase Backend & Database Client

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export let supabase: SupabaseClient | null = null;
export let supabaseAdmin: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('[Supabase] Client initialized with URL:', supabaseUrl);
  } catch (err) {
    console.warn('[Supabase] Failed to initialize public client:', err);
  }
}

if (supabaseUrl && (supabaseServiceKey || supabaseAnonKey)) {
  try {
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey!);
  } catch (err) {
    console.warn('[Supabase] Failed to initialize admin client:', err);
  }
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-project-id') &&
    !supabaseUrl.includes('example.com')
  );
}
