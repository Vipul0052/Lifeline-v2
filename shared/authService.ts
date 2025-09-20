import { getSupabaseClient } from './supabase'

export type AuthResponse = { error?: string; data?: any }

// Input validation functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' }
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' }
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' }
  }
  if (!/(?=.*\d)/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' }
  }
  return { isValid: true }
}

const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>\"'&]/g, '')
}

export const signUp = async (email: string, password: string, name?: string): Promise<AuthResponse> => {
  try {
    // Input validation
    if (!email || !password) {
      return { error: 'Email and password are required' }
    }

    const sanitizedEmail = sanitizeInput(email).toLowerCase()
    const sanitizedName = name ? sanitizeInput(name) : undefined

    if (!validateEmail(sanitizedEmail)) {
      return { error: 'Please enter a valid email address' }
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      return { error: passwordValidation.message }
    }

    if (sanitizedName && sanitizedName.length < 2) {
      return { error: 'Name must be at least 2 characters long' }
    }

    const supabase = getSupabaseClient()
    const { data, error } = await supabase.auth.signUp({ 
      email: sanitizedEmail, 
      password,
      options: { 
        data: sanitizedName ? { name: sanitizedName } : undefined,
        emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : undefined
      } 
    })

    if (error) {
      // Handle specific Supabase errors
      if (error.message.includes('already registered')) {
        return { error: 'An account with this email already exists' }
      }
      return { error: error.message }
    }

    return { data }
  } catch (error) {
    console.error('Signup error:', error)
    return { error: 'An unexpected error occurred during signup' }
  }
}

export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    // Input validation
    if (!email || !password) {
      return { error: 'Email and password are required' }
    }

    const sanitizedEmail = sanitizeInput(email).toLowerCase()

    if (!validateEmail(sanitizedEmail)) {
      return { error: 'Please enter a valid email address' }
    }

    const supabase = getSupabaseClient()
    const { data, error } = await supabase.auth.signInWithPassword({ 
      email: sanitizedEmail, 
      password 
    })

    if (error) {
      // Handle specific Supabase errors
      if (error.message.includes('Invalid login credentials')) {
        return { error: 'Invalid email or password' }
      }
      if (error.message.includes('Email not confirmed')) {
        return { error: 'Please check your email and confirm your account before signing in' }
      }
      return { error: error.message }
    }

    return { data }
  } catch (error) {
    console.error('Signin error:', error)
    return { error: 'An unexpected error occurred during signin' }
  }
}

export const signOut = async (): Promise<AuthResponse> => {
  try {
    const supabase = getSupabaseClient()
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      return { error: error.message }
    }

    return {}
  } catch (error) {
    console.error('Signout error:', error)
    return { error: 'An unexpected error occurred during signout' }
  }
}

export const getUser = async () => {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('Get user error:', error)
      return null
    }

    return data.user
  } catch (error) {
    console.error('Get user error:', error)
    return null
  }
}

export const resetPassword = async (email: string): Promise<AuthResponse> => {
  try {
    if (!email) {
      return { error: 'Email is required' }
    }

    const sanitizedEmail = sanitizeInput(email).toLowerCase()

    if (!validateEmail(sanitizedEmail)) {
      return { error: 'Please enter a valid email address' }
    }

    const supabase = getSupabaseClient()
    const { error } = await supabase.auth.resetPasswordForEmail(sanitizedEmail, {
      redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/reset-password` : undefined
    })

    if (error) {
      return { error: error.message }
    }

    return {}
  } catch (error) {
    console.error('Reset password error:', error)
    return { error: 'An unexpected error occurred while resetting password' }
  }
}


