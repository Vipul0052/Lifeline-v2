// Shared types and constants for both mobile app and web dashboard

export interface UserProfile {
  id: string;
  name?: string;
  phone?: string;
  email?: string;
}

// Authentication exports
export { AuthProvider, useAuth } from './authContext';
export { 
  validateEmail, 
  validatePassword, 
  validateName, 
  validateConfirmPassword,
  validateSignUpForm,
  validateSignInForm,
  type ValidationResult 
} from './authValidation';
export { 
  signUp, 
  signIn, 
  signOut, 
  getUser, 
  resetPassword, 
  updatePassword, 
  type AuthResponse 
} from './authService';
export { 
  loginRateLimiter, 
  signupRateLimiter, 
  passwordResetRateLimiter, 
  getClientIdentifier 
} from './rateLimiter';

export interface Device {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'error';
  batteryLevel?: number;
  lastSeen: Date;
}

export interface EmergencyEvent {
  id: string;
  userId: string;
  deviceId: string;
  location: {
    latitude: number;
    longitude: number;
  };
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'resolved' | 'cancelled';
}

// Theme constants
export const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  background: '#F2F2F7',
  surface: '#FFFFFF',
  text: '#000000',
  textSecondary: '#8E8E93',
} as const;

// API endpoints
export const API_ENDPOINTS = {
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://api.lifeline-emergency.com' 
    : 'http://localhost:3001',
  AUTH: '/auth',
  DEVICES: '/devices',
  EMERGENCIES: '/emergencies',
  USERS: '/users',
} as const;

// App constants
export const APP_CONFIG = {
  VERSION: '2.1.0',
  NAME: 'Lifeline IoT Emergency System',
  SUPPORTED_PLATFORMS: ['ios', 'android', 'web'] as const,
} as const;

// Utility functions
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const getSeverityColor = (severity: EmergencyEvent['severity']): string => {
  switch (severity) {
    case 'low': return COLORS.success;
    case 'medium': return COLORS.warning;
    case 'high': return COLORS.error;
    case 'critical': return '#8B0000';
    default: return COLORS.textSecondary;
  }
};
