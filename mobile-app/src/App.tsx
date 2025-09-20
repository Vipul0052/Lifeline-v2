import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Button } from './components/ui/button';
import { 
  Activity, 
  Shield, 
  Users, 
  MapPin, 
  Map, 
  QrCode, 
  Settings,
  Smartphone
} from 'lucide-react';

// Import screen components
import SplashScreen from './components/SplashScreen';
import HomeScreen from './components/HomeScreen';
import ProfileScreen from './components/ProfileScreen';
import TrekMembersScreen from './components/TrekMembersScreen';
import GeoLocatorScreen from './components/GeoLocatorScreen';
import IntelligentMapScreen from './components/IntelligentMapScreen';
import TrekCodeScreen from './components/TrekCodeScreen';
import DeviceStatusScreen from './components/DeviceStatusScreen';
import AuthWrapper from './components/AuthWrapper';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    // Simulate system initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-background text-foreground font-mono">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-screen flex flex-col">
          <div className="flex-1 overflow-hidden">
            <TabsContent value="home" className="h-full m-0">
              <HomeScreen />
            </TabsContent>
            
            <TabsContent value="profile" className="h-full m-0">
              <ProfileScreen />
            </TabsContent>
            
            <TabsContent value="members" className="h-full m-0">
              <TrekMembersScreen />
            </TabsContent>
            
            <TabsContent value="geolocator" className="h-full m-0">
              <GeoLocatorScreen />
            </TabsContent>
            
            <TabsContent value="map" className="h-full m-0">
              <IntelligentMapScreen />
            </TabsContent>
            
            <TabsContent value="trekcode" className="h-full m-0">
              <TrekCodeScreen />
            </TabsContent>
            
            <TabsContent value="device" className="h-full m-0">
              <DeviceStatusScreen />
            </TabsContent>
          </div>

          {/* Bottom Navigation */}
          <TabsList className="grid grid-cols-7 h-16 rounded-none bg-card border-t border-border">
            <TabsTrigger 
              value="home" 
              className="flex flex-col gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Shield className="h-4 w-4" />
              <span className="text-xs">Emergency</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="profile" 
              className="flex flex-col gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Settings className="h-4 w-4" />
              <span className="text-xs">Profile</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="members" 
              className="flex flex-col gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Users className="h-4 w-4" />
              <span className="text-xs">Team</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="geolocator" 
              className="flex flex-col gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <MapPin className="h-4 w-4" />
              <span className="text-xs">Location</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="map" 
              className="flex flex-col gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Map className="h-4 w-4" />
              <span className="text-xs">Map</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="trekcode" 
              className="flex flex-col gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <QrCode className="h-4 w-4" />
              <span className="text-xs">Network</span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="device" 
              className="flex flex-col gap-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Smartphone className="h-4 w-4" />
              <span className="text-xs">Devices</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </AuthWrapper>
  );
}