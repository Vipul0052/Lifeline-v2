import React, { useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  if (loading) {
    return (
      <View style={{ 
        flex: 1, 
        backgroundColor: '#0a0a0a', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}>
        <ActivityIndicator size="large" color="#00ff88" />
      </View>
    );
  }

  if (!user) {
    if (authMode === 'login') {
      return (
        <LoginScreen
          onLoginSuccess={() => {
            // User state will be updated by AuthContext
          }}
          onSwitchToSignup={() => setAuthMode('signup')}
        />
      );
    } else {
      return (
        <SignupScreen
          onSignupSuccess={() => setAuthMode('login')}
          onSwitchToLogin={() => setAuthMode('login')}
        />
      );
    }
  }

  return <>{children}</>;
};