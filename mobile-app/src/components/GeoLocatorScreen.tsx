import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/colors';
import { commonStyles } from '../styles/commonStyles';

const GeoLocatorScreen = () => {
  const [location, setLocation] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    altitude: 245.8,
    accuracy: 3.2,
    speed: 0.0,
    heading: 180,
    timestamp: new Date()
  });

  const [gpsStatus, setGpsStatus] = useState({
    satellites: 8,
    hdop: 1.2,
    vdop: 1.8,
    pdop: 2.1,
    fix: '3D'
  });

  const [tracking, setTracking] = useState(false);
  const [trackData, setTrackData] = useState({
    distance: 2.4,
    duration: 45,
    points: 127,
    avgSpeed: 3.2
  });

  const [offlineMaps] = useState([
    { name: 'Yosemite National Park', size: '245 MB', downloaded: 100 },
    { name: 'Sierra Nevada Range', size: '156 MB', downloaded: 100 },
    { name: 'Bay Area Trails', size: '89 MB', downloaded: 67 },
    { name: 'Pacific Coast', size: '312 MB', downloaded: 0 }
  ]);

  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    // Simulate GPS updates
    const interval = setInterval(() => {
      if (tracking) {
        setLocation(prev => ({
          ...prev,
          latitude: prev.latitude + (Math.random() - 0.5) * 0.0001,
          longitude: prev.longitude + (Math.random() - 0.5) * 0.0001,
          altitude: prev.altitude + (Math.random() - 0.5) * 2,
          speed: Math.random() * 5,
          heading: (prev.heading + (Math.random() - 0.5) * 10) % 360,
          timestamp: new Date()
        }));

        setTrackData(prev => ({
          ...prev,
          distance: prev.distance + Math.random() * 0.1,
          points: prev.points + 1,
          duration: prev.duration + 1
        }));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [tracking]);

  useEffect(() => {
    if (tracking) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
      return () => pulseAnimation.stop();
    }
  }, [tracking]);

  const formatCoordinate = (coord: number, isLat = true) => {
    const abs = Math.abs(coord);
    const deg = Math.floor(abs);
    const min = Math.floor((abs - deg) * 60);
    const sec = ((abs - deg - min / 60) * 3600).toFixed(1);
    const dir = isLat ? (coord >= 0 ? 'N' : 'S') : (coord >= 0 ? 'E' : 'W');
    return `${deg}°${min}'${sec}"${dir}`;
  };

  const toggleTracking = () => {
    setTracking(!tracking);
  };

  const Card = ({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name={icon as any} size={20} color={colors.foreground} />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <View style={styles.cardContent}>
        {children}
      </View>
    </View>
  );

  const ProgressBar = ({ progress, color = colors.primary }: { progress: number; color?: string }) => (
    <View style={styles.progressContainer}>
      <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: color }]} />
    </View>
  );

  const MapCard = ({ map }: { map: any }) => (
    <View style={styles.mapCard}>
      <View style={styles.mapInfo}>
        <Text style={styles.mapName}>{map.name}</Text>
        <Text style={styles.mapSize}>{map.size}</Text>
      </View>
      <View style={styles.mapStatus}>
        <Text style={styles.mapProgress}>{map.downloaded}%</Text>
        {map.downloaded === 100 ? (
          <View style={[styles.mapBadge, { backgroundColor: colors.success }]}>
            <Text style={[styles.mapBadgeText, { color: colors.successForeground }]}>
              Downloaded
            </Text>
          </View>
        ) : map.downloaded > 0 ? (
          <View style={[styles.mapBadge, { backgroundColor: colors.warning }]}>
            <Text style={[styles.mapBadgeText, { color: colors.warningForeground }]}>
              {map.downloaded}%
            </Text>
          </View>
        ) : (
          <TouchableOpacity style={[styles.downloadButton, { borderColor: colors.border }]}>
            <Text style={styles.downloadButtonText}>Download</Text>
          </TouchableOpacity>
        )}
      </View>
      {map.downloaded > 0 && map.downloaded < 100 && (
        <ProgressBar progress={map.downloaded} color={colors.primary} />
      )}
    </View>
  );

  return (
    <SafeAreaView style={commonStyles.screenContainer}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Geo Locator</Text>
            <Text style={styles.headerSubtitle}>Location Tracking & Navigation</Text>
          </View>
          <View style={[
            styles.gpsBadge,
            { backgroundColor: gpsStatus.fix === '3D' ? colors.success : colors.muted }
          ]}>
            <Text style={[
              styles.gpsBadgeText,
              { color: gpsStatus.fix === '3D' ? colors.successForeground : colors.mutedForeground }
            ]}>
              GPS {gpsStatus.fix}
            </Text>
          </View>
        </View>

        {/* Current Location */}
        <Card title="Current Position" icon="location">
          <View style={styles.coordinatesGrid}>
            <View style={styles.coordinateItem}>
              <Text style={styles.coordinateLabel}>Latitude</Text>
              <Text style={styles.coordinateValue}>{location.latitude.toFixed(6)}°</Text>
              <Text style={styles.coordinateFormatted}>{formatCoordinate(location.latitude, true)}</Text>
            </View>
            <View style={styles.coordinateItem}>
              <Text style={styles.coordinateLabel}>Longitude</Text>
              <Text style={styles.coordinateValue}>{location.longitude.toFixed(6)}°</Text>
              <Text style={styles.coordinateFormatted}>{formatCoordinate(location.longitude, false)}</Text>
            </View>
          </View>

          <View style={styles.locationStats}>
            <View style={styles.locationStat}>
              <Text style={styles.locationStatLabel}>Altitude</Text>
              <Text style={styles.locationStatValue}>{location.altitude.toFixed(1)} m</Text>
            </View>
            <View style={styles.locationStat}>
              <Text style={styles.locationStatLabel}>Speed</Text>
              <Text style={styles.locationStatValue}>{location.speed.toFixed(1)} m/s</Text>
            </View>
            <View style={styles.locationStat}>
              <Text style={styles.locationStatLabel}>Heading</Text>
              <Text style={styles.locationStatValue}>{location.heading.toFixed(0)}°</Text>
            </View>
          </View>

          <View style={styles.accuracySection}>
            <View style={styles.accuracyInfo}>
              <Ionicons name="target" size={16} color={colors.success} />
              <Text style={styles.accuracyText}>Accuracy: {location.accuracy.toFixed(1)}m</Text>
            </View>
            <Text style={styles.timestampText}>
              {location.timestamp.toLocaleTimeString()}
            </Text>
          </View>
        </Card>

        {/* GPS Status */}
        <Card title="GPS Status" icon="radio">
          <View style={styles.gpsStats}>
            <View style={styles.gpsColumn}>
              <View style={styles.gpsStat}>
                <Text style={styles.gpsStatLabel}>Satellites</Text>
                <Text style={[styles.gpsStatValue, { color: colors.success }]}>
                  {gpsStatus.satellites}
                </Text>
              </View>
              <View style={styles.gpsStat}>
                <Text style={styles.gpsStatLabel}>HDOP</Text>
                <Text style={styles.gpsStatValue}>{gpsStatus.hdop}</Text>
              </View>
              <View style={styles.gpsStat}>
                <Text style={styles.gpsStatLabel}>VDOP</Text>
                <Text style={styles.gpsStatValue}>{gpsStatus.vdop}</Text>
              </View>
            </View>
            <View style={styles.gpsColumn}>
              <View style={styles.gpsStat}>
                <Text style={styles.gpsStatLabel}>Fix Type</Text>
                <View style={[styles.fixBadge, { borderColor: colors.success }]}>
                  <Text style={[styles.fixBadgeText, { color: colors.success }]}>
                    {gpsStatus.fix}
                  </Text>
                </View>
              </View>
              <View style={styles.gpsStat}>
                <Text style={styles.gpsStatLabel}>PDOP</Text>
                <Text style={styles.gpsStatValue}>{gpsStatus.pdop}</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Track Recording */}
        <Card title="Track Recording" icon="map">
          <View style={styles.trackHeader}>
            <Text style={styles.trackTitle}>Track Recording</Text>
            <Animated.View style={{ transform: [{ scale: tracking ? pulseAnim : 1 }] }}>
              <TouchableOpacity
                style={[
                  styles.trackButton,
                  { backgroundColor: tracking ? colors.emergency : colors.primary }
                ]}
                onPress={toggleTracking}
              >
                <Text style={[
                  styles.trackButtonText,
                  { color: tracking ? colors.emergencyForeground : colors.primaryForeground }
                ]}>
                  {tracking ? "Stop" : "Start"}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
          <View style={styles.trackStats}>
            <View style={styles.trackColumn}>
              <View style={styles.trackStat}>
                <Text style={styles.trackStatLabel}>Distance</Text>
                <Text style={styles.trackStatValue}>{trackData.distance.toFixed(2)} km</Text>
              </View>
              <View style={styles.trackStat}>
                <Text style={styles.trackStatLabel}>Duration</Text>
                <Text style={styles.trackStatValue}>
                  {Math.floor(trackData.duration / 60)}:{(trackData.duration % 60).toString().padStart(2, '0')}
                </Text>
              </View>
            </View>
            <View style={styles.trackColumn}>
              <View style={styles.trackStat}>
                <Text style={styles.trackStatLabel}>Points</Text>
                <Text style={styles.trackStatValue}>{trackData.points}</Text>
              </View>
              <View style={styles.trackStat}>
                <Text style={styles.trackStatLabel}>Avg Speed</Text>
                <Text style={styles.trackStatValue}>{trackData.avgSpeed.toFixed(1)} km/h</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Offline Maps */}
        <Card title="Offline Maps" icon="download">
          <View style={styles.mapsSection}>
            {offlineMaps.map((map, index) => (
              <MapCard key={index} map={map} />
            ))}
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={[commonStyles.secondaryButton, styles.actionButton]}>
            <Ionicons name="share" size={16} color={colors.foreground} />
            <Text style={[commonStyles.secondaryButtonText, { marginLeft: 8 }]}>
              Share Location
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[commonStyles.primaryButton, styles.actionButton]}>
            <Ionicons name="navigate" size={16} color={colors.primaryForeground} />
            <Text style={[commonStyles.primaryButtonText, { marginLeft: 8 }]}>
              Navigate
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  gpsBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  gpsBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.foreground,
    marginLeft: 8,
  },
  cardContent: {
    // Content styles handled by children
  },
  coordinatesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  coordinateItem: {
    flex: 1,
    marginHorizontal: 4,
  },
  coordinateLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginBottom: 4,
  },
  coordinateValue: {
    fontSize: 16,
    fontFamily: 'monospace',
    color: colors.foreground,
    marginBottom: 2,
  },
  coordinateFormatted: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  locationStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  locationStat: {
    flex: 1,
    alignItems: 'center',
  },
  locationStatLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginBottom: 4,
  },
  locationStatValue: {
    fontSize: 16,
    fontFamily: 'monospace',
    color: colors.foreground,
  },
  accuracySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  accuracyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accuracyText: {
    fontSize: 14,
    color: colors.foreground,
    marginLeft: 8,
  },
  timestampText: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  gpsStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gpsColumn: {
    flex: 1,
  },
  gpsStat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  gpsStatLabel: {
    fontSize: 14,
    color: colors.foreground,
  },
  gpsStatValue: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: colors.foreground,
  },
  fixBadge: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  fixBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  trackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.foreground,
  },
  trackButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  trackButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  trackStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  trackColumn: {
    flex: 1,
  },
  trackStat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  trackStatLabel: {
    fontSize: 14,
    color: colors.foreground,
  },
  trackStatValue: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: colors.foreground,
  },
  mapsSection: {
    // Maps container
  },
  mapCard: {
    marginBottom: 16,
  },
  mapInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  mapName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.foreground,
    flex: 1,
  },
  mapSize: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  mapStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mapProgress: {
    fontSize: 14,
    color: colors.foreground,
  },
  mapBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mapBadgeText: {
    fontSize: 10,
    fontWeight: '500',
  },
  downloadButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  downloadButtonText: {
    fontSize: 10,
    color: colors.foreground,
  },
  progressContainer: {
    height: 4,
    backgroundColor: colors.muted,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default GeoLocatorScreen;