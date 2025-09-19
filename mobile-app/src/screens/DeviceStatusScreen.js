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
import { colors, getStatusColor } from '../styles/colors';
import { commonStyles } from '../styles/commonStyles';

const DeviceStatusScreen = () => {
  const [deviceHealth, setDeviceHealth] = useState({
    cpu: 23.5,
    memory: 67.8,
    storage: 45.2,
    temperature: 42.3,
    battery: 87,
    powerConsumption: 2.4
  });

  const [sensorStatus] = useState({
    mpu6050: { 
      status: 'active', 
      lastReading: new Date(), 
      x: 0.12, 
      y: 0.03, 
      z: 9.81 
    },
    piezoelectric: { 
      status: 'active', 
      threshold: 5.0, 
      lastTrigger: null 
    },
    gps: { 
      status: 'active', 
      satellites: 8, 
      accuracy: 3.2, 
      hdop: 1.2 
    },
    lora: { 
      status: 'active', 
      frequency: 915, 
      power: 14, 
      rssi: -52 
    }
  });

  const [systemLogs] = useState([
    { time: '14:23:45', level: 'error', message: 'Emergency alert triggered by user Emma Wilson' },
    { time: '14:20:12', level: 'warning', message: 'Low battery warning for device ID: DEV003' },
    { time: '14:18:33', level: 'info', message: 'GPS lock acquired - 8 satellites' },
    { time: '14:15:07', level: 'info', message: 'LoRa mesh network sync completed' },
    { time: '14:12:44', level: 'warning', message: 'High temperature detected: 45.2°C' }
  ]);

  const [firmwareInfo] = useState({
    version: 'v2.1.0-stable',
    buildDate: '2024-01-15',
    updateAvailable: true,
    components: {
      bootloader: 'v1.3.2',
      application: 'v2.1.0',
      radio: 'v1.8.4',
      gps: 'v3.2.1'
    }
  });

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setDeviceHealth(prev => ({
        ...prev,
        cpu: Math.max(0, Math.min(100, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(0, Math.min(100, prev.memory + (Math.random() - 0.5) * 5)),
        temperature: Math.max(20, Math.min(60, prev.temperature + (Math.random() - 0.5) * 2)),
        powerConsumption: Math.max(0.5, Math.min(5, prev.powerConsumption + (Math.random() - 0.5) * 0.5))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getHealthStatus = (value, type) => {
    switch (type) {
      case 'cpu':
      case 'memory':
        if (value > 80) return 'error';
        if (value > 60) return 'warning';
        return 'active';
      case 'temperature':
        if (value > 50) return 'error';
        if (value > 45) return 'warning';
        return 'active';
      case 'battery':
        if (value < 20) return 'error';
        if (value < 50) return 'warning';
        return 'active';
      default:
        return 'active';
    }
  };

  const getLogLevelColor = (level) => {
    switch (level) {
      case 'error': return colors.emergency;
      case 'warning': return colors.warning;
      case 'info': return colors.primary;
      default: return colors.mutedForeground;
    }
  };

  const handleCalibrateSensors = () => {
    console.log('Calibrate sensors pressed');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Sensor Calibration', 'Starting sensor calibration process...');
  };

  const handleRunDiagnostics = () => {
    console.log('Run diagnostics pressed');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('System Diagnostics', 'Running comprehensive system diagnostics...');
  };

  const handleInstallUpdate = () => {
    console.log('Install update pressed');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert('Firmware Update', 'Starting firmware update process...');
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <ScrollView contentContainerStyle={commonStyles.scrollContainer}>
        {/* Header */}
        <View style={commonStyles.spaceBetween}>
          <View>
            <Text style={commonStyles.title}>Device Diagnostics</Text>
            <Text style={commonStyles.subtitle}>System Health & IoT Monitoring</Text>
          </View>
          <View style={[commonStyles.statusIndicator, { backgroundColor: colors.success + '33', borderColor: colors.success }]}>
            <Text style={[commonStyles.statusText, { color: colors.success }]}>All Systems Operational</Text>
          </View>
        </View>

        {/* System Performance */}
        <View style={commonStyles.card}>
          <View style={commonStyles.cardHeader}>
            <Ionicons name="speedometer" size={20} color={colors.foreground} />
            <Text style={commonStyles.cardTitle}>System Performance</Text>
          </View>

          <View style={styles.metricsGrid}>
            <View style={styles.metricsColumn}>
              <PerformanceMetric
                icon="hardware-chip"
                title="CPU Usage"
                value={`${deviceHealth.cpu.toFixed(1)}%`}
                progress={deviceHealth.cpu / 100}
                status={getHealthStatus(deviceHealth.cpu, 'cpu')}
              />
              <PerformanceMetric
                icon="server"
                title="Memory"
                value={`${deviceHealth.memory.toFixed(1)}%`}
                progress={deviceHealth.memory / 100}
                status={getHealthStatus(deviceHealth.memory, 'memory')}
              />
              <PerformanceMetric
                icon="save"
                title="Storage"
                value={`${deviceHealth.storage.toFixed(1)}%`}
                progress={deviceHealth.storage / 100}
                status="active"
              />
            </View>

            <View style={styles.metricsColumn}>
              <PerformanceMetric
                icon="battery-half"
                title="Battery"
                value={`${deviceHealth.battery}%`}
                progress={deviceHealth.battery / 100}
                status={getHealthStatus(deviceHealth.battery, 'battery')}
              />
              <PerformanceMetric
                icon="thermometer"
                title="Temperature"
                value={`${deviceHealth.temperature.toFixed(1)}°C`}
                progress={deviceHealth.temperature / 60}
                status={getHealthStatus(deviceHealth.temperature, 'temperature')}
              />
              <PerformanceMetric
                icon="flash"
                title="Power Draw"
                value={`${deviceHealth.powerConsumption.toFixed(1)}W`}
                progress={deviceHealth.powerConsumption / 5}
                status="active"
              />
            </View>
          </View>
        </View>

        {/* Sensor Modules */}
        <View style={commonStyles.card}>
          <View style={commonStyles.cardHeader}>
            <Ionicons name="analytics" size={20} color={colors.foreground} />
            <Text style={commonStyles.cardTitle}>Sensor Modules</Text>
          </View>

          <SensorModule
            icon="analytics"
            iconColor={colors.success}
            title="MPU6050 (Accelerometer/Gyroscope)"
            subtitle={`X: ${sensorStatus.mpu6050.x.toFixed(2)} Y: ${sensorStatus.mpu6050.y.toFixed(2)} Z: ${sensorStatus.mpu6050.z.toFixed(2)}`}
            status="Active"
            statusColor={colors.success}
          />

          <SensorModule
            icon="satellite"
            iconColor={colors.success}
            title="GPS Module"
            subtitle={`${sensorStatus.gps.satellites} satellites • ${sensorStatus.gps.accuracy}m accuracy`}
            status="Fixed"
            statusColor={colors.success}
          />

          <SensorModule
            icon="radio"
            iconColor={colors.success}
            title="LoRa Radio Module"
            subtitle={`${sensorStatus.lora.frequency}MHz • ${sensorStatus.lora.power}dBm • RSSI: ${sensorStatus.lora.rssi}dBm`}
            status="Connected"
            statusColor={colors.success}
          />

          <SensorModule
            icon="warning"
            iconColor={colors.success}
            title="Impact Sensor (Piezoelectric)"
            subtitle={`Threshold: ${sensorStatus.piezoelectric.threshold}G • No recent triggers`}
            status="Monitoring"
            statusColor={colors.success}
          />
        </View>

        {/* Firmware Information */}
        <View style={commonStyles.card}>
          <View style={styles.firmwareHeader}>
            <View style={commonStyles.cardHeader}>
              <Ionicons name="settings" size={20} color={colors.foreground} />
              <Text style={commonStyles.cardTitle}>Firmware & Updates</Text>
            </View>
            {firmwareInfo.updateAvailable && (
              <View style={[commonStyles.statusIndicator, { backgroundColor: colors.warning + '33', borderColor: colors.warning }]}>
                <Text style={[commonStyles.statusText, { color: colors.warning }]}>Update Available</Text>
              </View>
            )}
          </View>

          <View style={styles.firmwareInfo}>
            <View style={styles.firmwareItem}>
              <Text style={commonStyles.smallText}>Current Version</Text>
              <Text style={commonStyles.technicalText}>{firmwareInfo.version}</Text>
            </View>
            <View style={styles.firmwareItem}>
              <Text style={commonStyles.smallText}>Build Date</Text>
              <Text style={commonStyles.technicalText}>{firmwareInfo.buildDate}</Text>
            </View>
          </View>

          <Text style={[commonStyles.smallText, { marginBottom: 8 }]}>Component Versions</Text>
          {Object.entries(firmwareInfo.components).map(([component, version]) => (
            <View key={component} style={styles.componentRow}>
              <Text style={commonStyles.smallText}>{component.charAt(0).toUpperCase() + component.slice(1)}</Text>
              <Text style={commonStyles.technicalText}>{version}</Text>
            </View>
          ))}

          {firmwareInfo.updateAvailable && (
            <TouchableOpacity style={[commonStyles.secondaryButton, { marginTop: 16 }]} onPress={handleInstallUpdate}>
              <View style={[commonStyles.row, { justifyContent: 'center' }]}>
                <Ionicons name="refresh" size={16} color={colors.foreground} style={{ marginRight: 8 }} />
                <Text style={commonStyles.secondaryButtonText}>Install Update</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* System Logs */}
        <View style={commonStyles.card}>
          <View style={commonStyles.cardHeader}>
            <Ionicons name="list" size={20} color={colors.foreground} />
            <Text style={commonStyles.cardTitle}>System Logs</Text>
          </View>

          {systemLogs.map((log, index) => (
            <View key={index} style={styles.logEntry}>
              <Text style={styles.logTime}>{log.time}</Text>
              <Text style={[styles.logLevel, { color: getLogLevelColor(log.level) }]}>
                {log.level.toUpperCase()}
              </Text>
              <Text style={styles.logMessage} numberOfLines={2}>
                {log.message}
              </Text>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[commonStyles.secondaryButton, { flex: 1, marginRight: 8 }]}
            onPress={handleCalibrateSensors}
          >
            <View style={[commonStyles.row, { justifyContent: 'center' }]}>
              <Ionicons name="settings" size={16} color={colors.foreground} style={{ marginRight: 8 }} />
              <Text style={commonStyles.secondaryButtonText}>Calibrate Sensors</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[commonStyles.primaryButton, { flex: 1, marginLeft: 8 }]}
            onPress={handleRunDiagnostics}
          >
            <View style={[commonStyles.row, { justifyContent: 'center' }]}>
              <Ionicons name="checkmark-circle" size={16} color={colors.primaryForeground} style={{ marginRight: 8 }} />
              <Text style={commonStyles.primaryButtonText}>Run Diagnostics</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Performance Metric Component
const PerformanceMetric = ({ icon, title, value, progress, status }) => {
  const statusColor = getStatusColor(status);
  
  return (
    <View style={styles.metricItem}>
      <View style={styles.metricHeader}>
        <Ionicons name={icon} size={16} color={colors.foreground} />
        <Text style={styles.metricTitle}>{title}</Text>
        <Text style={[styles.metricValue, { color: statusColor }]}>{value}</Text>
      </View>
      <View style={commonStyles.progressContainer}>
        <View style={[commonStyles.progressFill, { 
          width: `${progress * 100}%`, 
          backgroundColor: statusColor 
        }]} />
      </View>
    </View>
  );
};

// Sensor Module Component
const SensorModule = ({ icon, iconColor, title, subtitle, status, statusColor }) => (
  <View style={styles.sensorModule}>
    <View style={[styles.sensorIcon, { backgroundColor: iconColor + '33' }]}>
      <Ionicons name={icon} size={16} color={iconColor} />
    </View>
    <View style={styles.sensorInfo}>
      <Text style={styles.sensorTitle}>{title}</Text>
      <Text style={styles.sensorSubtitle} numberOfLines={1}>{subtitle}</Text>
    </View>
    <View style={[commonStyles.statusIndicator, { backgroundColor: statusColor + '33', borderColor: statusColor }]}>
      <Text style={[commonStyles.statusText, { color: statusColor }]}>{status}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  metricsGrid: {
    flexDirection: 'row',
    marginHorizontal: -12,
  },
  metricsColumn: {
    flex: 1,
    marginHorizontal: 12,
  },
  metricItem: {
    marginBottom: 16,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricTitle: {
    fontSize: 14,
    color: colors.foreground,
    marginLeft: 8,
    flex: 1,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  sensorModule: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginBottom: 12,
  },
  sensorIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sensorInfo: {
    flex: 1,
  },
  sensorTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.foreground,
    marginBottom: 4,
  },
  sensorSubtitle: {
    fontSize: 12,
    color: colors.mutedForeground,
    fontFamily: 'monospace',
  },
  firmwareHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  firmwareInfo: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  firmwareItem: {
    flex: 1,
  },
  componentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  logEntry: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  logTime: {
    fontSize: 12,
    color: colors.mutedForeground,
    fontFamily: 'monospace',
    width: 60,
    marginRight: 12,
  },
  logLevel: {
    fontSize: 12,
    fontFamily: 'monospace',
    width: 60,
    marginRight: 12,
    fontWeight: '500',
  },
  logMessage: {
    fontSize: 12,
    color: colors.foreground,
    fontFamily: 'monospace',
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
});

export default DeviceStatusScreen;