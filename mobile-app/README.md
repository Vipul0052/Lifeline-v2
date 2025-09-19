# Lifeline IoT Emergency System - React Native Expo

A React Native Expo version of the Lifeline IoT Emergency System, converted from the original React web application while maintaining the exact same UI and functionality.

## Features

- **Emergency SOS System**: Large emergency button with countdown timer
- **Real-time Sensor Monitoring**: MPU6050 accelerometer and gyroscope data
- **Team Management**: Track team members with LoRa mesh network
- **GPS Navigation**: Location tracking and offline maps
- **Device Status**: Monitor all connected IoT devices
- **Network Configuration**: LoRa mesh network settings
- **System Configuration**: User profile and device settings

## Screens

1. **Emergency** - Main emergency command center with SOS button
2. **Profile** - User profile and system configuration
3. **Team** - Team member management and emergency contacts
4. **Location** - GPS tracking and navigation tools
5. **Map** - Intelligent map with team tracking
6. **Network** - LoRa network configuration and trek codes
7. **Devices** - Device status monitoring and system health

## Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI: `npm install -g @expo/cli`
- Expo Go app on your mobile device

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the Expo development server:
```bash
npm start
```

3. Scan the QR code with Expo Go app on your mobile device

### Alternative Commands

```bash
# Start with specific platform
npm run android  # Android
npm run ios      # iOS
npm run web      # Web browser
```

## Project Structure

```
├── App.tsx                    # Main app component with navigation
├── index.js                   # Entry point
├── app.json                   # Expo configuration
├── package.json               # Dependencies and scripts
├── src/
│   ├── components/            # Screen components
│   │   ├── SplashScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── TrekMembersScreen.tsx
│   │   ├── GeoLocatorScreen.tsx
│   │   ├── IntelligentMapScreen.tsx
│   │   ├── TrekCodeScreen.tsx
│   │   └── DeviceStatusScreen.tsx
│   └── styles/                # Styling
│       ├── colors.js          # Color constants
│       └── commonStyles.js    # Common styles
```

## Key Features Converted

### UI Components
- All Radix UI components converted to React Native equivalents
- Custom card layouts and navigation tabs
- Real-time data updates with animations
- Dark theme with technical/emergency color scheme

### Navigation
- Bottom tab navigation with 7 screens
- Ionicons for consistent iconography
- Smooth transitions and animations

### Styling
- CSS classes converted to React Native StyleSheet
- Responsive design maintained
- Color scheme preserved (dark theme with green/red/blue accents)

### Functionality
- Emergency SOS system with countdown
- Real-time sensor data simulation
- Team member tracking
- GPS location services
- Device status monitoring
- Network configuration

## Development

The app maintains the exact same functionality as the original React web version:

- **Emergency System**: Large red SOS button with 30-second countdown
- **Sensor Data**: Real-time MPU6050 accelerometer/gyroscope readings
- **Team Tracking**: LoRa mesh network with signal strength indicators
- **GPS Features**: Location tracking, offline maps, navigation tools
- **Device Monitoring**: Battery levels, temperature, signal strength
- **Network Config**: LoRa settings, trek codes, device management

## Building for Production

```bash
# Build for Android
expo build:android

# Build for iOS
expo build:ios

# Build for web
expo build:web
```

## License

© 2024 Lifeline IoT Technologies - Emergency Response System