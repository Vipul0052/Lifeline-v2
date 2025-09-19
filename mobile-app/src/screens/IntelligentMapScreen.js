import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors } from '../styles/colors';
import { commonStyles } from '../styles/commonStyles';

const IntelligentMapScreen = () => {
  const [mapType, setMapType] = useState('satellite');
  const [deviceOverlays, setDeviceOverlays] = useState({
    teammates: true,
    sensors: true,
    waypoints: true,
    hazards: false,
    weather: true
  });

  const [mapData] = useState({
    center: { lat: 27.9881, lng: 86.9250 },
    zoom: 15,
    totalArea: '2.4 km²',
    elevationRange: '5,200 - 6,800m',
    lastUpdate: new Date()
  });

  const [overlayDevices] = useState([
    {
      id: 1,
      type: 'teammate',
      name: 'Alex Thompson',
      lat: 27.9881,
      lng: 86.9250,
      status: 'online',
      battery: 87,
      lastUpdate: '2 min ago'
    },
    {
      id: 2,
      type: 'teammate',
      name: 'Emma Wilson',
      lat: 27.9921,
      lng: 86.9285,
      status: 'emergency',
      battery: 23,
      lastUpdate: '1 min ago'
    },
    {
      id: 3,
      type: 'sensor',
      name: 'Weather Station Alpha',
      lat: 27.9845,
      lng: 86.9312,
      status: 'active',
      data: { temp: -12, wind: 45, humidity: 78 },
      lastUpdate: '5 min ago'
    },
    {
      id: 4,
      type: 'waypoint',
      name: 'Base Camp',
      lat: 27.9881,
      lng: 86.9250,
      elevation: 5364,
      type: 'camp'
    },
    {
      id: 5,
      type: 'hazard',
      name: 'Crevasse Zone',
      lat: 27.9965,
      lng: 86.9334,
      severity: 'high',
      description: 'Known crevasse field - use marked route'
    }
  ]);

  const handleMapTypeChange = (type) => {
    console.log('Map type changed to:', type);
    setMapType(type);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleOverlayToggle = (overlay) => {
    const newOverlays = { ...deviceOverlays, [overlay]: !deviceOverlays[overlay] };
    setDeviceOverlays(newOverlays);
    console.log('Overlay toggled:', overlay, newOverlays[overlay]);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleDownloadOfflineMap = () => {
    console.log('Download offline map requested');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Download Offline Map',
      'Download detailed map data for offline use? This will use approximately 150MB of storage.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Download', 
          onPress: () => {
            console.log('Offline map download started');
            Alert.alert('Download Started', 'Map data is being downloaded for offline use.');
          }
        }
      ]
    );
  };

  const handleCenterOnLocation = () => {
    console.log('Center on current location');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Location Centered', 'Map centered on your current position.');
  };

  const handleDevicePress = (device) => {
    console.log('Device pressed:', device);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    let message = `Type: ${device.type}\nLocation: ${device.lat.toFixed(6)}, ${device.lng.toFixed(6)}`;
    
    if (device.type === 'teammate') {
      message += `\nStatus: ${device.status}\nBattery: ${device.battery}%\nLast Update: ${device.lastUpdate}`;
    } else if (device.type === 'sensor' && device.data) {
      message += `\nTemperature: ${device.data.temp}°C\nWind: ${device.data.wind} km/h\nHumidity: ${device.data.humidity}%`;
    } else if (device.type === 'waypoint') {
      message += `\nElevation: ${device.elevation}m\nType: ${device.type}`;
    } else if (device.type === 'hazard') {
      message += `\nSeverity: ${device.severity}\nDescription: ${device.description}`;
    }

    Alert.alert(device.name, message);
  };

  const getDeviceIcon = (device) => {
    switch (device.type) {
      case 'teammate':
        return device.status === 'emergency' ? 'warning' : 'person';
      case 'sensor':
        return 'thermometer';
      case 'waypoint':
        return 'flag';
      case 'hazard':
        return 'alert-circle';
      default:
        return 'location';
    }
  };

  const getDeviceColor = (device) => {
    if (device.type === 'teammate') {
      return device.status === 'emergency' ? colors.emergency : colors.success;
    } else if (device.type === 'sensor') {
      return colors.technical;
    } else if (device.type === 'waypoint') {
      return colors.warning;
    } else if (device.type === 'hazard') {
      return colors.emergency;
    }
    return colors.primary;
  };

  const getVisibleDevices = () => {
    return overlayDevices.filter(device => {
      switch (device.type) {
        case 'teammate':
          return deviceOverlays.teammates;
        case 'sensor':
          return deviceOverlays.sensors;
        case 'waypoint':
          return deviceOverlays.waypoints;
        case 'hazard':
          return deviceOverlays.hazards;
        default:
          return true;
      }
    });
  };

  const visibleDevices = getVisibleDevices();

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <ScrollView contentContainerStyle={commonStyles.scrollContainer}>
        {/* Header */}
        <View style={commonStyles.spaceBetween}>
          <View>
            <Text style={commonStyles.title}>Intelligent Map</Text>
            <Text style={commonStyles.subtitle}>IoT Device Overlay & Navigation</Text>
          </View>
          <View style={[commonStyles.statusIndicator, { backgroundColor: colors.network + '33', borderColor: colors.network }]}>
            <Text style={[commonStyles.statusText, { color: colors.network }]}>
              {visibleDevices.length} Devices
            </Text>
          </View>
        </View>

        {/* Map Preview */}
        <View style={commonStyles.card}>
          <View style={commonStyles.cardHeader}>
            <Ionicons name="map" size={20} color={colors.primary} />
            <Text style={commonStyles.cardTitle}>Map View</Text>
          </View>

          {/* Simulated Map Display */}
          <View style={styles.mapContainer}>
            <View style={styles.mapPlaceholder}>
              <Ionicons name="map-outline" size={64} color={colors.mutedForeground} />
              <Text style={styles.mapPlaceholderText}>
                Interactive Map Display
              </Text>
              <Text style={commonStyles.smallText}>
                {mapData.totalArea} • {mapData.elevationRange}
              </Text>
              
              {/* Device markers simulation */}
              <View style={styles.markersContainer}>
                {visibleDevices.slice(0, 5).map((device) => (
                  <TouchableOpacity 
                    key={device.id}
                    style={[styles.deviceMarker, { backgroundColor: getDeviceColor(device) }]}
                    onPress={() => handleDevicePress(device)}
                  >
                    <Ionicons 
                      name={getDeviceIcon(device)} 
                      size={12} 
                      color={colors.foreground} 
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Map Controls */}
          <View style={styles.mapControls}>
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={handleCenterOnLocation}
            >
              <Ionicons name="locate" size={20} color={colors.primary} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={() => {
                console.log('Zoom in');
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Ionicons name="add" size={20} color={colors.foreground} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.controlButton}
              onPress={() => {
                console.log('Zoom out');
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Ionicons name="remove" size={20} color={colors.foreground} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Map Type Selection */}
        <View style={commonStyles.card}>
          <View style={commonStyles.cardHeader}>
            <Ionicons name="layers" size={20} color={colors.foreground} />
            <Text style={commonStyles.cardTitle}>Map Type</Text>
          </View>

          <View style={styles.mapTypeContainer}>
            {['satellite', 'terrain', 'hybrid', 'offline'].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.mapTypeButton,
                  mapType === type && styles.mapTypeButtonActive
                ]}
                onPress={() => handleMapTypeChange(type)}
              >
                <Text style={[
                  styles.mapTypeText,
                  mapType === type && styles.mapTypeTextActive
                ]}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Device Overlays */}
        <View style={commonStyles.card}>
          <View style={commonStyles.cardHeader}>
            <Ionicons name="options" size={20} color={colors.foreground} />
            <Text style={commonStyles.cardTitle}>Device Overlays</Text>
          </View>

          {Object.entries(deviceOverlays).map(([key, enabled]) => (
            <View key={key} style={styles.overlayOption}>
              <View style={commonStyles.row}>
                <Ionicons 
                  name={getOverlayIcon(key)} 
                  size={20} 
                  color={enabled ? colors.primary : colors.mutedForeground} 
                />
                <Text style={[styles.overlayLabel, { color: enabled ? colors.foreground : colors.mutedForeground }]}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Text>
                <Text style={styles.overlayCount}>
                  ({overlayDevices.filter(d => getDeviceCategory(d.type) === key).length})
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.toggleButton, enabled && styles.toggleButtonActive]}
                onPress={() => handleOverlayToggle(key)}
              >
                <View style={[styles.toggleIndicator, enabled && styles.toggleIndicatorActive]} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Visible Devices List */}
        <View style={commonStyles.card}>
          <View style={commonStyles.cardHeader}>
            <Ionicons name="list" size={20} color={colors.foreground} />
            <Text style={commonStyles.cardTitle}>
              Visible Devices ({visibleDevices.length})
            </Text>
          </View>

          {visibleDevices.map((device) => (
            <TouchableOpacity 
              key={device.id}
              style={styles.deviceItem}
              onPress={() => handleDevicePress(device)}
            >
              <View style={[styles.deviceIcon, { backgroundColor: getDeviceColor(device) + '33' }]}>
                <Ionicons 
                  name={getDeviceIcon(device)} 
                  size={16} 
                  color={getDeviceColor(device)} 
                />
              </View>
              
              <View style={styles.deviceInfo}>
                <Text style={styles.deviceName}>{device.name}</Text>
                <Text style={commonStyles.technicalText}>
                  {device.lat.toFixed(6)}, {device.lng.toFixed(6)}
                </Text>
                {device.lastUpdate && (
                  <Text style={commonStyles.smallText}>Updated: {device.lastUpdate}</Text>
                )}
              </View>
              
              <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={[commonStyles.secondaryButton, { flex: 1, marginRight: 8 }]}
            onPress={handleDownloadOfflineMap}
          >
            <View style={[commonStyles.row, { justifyContent: 'center' }]}>
              <Ionicons name="download" size={16} color={colors.foreground} style={{ marginRight: 8 }} />
              <Text style={commonStyles.secondaryButtonText}>Download Offline</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[commonStyles.primaryButton, { flex: 1, marginLeft: 8 }]}
            onPress={() => {
              console.log('Share map view');
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Alert.alert('Share Map', 'Map view shared with team members.');
            }}
          >
            <View style={[commonStyles.row, { justifyContent: 'center' }]}>
              <Ionicons name="share" size={16} color={colors.primaryForeground} style={{ marginRight: 8 }} />
              <Text style={commonStyles.primaryButtonText}>Share View</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Helper functions
const getOverlayIcon = (overlay) => {
  switch (overlay) {
    case 'teammates': return 'people';
    case 'sensors': return 'thermometer';
    case 'waypoints': return 'flag';
    case 'hazards': return 'warning';
    case 'weather': return 'cloudy';
    default: return 'location';
  }
};

const getDeviceCategory = (type) => {
  switch (type) {
    case 'teammate': return 'teammates';
    case 'sensor': return 'sensors';
    case 'waypoint': return 'waypoints';
    case 'hazard': return 'hazards';
    default: return 'teammates';
  }
};

const styles = StyleSheet.create({
  mapContainer: {
    marginBottom: 16,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: colors.muted,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mapPlaceholderText: {
    fontSize: 16,
    color: colors.mutedForeground,
    marginTop: 8,
  },
  markersContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
  },
  deviceMarker: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    top: Math.random() * 140 + 20,
    left: Math.random() * 200 + 20,
  },
  mapControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  controlButton: {
    width: 40,
    height: 40,
    backgroundColor: colors.card,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mapTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  mapTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    marginBottom: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mapTypeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  mapTypeText: {
    fontSize: 14,
    color: colors.foreground,
  },
  mapTypeTextActive: {
    color: colors.primaryForeground,
  },
  overlayOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  overlayLabel: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  overlayCount: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginRight: 12,
  },
  toggleButton: {
    width: 44,
    height: 24,
    backgroundColor: colors.muted,
    borderRadius: 12,
    padding: 2,
  },
  toggleButtonActive: {
    backgroundColor: colors.primary,
  },
  toggleIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.foreground,
  },
  toggleIndicatorActive: {
    transform: [{ translateX: 20 }],
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  deviceIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.foreground,
    marginBottom: 4,
  },
  quickActions: {
    flexDirection: 'row',
    marginTop: 16,
  },
});

export default IntelligentMapScreen;