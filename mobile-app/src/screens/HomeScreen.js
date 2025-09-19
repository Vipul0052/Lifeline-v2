import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { colors, getStatusColor } from '../styles/colors';
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

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const sosScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Real-time sensor data simulation
    const sensorInterval = setInterval(() => {
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

    return () => clearInterval(sensorInterval);
  }, []);

  useEffect(() => {
    if (sosActive) {
      // Start pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Countdown timer
      const timer = setTimeout(() => {
        if (countdown > 0) {
          setCountdown(countdown - 1);
        } else {
          activateEmergency();
        }
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  }, [sosActive, countdown]);

  const handleSOSPress = () => {
    console.log('SOS button pressed');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    // Scale animation
    Animated.sequence([
      Animated.timing(sosScaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(sosScaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setSosActive(true);
    setCountdown(30);
  };

  const handleSOSCancel = () => {
    console.log('SOS cancelled');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSosActive(false);
    setCountdown(30);
  };

  const activateEmergency = () => {
    console.log('Emergency activated!');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    setSosActive(false);
    
    Alert.alert(
      'Emergency Activated',
      'Emergency SOS has been activated. Response teams have been notified.',
      [{ text: 'Acknowledge', onPress: () => console.log('Emergency acknowledged') }]
    );
  };

  const getSignalBars = (strength) => {
    return Array.from({ length: 5 }, (_, i) => (
      <View
        key={i}
        style={[
          styles.signalBar,
          {
            height: (i + 1) * 3 + 5,
            backgroundColor: i < strength ? colors.network : colors.network + '33'
          }
        ]}
      />
    ));
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <ScrollView contentContainerStyle={commonStyles.scrollContainer}>
        {/* Header */}
        <View style={commonStyles.spaceBetween}>
          <View>
            <Text style={commonStyles.title}>Emergency Command</Text>
            <Text style={commonStyles.subtitle}>Real-time System Monitoring</Text>
          </View>
          <View style={[commonStyles.statusIndicator, { backgroundColor: colors.technical + '33', borderColor: colors.technical }]}>
            <Text style={[commonStyles.statusText, { color: colors.technical }]}>System Active</Text>
          </View>
        </View>

        {/* Emergency SOS Section */}
        <View style={styles.emergencyCard}>
          {!sosActive ? (
            <Animated.View style={[styles.sosContainer, { transform: [{ scale: sosScaleAnim }] }]}>
              <TouchableOpacity
                style={commonStyles.emergencyButton}
                onPress={handleSOSPress}
                activeOpacity={0.8}
              >
                <Ionicons name="shield" size={32} color={colors.emergencyForeground} />
                <Text style={styles.emergencyButtonText}>EMERGENCY</Text>
                <Text style={styles.emergencyButtonSubtext}>SOS</Text>
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <View style={styles.sosContainer}>
              <Animated.View style={[commonStyles.emergencyButton, { transform: [{ scale: pulseAnim }] }]}>
                <Ionicons name="time" size={32} color={colors.emergencyForeground} />
                <Text style={styles.countdownText}>{countdown}</Text>
                <Text style={styles.emergencyButtonSubtext}>seconds</Text>
              </Animated.View>
              
              <TouchableOpacity style={styles.cancelButton} onPress={handleSOSCancel}>
                <Text style={styles.cancelButtonText}>Cancel Emergency</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* System Status Grid */}
        <View style={styles.statusGrid}>
          {/* Battery Card */}
          <View style={styles.statusCard}>
            <View style={commonStyles.cardHeader}>
              <Ionicons name="battery-half" size={16} color={colors.foreground} />
              <Text style={styles.statusTitle}>Battery</Text>
            </View>
            <Text style={[styles.statusValue, { color: systemStatus.battery > 20 ? colors.success : colors.warning }]}>
              {systemStatus.battery}%
            </Text>
            <View style={commonStyles.progressContainer}>
              <View style={[commonStyles.progressFill, { 
                width: `${systemStatus.battery}%`, 
                backgroundColor: systemStatus.battery > 20 ? colors.success : colors.warning 
              }]} />
            </View>
          </View>

          {/* GPS Card */}
          <View style={styles.statusCard}>
            <View style={commonStyles.cardHeader}>
              <Ionicons name="satellite" size={16} color={colors.foreground} />
              <Text style={styles.statusTitle}>GPS</Text>
            </View>
            <Text style={[styles.statusValue, { color: colors.success }]}>
              {systemStatus.gpsAccuracy}
            </Text>
            <Text style={commonStyles.smallText}>8 satellites</Text>
          </View>

          {/* LoRa Network Card */}
          <View style={styles.statusCard}>
            <View style={commonStyles.cardHeader}>
              <Ionicons name="radio" size={16} color={colors.foreground} />
              <Text style={styles.statusTitle}>LoRa Network</Text>
            </View>
            <View style={styles.signalContainer}>
              <View style={styles.signalBars}>
                {getSignalBars(systemStatus.loraSignal)}
              </View>
              <Text style={commonStyles.smallText}>{systemStatus.networkLatency}ms</Text>
            </View>
          </View>

          {/* Connected Devices Card */}
          <View style={styles.statusCard}>
            <View style={commonStyles.cardHeader}>
              <Ionicons name="people" size={16} color={colors.foreground} />
              <Text style={styles.statusTitle}>Connected</Text>
            </View>
            <Text style={[styles.statusValue, { color: colors.primary }]}>
              {systemStatus.connectedDevices}
            </Text>
            <Text style={commonStyles.smallText}>devices</Text>
          </View>
        </View>

        {/* Sensor Data Card */}
        <View style={commonStyles.card}>
          <View style={commonStyles.cardHeader}>
            <Ionicons name="analytics" size={20} color={colors.foreground} />
            <Text style={commonStyles.cardTitle}>Sensor Readings (MPU6050)</Text>
          </View>
          
          <View style={styles.sensorGrid}>
            <View style={styles.sensorColumn}>
              <Text style={styles.sensorLabel}>Accelerometer (m/s²)</Text>
              <Text style={commonStyles.technicalText}>X: {sensorData.accelerometer.x.toFixed(2)}</Text>
              <Text style={commonStyles.technicalText}>Y: {sensorData.accelerometer.y.toFixed(2)}</Text>
              <Text style={commonStyles.technicalText}>Z: {sensorData.accelerometer.z.toFixed(2)}</Text>
            </View>
            
            <View style={styles.sensorColumn}>
              <Text style={styles.sensorLabel}>Gyroscope (rad/s)</Text>
              <Text style={commonStyles.technicalText}>X: {sensorData.gyroscope.x.toFixed(3)}</Text>
              <Text style={commonStyles.technicalText}>Y: {sensorData.gyroscope.y.toFixed(3)}</Text>
              <Text style={commonStyles.technicalText}>Z: {sensorData.gyroscope.z.toFixed(3)}</Text>
            </View>
          </View>
          
          <View style={styles.sensorFooter}>
            <View style={commonStyles.row}>
              <View style={[styles.impactIndicator, { 
                backgroundColor: sensorData.impact ? colors.emergency : colors.success 
              }]} />
              <Text style={commonStyles.smallText}>Impact Sensor</Text>
            </View>
            <Text style={commonStyles.technicalText}>
              Temp: {sensorData.temperature.toFixed(1)}°C
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={commonStyles.secondaryButton}
            onPress={() => {
              console.log('Share location pressed');
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <View style={[commonStyles.row, { justifyContent: 'center' }]}>
              <Ionicons name="location" size={16} color={colors.foreground} style={{ marginRight: 8 }} />
              <Text style={commonStyles.secondaryButtonText}>Share Location</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={commonStyles.secondaryButton}
            onPress={() => {
              console.log('Contact team pressed');
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <View style={[commonStyles.row, { justifyContent: 'center' }]}>
              <Ionicons name="call" size={16} color={colors.foreground} style={{ marginRight: 8 }} />
              <Text style={commonStyles.secondaryButtonText}>Contact Team</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  emergencyCard: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 24,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.emergency + '80',
    alignItems: 'center',
  },
  sosContainer: {
    alignItems: 'center',
  },
  emergencyButtonText: {
    color: colors.emergencyForeground,
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
  emergencyButtonSubtext: {
    color: colors.emergencyForeground,
    fontSize: 12,
    marginTop: 2,
  },
  countdownText: {
    color: colors.emergencyForeground,
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 8,
  },
  cancelButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.emergency,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: colors.emergency,
    fontSize: 14,
    fontWeight: '500',
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
    marginVertical: 8,
  },
  statusCard: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 14,
    color: colors.foreground,
    marginLeft: 8,
    flex: 1,
  },
  statusValue: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
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
    width: 3,
    marginRight: 2,
    borderRadius: 1,
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
  sensorFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  impactIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
});

export default HomeScreen;