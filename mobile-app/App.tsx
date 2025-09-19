import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import screen components
import SplashScreen from './src/components/SplashScreen';
import HomeScreen from './src/components/HomeScreen';
import ProfileScreen from './src/components/ProfileScreen';
import TrekMembersScreen from './src/components/TrekMembersScreen';
import GeoLocatorScreen from './src/components/GeoLocatorScreen';
import IntelligentMapScreen from './src/components/IntelligentMapScreen';
import TrekCodeScreen from './src/components/TrekCodeScreen';
import DeviceStatusScreen from './src/components/DeviceStatusScreen';
import LoginScreen from './src/components/auth/LoginScreen';
import SignupScreen from './src/components/auth/SignupScreen';
import { getUser, signOut } from 'shared/authService';

const Tab = createBottomTabNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    (async () => {
      // Simulate splash and check auth
      await new Promise(resolve => setTimeout(resolve, 2000));
      const user = await getUser();
      setAuthed(!!user);
      setIsLoading(false);
    })();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  if (authed === false) {
    if (showSignup) {
      return <SignupScreen onSwitchToLogin={() => setShowSignup(false)} />;
    }
    return <LoginScreen onSuccess={() => setAuthed(true)} onSwitchToSignup={() => setShowSignup(true)} />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" backgroundColor="#1A1A1A" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            switch (route.name) {
              case 'Emergency':
                iconName = focused ? 'shield' : 'shield-outline';
                break;
              case 'Profile':
                iconName = focused ? 'settings' : 'settings-outline';
                break;
              case 'Team':
                iconName = focused ? 'people' : 'people-outline';
                break;
              case 'Location':
                iconName = focused ? 'location' : 'location-outline';
                break;
              case 'Map':
                iconName = focused ? 'map' : 'map-outline';
                break;
              case 'Network':
                iconName = focused ? 'qr-code' : 'qr-code-outline';
                break;
              case 'Devices':
                iconName = focused ? 'phone-portrait' : 'phone-portrait-outline';
                break;
              default:
                iconName = 'help-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#0066CC',
          tabBarInactiveTintColor: '#CCCCCC',
          tabBarStyle: {
            backgroundColor: '#2D2D2D',
            borderTopColor: '#444444',
            borderTopWidth: 1,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '500',
          },
          headerStyle: {
            backgroundColor: '#1A1A1A',
            borderBottomColor: '#444444',
            borderBottomWidth: 1,
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: '600',
          },
        })}
      >
        <Tab.Screen 
          name="Emergency" 
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen 
          name="Team" 
          component={TrekMembersScreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen 
          name="Location" 
          component={GeoLocatorScreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen 
          name="Map" 
          component={IntelligentMapScreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen 
          name="Network" 
          component={TrekCodeScreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen 
          name="Devices" 
          component={DeviceStatusScreen}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
