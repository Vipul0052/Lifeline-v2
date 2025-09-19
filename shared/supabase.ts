<<<<<<< HEAD
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const getEnv = () => {
  const url = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_URL) || (typeof process !== 'undefined' && process.env.EXPO_PUBLIC_SUPABASE_URL)
  const anonKey = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) || (typeof process !== 'undefined' && process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY)
  if (!url || !anonKey) {
    throw new Error('Supabase env not found. Ensure URL and ANON KEY are set.')
  }
  return { url, anonKey }
}

let cachedClient: SupabaseClient | null = null

export const getSupabaseClient = (): SupabaseClient => {
  if (cachedClient) return cachedClient
  const { url, anonKey } = getEnv()
  cachedClient = createClient(url, anonKey, {
    auth: {
      persistSession: true,
      detectSessionInUrl: true,
      autoRefreshToken: true,
    },
  })
  return cachedClient
}

=======
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const getEnv = () => {
	const url = (typeof process !== 'undefined' && (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL)) || '';
	const anonKey = (typeof process !== 'undefined' && (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY)) || '';
	if (!url || !anonKey) {
		throw new Error('Supabase env vars missing: set URL and ANON KEY.');
	}
	return { url, anonKey };
};

let cachedClient: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient => {
	if (cachedClient) return cachedClient;
	const { url, anonKey } = getEnv();
	cachedClient = createClient(url, anonKey, {
		auth: {
			persistSession: true,
			detectSessionInUrl: true,
			autoRefreshToken: true,
		},
	});
	return cachedClient;
};
>>>>>>> 57700d9 (feat: Add Supabase auth and integrate into dashboard)

