# Lifeline IoT - React Native Emergency Response System

**Intelligent Safety Beyond Networks** - A comprehensive IoT-based emergency response system built with React Native and Expo.

## Features

- **🚨 Emergency SOS System** - One-touch emergency activation with countdown timer
- **📱 Real-time Sensor Monitoring** - MPU6050 accelerometer/gyroscope data visualization  
- **🔧 IoT Device Management** - Comprehensive device status and diagnostics
- **👥 Team Coordination** - Trek member management and communication
- **📍 GPS Navigation** - Advanced location tracking and waypoint management
- **📡 LoRa Mesh Networking** - Device-to-device communication in remote areas
- **🗺️ Intelligent Mapping** - Interactive maps with IoT device overlays
- **⚡ Professional Dark Theme** - Circuit board aesthetics with technical interface

## Tech Stack

- **React Native** with Expo
- **React Navigation** for tab navigation
- **Expo Vector Icons** (Ionicons) for UI icons
- **React Native SVG** for circuit board graphics
- **Expo Haptics** for tactile feedback
- **Expo Sensors** for accelerometer/gyroscope data

## Getting Started

### Prerequisites

- Node.js (>= 16.0.0)
- npm or yarn
- Expo CLI (optional but recommended)
- Expo Go app on your mobile device

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lifeline-iot-react-native
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   # or
   expo start
   ```

### Running the App

1. **On Physical Device**
   - Install the Expo Go app from App Store/Google Play
   - Scan the QR code displayed in your terminal or browser
   - The app will load directly on your device

2. **On iOS Simulator**
   ```bash
   npm run ios
   # or
   expo start --ios
   ```

3. **On Android Emulator**
   ```bash
   npm run android
   # or
   expo start --android
   ```

4. **On Web Browser**
   ```bash
   npm run web
   # or
   expo start --web
   ```

## Project Structure

```
lifeline-iot-react-native/
├── App.js                     # Main application entry point
├── package.json              # Dependencies and scripts
├── app.json                  # Expo configuration
├── README.md                 # This file
├── screens/                  # All application screens
│   ├── SplashScreen.js      # Animated splash with initialization
│   ├── HomeScreen.js        # Emergency command center
│   ├── ProfileScreen.js     # System configuration
│   ├── TrekMembersScreen.js # Team management
│   ├── GeoLocatorScreen.js  # GPS navigation
│   ├── IntelligentMapScreen.js # Interactive mapping
│   ├── TrekCodeScreen.js    # LoRa network management
│   └── DeviceStatusScreen.js # IoT diagnostics
├── components/               # Reusable UI components
│   ├── CircuitBoardBackground.js # SVG circuit pattern
│   └── SliderComponent.js   # Custom slider for settings
├── styles/                   # Styling constants
│   ├── colors.js            # Color palette
│   └── commonStyles.js      # Shared StyleSheet objects
└── assets/                   # Images and icons (create this folder)
```

## Screen Overview

### 1. **Emergency (Home Screen)**
- Large SOS button with haptic feedback
- Real-time sensor data from MPU6050
- System status grid (Battery, GPS, LoRa, Connected devices)
- Quick actions for location sharing and team contact

### 2. **Profile (System Configuration)**
- User profile management
- Device settings (impact sensitivity, alert thresholds)
- System preferences (notifications, vibration, offline maps)
- Network configuration display

### 3. **Team (Trek Members)**
- Team member status and tracking
- Emergency alerts and notifications
- Add/manage team members
- Emergency broadcast functionality

### 4. **Location (GPS Navigator)**
- Current GPS coordinates with DMS format
- GPS status and satellite information
- Waypoint management and route tracking
- Emergency beacon activation

### 5. **Map (Intelligent Mapping)**
- Interactive map display simulation
- IoT device overlay toggles
- Real-time device positioning
- Offline map download options

### 6. **Network (LoRa Communication)**
- Mesh network status and metrics
- Join network with trek codes
- Connected device management
- Network diagnostics tools

### 7. **Devices (IoT Diagnostics)**
- System performance monitoring
- Sensor module status
- Firmware information and updates
- System logs and diagnostics

## Key Features Explained

### Emergency SOS System
- Press and hold emergency button triggers 30-second countdown
- Haptic feedback and visual animations
- Automatic emergency activation if countdown reaches zero
- Cancel option during countdown phase

### Real-time Data Simulation
- Simulated MPU6050 sensor data updates every second
- Dynamic GPS coordinates and satellite tracking
- Live system performance metrics
- Real-time network status updates

### Professional UI/UX
- Dark theme optimized for outdoor use
- Circuit board background patterns
- Haptic feedback for all interactions
- Status indicators with color coding
- Monospace fonts for technical data

### Navigation System
- Bottom tab navigation with 7 main screens
- Icons change based on active/inactive state
- Smooth transitions and consistent styling
- Safe area handling for different device sizes

## Customization

### Colors
Edit `/styles/colors.js` to customize the color palette:
```javascript
export const colors = {
  primary: '#0066CC',      // Main blue
  emergency: '#FF0000',    // Emergency red  
  success: '#00CC00',      // Success green
  warning: '#FF6600',      // Warning orange
  technical: '#00FF00',    // Technical green
  // ... more colors
};
```

### Styling
Common styles are in `/styles/commonStyles.js`:
```javascript
export const commonStyles = StyleSheet.create({
  card: { /* Card styling */ },
  primaryButton: { /* Button styling */ },
  // ... more styles
});
```

## Mock Data & Simulation

The app includes comprehensive mock data for:
- **Sensor readings**: Simulated MPU6050 accelerometer/gyroscope data
- **GPS coordinates**: Dynamic location updates
- **Team members**: Sample team with different statuses
- **IoT devices**: Simulated device network with various sensors
- **System metrics**: CPU, memory, temperature, battery usage

## Testing & Development

### Console Logging
All interactions are logged to console with descriptive messages:
```javascript
console.log('SOS button pressed');
console.log('Emergency activated!');
console.log('Member pressed:', member);
```

### Haptic Feedback
Tactile feedback for all user interactions:
- Light impact for button presses
- Medium impact for setting changes  
- Heavy impact for critical actions
- Success/error notifications for alerts

### Alert Dialogs
Native alerts for user confirmation and information display throughout the app.

## Deployment

### Building for Production

1. **iOS**
   ```bash
   expo build:ios
   ```

2. **Android**
   ```bash
   expo build:android
   ```

3. **Web**
   ```bash
   expo build:web
   ```

### Standalone App
```bash
expo eject
# Follow platform-specific build instructions
```

## Contributing

1. Follow React Native best practices
2. Maintain the technical aesthetic theme
3. Add proper console logging for debugging
4. Include haptic feedback for interactions
5. Test on multiple device sizes
6. Ensure offline functionality works properly

## License

This project is part of the Lifeline IoT Emergency Response System.

---

**Emergency Contact**: For real emergencies, always contact local emergency services first (911, 112, etc.)

## Troubleshooting

### Common Issues

1. **Metro bundler not starting**
   ```bash
   npx react-native start --reset-cache
   ```

2. **Dependencies not installing**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Expo Go not loading**
   - Ensure your device and computer are on the same network
   - Try restarting the Expo development server
   - Clear Expo Go app cache

4. **Icons not displaying**
   - Ensure @expo/vector-icons is installed
   - Restart the development server

For additional support, check the Expo documentation at https://docs.expo.dev/