import { getSupabaseClient } from './supabase';

export type AuthResponse = { error?: string };

export const signUp = async (email: string, password: string, name?: string): Promise<AuthResponse> => {
	const supabase = getSupabaseClient();
	const { error } = await supabase.auth.signUp({
		email,
		password,
		options: { data: name ? { name } : undefined },
	});
	return { error: error?.message };
};

export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
	const supabase = getSupabaseClient();
	const { error } = await supabase.auth.signInWithPassword({ email, password });
	return { error: error?.message };
};

export const signOut = async (): Promise<AuthResponse> => {
	const supabase = getSupabaseClient();
	const { error } = await supabase.auth.signOut();
	return { error: error?.message };
};

export const getUser = async () => {
	const supabase = getSupabaseClient();
	const { data } = await supabase.auth.getUser();
	return data.user;
};