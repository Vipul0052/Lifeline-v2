import { getSupabaseClient } from './supabase'
import { loginRateLimiter, signupRateLimiter, passwordResetRateLimiter, getClientIdentifier } from './rateLimiter'

export type AuthResponse = { error?: string; rateLimited?: boolean; remainingAttempts?: number }

export const signUp = async (email: string, password: string, name?: string): Promise<AuthResponse> => {
  const clientId = getClientIdentifier();
  
  // Check rate limiting
  if (!signupRateLimiter.isAllowed(clientId)) {
    const remainingTime = Math.ceil(signupRateLimiter.getResetTime(clientId) / (60 * 1000));
    return { 
      error: `Too many signup attempts. Please try again in ${remainingTime} minutes.`,
      rateLimited: true 
    };
  }

  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signUp({ 
      email, 
      password, 
      options: { 
        data: name ? { name } : undefined,
        emailRedirectTo: `${window.location.origin}/auth/login`
      } 
    });
    
    if (error) {
      return { error: error.message };
    }
    
    return { error: undefined };
  } catch (error) {
    return { error: 'An unexpected error occurred during signup' };
  }
}

export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
  const clientId = getClientIdentifier();
  
  // Check rate limiting
  if (!loginRateLimiter.isAllowed(clientId)) {
    const remainingTime = Math.ceil(loginRateLimiter.getResetTime(clientId) / (60 * 1000));
    const remainingAttempts = loginRateLimiter.getRemainingAttempts(clientId);
    return { 
      error: `Too many login attempts. Please try again in ${remainingTime} minutes.`,
      rateLimited: true,
      remainingAttempts: 0
    };
  }

  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      const remainingAttempts = loginRateLimiter.getRemainingAttempts(clientId);
      return { 
        error: error.message,
        remainingAttempts: remainingAttempts - 1
      };
    }
    
    // Clear rate limiting on successful login
    loginRateLimiter.clear(clientId);
    return { error: undefined };
  } catch (error) {
    return { error: 'An unexpected error occurred during signin' };
  }
}

export const signOut = async (): Promise<AuthResponse> => {
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.signOut();
    return { error: error?.message };
  } catch (error) {
    return { error: 'An unexpected error occurred during signout' };
  }
}

export const getUser = async () => {
  try {
    const supabase = getSupabaseClient();
    const { data } = await supabase.auth.getUser();
    return data.user;
  } catch (error) {
    return null;
  }
}

export const resetPassword = async (email: string): Promise<AuthResponse> => {
  const clientId = getClientIdentifier();
  
  // Check rate limiting
  if (!passwordResetRateLimiter.isAllowed(clientId)) {
    const remainingTime = Math.ceil(passwordResetRateLimiter.getResetTime(clientId) / (60 * 1000));
    return { 
      error: `Too many password reset attempts. Please try again in ${remainingTime} minutes.`,
      rateLimited: true 
    };
  }

  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    
    if (error) {
      return { error: error.message };
    }
    
    return { error: undefined };
  } catch (error) {
    return { error: 'An unexpected error occurred during password reset' };
  }
}

export const updatePassword = async (newPassword: string): Promise<AuthResponse> => {
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return { error: error?.message };
  } catch (error) {
    return { error: 'An unexpected error occurred during password update' };
  }
}


