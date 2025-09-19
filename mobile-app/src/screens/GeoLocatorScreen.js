import React, { useState, useEffect } from 'react';
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

const GeoLocatorScreen = () => {
  const [locationData, setLocationData] = useState({
    latitude: 27.9881,
    longitude: 86.9250,
    altitude: 5364,
    accuracy: 3.2,
    speed: 0.0,
    bearing: 285,
    timestamp: new Date(),
  });

  const [gpsStatus, setGpsStatus] = useState({
    satellites: 8,
    signalStrength: 'High',
    hdop: 1.2,
    vdop: 1.8,
    pdop: 2.1,
    fix: '3D'
  });

  const [trackingEnabled, setTrackingEnabled] = useState(true);
  const [waypoints, setWaypoints] = useState([
    { id: 1, name: 'Base Camp', lat: 27.9881, lng: 86.9250, elevation: 5364, timestamp: new Date(Date.now() - 3600000) },
    { id: 2, name: 'Camp 1', lat: 28.0021, lng: 86.9312, elevation: 6100, timestamp: new Date(Date.now() - 1800000) },
    { id: 3, name: 'Current Position', lat: 28.0142, lng: 86.9385, elevation: 6800, timestamp: new Date() }
  ]);

  useEffect(() => {
    // Simulate real-time GPS updates
    const interval = setInterval(() => {
      setLocationData(prev => ({
        ...prev,
        latitude: prev.latitude + (Math.random() - 0.5) * 0.0001,
        longitude: prev.longitude + (Math.random() - 0.5) * 0.0001,
        altitude: prev.altitude + (Math.random() - 0.5) * 10,
        accuracy: Math.max(1, Math.min(10, prev.accuracy + (Math.random() - 0.5) * 1)),
        speed: Math.max(0, Math.min(5, prev.speed + (Math.random() - 0.5) * 2)),
        bearing: (prev.bearing + (Math.random() - 0.5) * 20) % 360,
        timestamp: new Date(),
      }));

      // Randomly update satellite count
      if (Math.random() > 0.8) {
        setGpsStatus(prev => ({
          ...prev,
          satellites: Math.max(4, Math.min(12, prev.satellites + Math.floor((Math.random() - 0.5) * 3))),
          hdop: Math.max(0.5, Math.min(5, prev.hdop + (Math.random() - 0.5) * 0.5))
        }));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleShareLocation = () => {
    console.log('Sharing current location:', locationData);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const locationString = `${locationData.latitude.toFixed(6)}, ${locationData.longitude.toFixed(6)}`;
    Alert.alert(
      'Share Location',
      `Current coordinates:\n${locationString}\nAltitude: ${locationData.altitude.toFixed(0)}m`,
      [
        { text: 'Copy Coordinates', onPress: () => console.log('Coordinates copied') },
        { text: 'Send to Team', onPress: () => console.log('Location sent to team') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleSaveWaypoint = () => {
    const newWaypoint = {
      id: waypoints.length + 1,
      name: `Waypoint ${waypoints.length + 1}`,
      lat: locationData.latitude,
      lng: locationData.longitude,
      elevation: locationData.altitude,
      timestamp: new Date()
    };

    setWaypoints([...waypoints, newWaypoint]);
    console.log('New waypoint saved:', newWaypoint);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Waypoint Saved', `${newWaypoint.name} has been saved to your route.`);
  };

  const handleEmergencyBeacon = () => {
    console.log('Emergency beacon activated');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    Alert.alert(
      'Emergency Location Beacon',
      'Activate emergency location beacon? This will continuously broadcast your position to rescue services.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Activate', 
          style: 'destructive',
          onPress: () => {
            console.log('Emergency beacon activated');
            Alert.alert('Emergency Beacon Active', 'Your location is now being broadcast to emergency services.');
          }
        }
      ]
    );
  };

  const formatCoordinate = (coord, isLongitude = false) => {
    const direction = isLongitude ? (coord >= 0 ? 'E' : 'W') : (coord >= 0 ? 'N' : 'S');
    const abs = Math.abs(coord);
    const degrees = Math.floor(abs);
    const minutes = Math.floor((abs - degrees) * 60);
    const seconds = ((abs - degrees - minutes / 60) * 3600).toFixed(2);
    return `${degrees}°${minutes}'${seconds}"${direction}`;
  };

  const getSignalStrengthColor = () => {
    if (gpsStatus.satellites >= 8) return colors.success;
    if (gpsStatus.satellites >= 6) return colors.warning;
    return colors.emergency;
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <ScrollView contentContainerStyle={commonStyles.scrollContainer}>
        {/* Header */}
        <View style={commonStyles.spaceBetween}>
          <View>
            <Text style={commonStyles.title}>GPS Navigator</Text>
            <Text style={commonStyles.subtitle}>Location & Navigation System</Text>
          </View>
          <View style={[commonStyles.statusIndicator, { 
            backgroundColor: getSignalStrengthColor() + '33', 
            borderColor: getSignalStrengthColor() 
          }]}>
            <Text style={[commonStyles.statusText, { color: getSignalStrengthColor() }]}>
              {gpsStatus.satellites} Satellites
            </Text>
          </View>
        </View>

        {/* Current Location */}
        <View style={commonStyles.card}>
          <View style={commonStyles.cardHeader}>
            <Ionicons name="location" size={20} color={colors.primary} />
            <Text style={commonStyles.cardTitle}>Current Location</Text>
          </View>

          <View style={styles.coordinatesContainer}>
            <View style={styles.coordinateRow}>
              <Text style={styles.coordinateLabel}>Latitude:</Text>
              <Text style={commonStyles.technicalText}>
                {locationData.latitude.toFixed(6)}°
              </Text>
            </View>
            <View style={styles.coordinateRow}>
              <Text style={styles.coordinateLabel}>Longitude:</Text>
              <Text style={commonStyles.technicalText}>
                {locationData.longitude.toFixed(6)}°
              </Text>
            </View>
            <View style={styles.coordinateRow}>
              <Text style={styles.coordinateLabel}>DMS Format:</Text>
              <Text style={commonStyles.technicalText}>
                {formatCoordinate(locationData.latitude)}
              </Text>
            </View>
            <View style={styles.coordinateRow}>
              <Text style={styles.coordinateLabel}></Text>
              <Text style={commonStyles.technicalText}>
                {formatCoordinate(locationData.longitude, true)}
              </Text>
            </View>
          </View>

          <View style={styles.locationStats}>
            <View style={styles.statItem}>
              <Ionicons name="trending-up" size={16} color={colors.foreground} />
              <Text style={styles.statLabel}>Altitude</Text>
              <Text style={styles.statValue}>{locationData.altitude.toFixed(0)}m</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="target" size={16} color={colors.foreground} />
              <Text style={styles.statLabel}>Accuracy</Text>
              <Text style={styles.statValue}>±{locationData.accuracy.toFixed(1)}m</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="speedometer" size={16} color={colors.foreground} />
              <Text style={styles.statLabel}>Speed</Text>
              <Text style={styles.statValue}>{locationData.speed.toFixed(1)} km/h</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="compass" size={16} color={colors.foreground} />
              <Text style={styles.statLabel}>Bearing</Text>
              <Text style={styles.statValue}>{locationData.bearing.toFixed(0)}°</Text>
            </View>
          </View>
        </View>

        {/* GPS Status */}
        <View style={commonStyles.card}>
          <View style={commonStyles.cardHeader}>
            <Ionicons name="satellite" size={20} color={colors.technical} />
            <Text style={commonStyles.cardTitle}>GPS Status</Text>
          </View>

          <View style={styles.gpsStatusGrid}>
            <View style={styles.gpsStatItem}>
              <Text style={commonStyles.smallText}>Satellites</Text>
              <Text style={[styles.gpsStatValue, { color: getSignalStrengthColor() }]}>
                {gpsStatus.satellites}/12
              </Text>
            </View>
            <View style={styles.gpsStatItem}>
              <Text style={commonStyles.smallText}>Fix Type</Text>
              <Text style={styles.gpsStatValue}>{gpsStatus.fix}</Text>
            </View>
            <View style={styles.gpsStatItem}>
              <Text style={commonStyles.smallText}>HDOP</Text>
              <Text style={styles.gpsStatValue}>{gpsStatus.hdop.toFixed(1)}</Text>
            </View>
            <View style={styles.gpsStatItem}>
              <Text style={commonStyles.smallText}>VDOP</Text>
              <Text style={styles.gpsStatValue}>{gpsStatus.vdop.toFixed(1)}</Text>
            </View>
            <View style={styles.gpsStatItem}>
              <Text style={commonStyles.smallText}>PDOP</Text>
              <Text style={styles.gpsStatValue}>{gpsStatus.pdop.toFixed(1)}</Text>
            </View>
            <View style={styles.gpsStatItem}>
              <Text style={commonStyles.smallText}>Signal</Text>
              <Text style={[styles.gpsStatValue, { color: getSignalStrengthColor() }]}>
                {gpsStatus.signalStrength}
              </Text>
            </View>
          </View>

          {/* Satellite visualization */}
          <View style={styles.satelliteContainer}>
            <Text style={[commonStyles.smallText, { marginBottom: 8 }]}>Satellite Signal Strength</Text>
            <View style={styles.satelliteBars}>
              {Array.from({ length: 12 }, (_, i) => (
                <View 
                  key={i} 
                  style={[
                    styles.satelliteBar, 
                    {
                      height: 20 + (i * 2),
                      backgroundColor: i < gpsStatus.satellites ? getSignalStrengthColor() : colors.muted,
                      opacity: i < gpsStatus.satellites ? 1 : 0.3
                    }
                  ]} 
                />
              ))}
            </View>
          </View>
        </View>

        {/* Waypoints */}
        <View style={commonStyles.card}>
          <View style={commonStyles.cardHeader}>
            <Ionicons name="flag" size={20} color={colors.warning} />
            <Text style={commonStyles.cardTitle}>Route Waypoints ({waypoints.length})</Text>
          </View>

          {waypoints.map((waypoint, index) => (
            <View key={waypoint.id} style={styles.waypointItem}>
              <View style={[styles.waypointIndex, { 
                backgroundColor: index === waypoints.length - 1 ? colors.primary : colors.muted 
              }]}>
                <Text style={styles.waypointIndexText}>{index + 1}</Text>
              </View>
              
              <View style={styles.waypointInfo}>
                <Text style={styles.waypointName}>{waypoint.name}</Text>
                <Text style={commonStyles.technicalText}>
                  {waypoint.lat.toFixed(6)}, {waypoint.lng.toFixed(6)}
                </Text>
                <Text style={commonStyles.smallText}>
                  Elevation: {waypoint.elevation.toFixed(0)}m • {waypoint.timestamp.toLocaleTimeString()}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsGrid}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleShareLocation}
          >
            <Ionicons name="share" size={24} color={colors.primary} />
            <Text style={styles.actionButtonText}>Share Location</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleSaveWaypoint}
          >
            <Ionicons name="bookmark" size={24} color={colors.success} />
            <Text style={styles.actionButtonText}>Save Waypoint</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {
              console.log('Navigation started');
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              Alert.alert('Navigation', 'GPS navigation features coming soon.');
            }}
          >
            <Ionicons name="navigate" size={24} color={colors.network} />
            <Text style={styles.actionButtonText}>Start Navigation</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, { borderColor: colors.emergency }]}
            onPress={handleEmergencyBeacon}
          >
            <Ionicons name="radio" size={24} color={colors.emergency} />
            <Text style={[styles.actionButtonText, { color: colors.emergency }]}>Emergency Beacon</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  coordinatesContainer: {
    marginBottom: 16,
  },
  coordinateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  coordinateLabel: {
    fontSize: 14,
    color: colors.mutedForeground,
    flex: 1,
  },
  locationStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  statItem: {
    width: '50%',
    paddingHorizontal: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.foreground,
    marginTop: 2,
  },
  gpsStatusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  gpsStatItem: {
    width: '33.33%',
    alignItems: 'center',
    marginBottom: 12,
  },
  gpsStatValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.foreground,
    marginTop: 4,
  },
  satelliteContainer: {
    marginTop: 8,
  },
  satelliteBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 40,
    justifyContent: 'space-between',
  },
  satelliteBar: {
    width: 18,
    borderRadius: 2,
    marginHorizontal: 1,
  },
  waypointItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  waypointIndex: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  waypointIndexText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.foreground,
  },
  waypointInfo: {
    flex: 1,
  },
  waypointName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.foreground,
    marginBottom: 4,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
    marginTop: 8,
  },
  actionButton: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.card,
  },
  actionButtonText: {
    fontSize: 12,
    color: colors.foreground,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default GeoLocatorScreen;