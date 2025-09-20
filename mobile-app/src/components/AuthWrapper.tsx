import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from '../../../shared';
import LoginScreen from './LoginScreen';
import SignupScreen from './SignupScreen';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthContent: React.FC<AuthWrapperProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!user) {
    if (authMode === 'login') {
      return (
        <LoginScreen
          onNavigateToSignUp={() => setAuthMode('signup')}
          onLoginSuccess={() => {}} // Will be handled by auth state change
        />
      );
    } else {
      return (
        <SignupScreen
          onNavigateToLogin={() => setAuthMode('login')}
          onSignupSuccess={() => setAuthMode('login')}
        />
      );
    }
  }

  return <>{children}</>;
};

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  return (
    <AuthProvider>
      <AuthContent>{children}</AuthContent>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
  },
});

export default AuthWrapper;