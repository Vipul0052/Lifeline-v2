import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/colors';
import { commonStyles } from '../styles/commonStyles';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const [sosActive, setSosActive] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [sensorData, setSensorData] = useState({
    accelerometer: { x: 0.12, y: 0.03, z: 9.81 },
    gyroscope: { x: 0.01, y: -0.02, z: 0.00 },
    impact: false,
    temperature: 24.5
  });

  const [systemStatus, setSystemStatus] = useState({
    battery: 87,
    gpsAccuracy: 'High',
    loraSignal: 4,
    connectedDevices: 3,
    networkLatency: 45
  });

  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    // Simulate real-time sensor data updates
    const interval = setInterval(() => {
      setSensorData(prev => ({
        ...prev,
        accelerometer: {
          x: (Math.random() - 0.5) * 0.5,
          y: (Math.random() - 0.5) * 0.5,
          z: 9.81 + (Math.random() - 0.5) * 0.2
        },
        gyroscope: {
          x: (Math.random() - 0.5) * 0.1,
          y: (Math.random() - 0.5) * 0.1,
          z: (Math.random() - 0.5) * 0.1
        },
        temperature: 24.5 + (Math.random() - 0.5) * 2
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let timer;
    if (sosActive && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (sosActive && countdown === 0) {
      // Emergency activated
      console.log('Emergency SOS Activated!');
    }
    return () => clearTimeout(timer);
  }, [sosActive, countdown]);

  useEffect(() => {
    if (sosActive) {
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();
      return () => pulseAnimation.stop();
    }
  }, [sosActive]);

  const handleSOSPress = () => {
    setSosActive(true);
    setCountdown(30);
  };

  const handleSOSCancel = () => {
    setSosActive(false);
    setCountdown(30);
  };

  const getSignalBars = (strength: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <View
        key={i}
        style={[
          styles.signalBar,
          {
            height: (i + 1) * 3 + 2,
            opacity: i < strength ? 1 : 0.2,
          }
        ]}
      />
    ));
  };

  const StatusCard = ({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) => (
    <View style={styles.statusCard}>
      <View style={styles.cardHeader}>
        <Ionicons name={icon as any} size={16} color={colors.foreground} />
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

  return (
    <SafeAreaView style={commonStyles.screenContainer}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Emergency Command</Text>
            <Text style={styles.headerSubtitle}>Real-time System Monitoring</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: colors.technical }]}>
            <Text style={[styles.statusBadgeText, { color: colors.technicalForeground }]}>
              System Active
            </Text>
          </View>
        </View>

        {/* Emergency SOS Section */}
        <View style={[styles.emergencyCard, { borderColor: colors.emergency + '80' }]}>
          <View style={styles.emergencyContent}>
            {!sosActive ? (
              <TouchableOpacity
                style={[commonStyles.emergencyButton, { backgroundColor: colors.emergency }]}
                onPress={handleSOSPress}
                activeOpacity={0.8}
              >
                <View style={styles.sosButtonContent}>
                  <Ionicons name="shield" size={32} color={colors.emergencyForeground} />
                  <Text style={[styles.sosButtonText, { color: colors.emergencyForeground }]}>
                    EMERGENCY
                  </Text>
                  <Text style={[styles.sosButtonSubtext, { color: colors.emergencyForeground }]}>
                    SOS
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              <View style={styles.sosActiveContainer}>
                <Animated.View style={[
                  styles.sosActiveButton,
                  { backgroundColor: colors.emergency, transform: [{ scale: pulseAnim }] }
                ]}>
                  <View style={styles.sosActiveContent}>
                    <Ionicons name="time" size={32} color={colors.emergencyForeground} />
                    <Text style={[styles.countdownText, { color: colors.emergencyForeground }]}>
                      {countdown}
                    </Text>
                    <Text style={[styles.countdownLabel, { color: colors.emergencyForeground }]}>
                      seconds
                    </Text>
                  </View>
                </Animated.View>
                <TouchableOpacity
                  style={[commonStyles.secondaryButton, { marginTop: 16 }]}
                  onPress={handleSOSCancel}
                >
                  <Text style={commonStyles.secondaryButtonText}>Cancel Emergency</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* System Status Grid */}
        <View style={styles.statusGrid}>
          <StatusCard title="Battery" icon="battery-half">
            <Text style={styles.statusValue}>{systemStatus.battery}%</Text>
            <ProgressBar progress={systemStatus.battery} />
          </StatusCard>

          <StatusCard title="GPS" icon="location">
            <Text style={styles.statusValue}>{systemStatus.gpsAccuracy}</Text>
            <Text style={[styles.statusSubtext, { color: colors.success }]}>8 satellites</Text>
          </StatusCard>

          <StatusCard title="LoRa Network" icon="radio">
            <View style={styles.signalContainer}>
              <View style={styles.signalBars}>
                {getSignalBars(systemStatus.loraSignal)}
              </View>
              <Text style={styles.signalText}>{systemStatus.networkLatency}ms</Text>
            </View>
          </StatusCard>

          <StatusCard title="Connected" icon="people">
            <Text style={styles.statusValue}>{systemStatus.connectedDevices}</Text>
            <Text style={styles.statusSubtext}>devices</Text>
          </StatusCard>
        </View>

        {/* Real-time Sensor Data */}
        <View style={styles.sensorCard}>
          <View style={styles.cardHeader}>
            <Ionicons name="pulse" size={16} color={colors.foreground} />
            <Text style={styles.cardTitle}>Sensor Readings (MPU6050)</Text>
          </View>
          <View style={styles.sensorContent}>
            <View style={styles.sensorGrid}>
              <View style={styles.sensorColumn}>
                <Text style={styles.sensorLabel}>Accelerometer (m/s²)</Text>
                <View style={styles.sensorValues}>
                  <Text style={styles.sensorValue}>X: {sensorData.accelerometer.x.toFixed(2)}</Text>
                  <Text style={styles.sensorValue}>Y: {sensorData.accelerometer.y.toFixed(2)}</Text>
                  <Text style={styles.sensorValue}>Z: {sensorData.accelerometer.z.toFixed(2)}</Text>
                </View>
              </View>
              <View style={styles.sensorColumn}>
                <Text style={styles.sensorLabel}>Gyroscope (rad/s)</Text>
                <View style={styles.sensorValues}>
                  <Text style={styles.sensorValue}>X: {sensorData.gyroscope.x.toFixed(3)}</Text>
                  <Text style={styles.sensorValue}>Y: {sensorData.gyroscope.y.toFixed(3)}</Text>
                  <Text style={styles.sensorValue}>Z: {sensorData.gyroscope.z.toFixed(3)}</Text>
                </View>
              </View>
            </View>
            <View style={styles.sensorFooter}>
              <View style={styles.impactIndicator}>
                <View style={[
                  styles.impactDot,
                  { backgroundColor: sensorData.impact ? colors.emergency : colors.success }
                ]} />
                <Text style={styles.impactText}>Impact Sensor</Text>
              </View>
              <Text style={styles.temperatureText}>
                Temp: {sensorData.temperature.toFixed(1)}°C
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={[commonStyles.secondaryButton, styles.actionButton]}>
            <Ionicons name="location" size={16} color={colors.foreground} />
            <Text style={[commonStyles.secondaryButtonText, { marginLeft: 8 }]}>
              Share Location
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[commonStyles.secondaryButton, styles.actionButton]}>
            <Ionicons name="call" size={16} color={colors.foreground} />
            <Text style={[commonStyles.secondaryButtonText, { marginLeft: 8 }]}>
              Contact Team
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
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emergencyCard: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    shadowColor: colors.emergency,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  emergencyContent: {
    alignItems: 'center',
  },
  sosButtonContent: {
    alignItems: 'center',
  },
  sosButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  sosButtonSubtext: {
    fontSize: 14,
    marginTop: 4,
  },
  sosActiveContainer: {
    alignItems: 'center',
  },
  sosActiveButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.emergency,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  sosActiveContent: {
    alignItems: 'center',
  },
  countdownText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  countdownLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
    marginBottom: 24,
  },
  statusCard: {
    width: (width - 48) / 2,
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.foreground,
    marginLeft: 8,
  },
  cardContent: {
    // Content styles handled by children
  },
  statusValue: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 8,
  },
  statusSubtext: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  signalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signalBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: 8,
  },
  signalBar: {
    width: 4,
    backgroundColor: colors.network,
    marginRight: 2,
  },
  signalText: {
    fontSize: 14,
    color: colors.foreground,
  },
  progressContainer: {
    height: 8,
    backgroundColor: colors.muted,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  sensorCard: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sensorContent: {
    marginTop: 16,
  },
  sensorGrid: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  sensorColumn: {
    flex: 1,
  },
  sensorLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginBottom: 8,
  },
  sensorValues: {
    // Values container
  },
  sensorValue: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: colors.foreground,
    marginBottom: 4,
  },
  sensorFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  impactIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  impactDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  impactText: {
    fontSize: 12,
    color: colors.foreground,
  },
  temperatureText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: colors.foreground,
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

export default HomeScreen;