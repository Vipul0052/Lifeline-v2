import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import TrekMembersScreen from './screens/TrekMembersScreen';
import GeoLocatorScreen from './screens/GeoLocatorScreen';
import IntelligentMapScreen from './screens/IntelligentMapScreen';
import TrekCodeScreen from './screens/TrekCodeScreen';
import DeviceStatusScreen from './screens/DeviceStatusScreen';

// Import styles
import { colors } from './styles/colors';

const Tab = createBottomTabNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate system initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen onFinish={() => setIsLoading(false)} />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor={colors.background} />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

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
                iconName = 'circle';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.mutedForeground,
          tabBarStyle: {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            paddingBottom: 5,
            paddingTop: 5,
            height: 65,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '500',
          },
          headerShown: false,
        })}
      >
        <Tab.Screen name="Emergency" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Team" component={TrekMembersScreen} />
        <Tab.Screen name="Location" component={GeoLocatorScreen} />
        <Tab.Screen name="Map" component={IntelligentMapScreen} />
        <Tab.Screen name="Network" component={TrekCodeScreen} />
        <Tab.Screen name="Devices" component={DeviceStatusScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}