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

const DeviceStatusScreen = () => {
  const [devices, setDevices] = useState([
    {
      id: 'PRIMARY',
      name: 'Primary Device',
      type: 'Main Controller',
      status: 'online',
      battery: 87,
      temperature: 24.5,
      signal: -45,
      uptime: '2d 14h 32m',
      lastUpdate: '2 min ago'
    },
    {
      id: 'BACKUP',
      name: 'Backup Device',
      type: 'Secondary',
      status: 'standby',
      battery: 73,
      temperature: 23.8,
      signal: -67,
      uptime: '1d 8h 15m',
      lastUpdate: '5 min ago'
    },
    {
      id: 'SENSOR_01',
      name: 'Environmental Sensor',
      type: 'IoT Sensor',
      status: 'online',
      battery: 92,
      temperature: 25.1,
      signal: -89,
      uptime: '3d 2h 45m',
      lastUpdate: '1 min ago'
    },
    {
      id: 'GPS_01',
      name: 'GPS Module',
      type: 'Navigation',
      status: 'online',
      battery: 95,
      temperature: 22.3,
      signal: -52,
      uptime: '4d 1h 20m',
      lastUpdate: '30 sec ago'
    }
  ]);

  const [systemHealth] = useState({
    overall: 94,
    network: 88,
    sensors: 96,
    power: 82
  });

  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setDevices(prev => prev.map(device => ({
        ...device,
        temperature: device.temperature + (Math.random() - 0.5) * 0.5,
        signal: device.signal + (Math.random() - 0.5) * 2,
        lastUpdate: 'Just now'
      })));
    }, 5000);

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => {
      clearInterval(interval);
      pulseAnimation.stop();
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return colors.success;
      case 'standby': return colors.warning;
      case 'offline': return colors.mutedForeground;
      case 'error': return colors.emergency;
      default: return colors.mutedForeground;
    }
  };

  const getBatteryColor = (battery: number) => {
    if (battery > 50) return colors.success;
    if (battery > 20) return colors.warning;
    return colors.emergency;
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

  const DeviceCard = ({ device }: { device: any }) => (
    <Animated.View style={[
      styles.deviceCard,
      { transform: [{ scale: device.status === 'online' ? pulseAnim : 1 }] }
    ]}>
      <View style={styles.deviceHeader}>
        <View style={styles.deviceInfo}>
          <Text style={styles.deviceName}>{device.name}</Text>
          <Text style={styles.deviceType}>{device.type}</Text>
        </View>
        <View style={[
          styles.statusIndicator,
          { backgroundColor: getStatusColor(device.status) }
        ]}>
          <Text style={[
            styles.statusText,
            { color: device.status === 'online' ? colors.successForeground :
                      device.status === 'standby' ? colors.warningForeground :
                      colors.foreground }
          ]}>
            {device.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.deviceStats}>
        <View style={styles.statItem}>
          <Ionicons name="battery-half" size={16} color={getBatteryColor(device.battery)} />
          <Text style={[styles.statValue, { color: getBatteryColor(device.battery) }]}>
            {device.battery}%
          </Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="thermometer" size={16} color={colors.foreground} />
          <Text style={styles.statValue}>{device.temperature.toFixed(1)}°C</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="radio" size={16} color={colors.network} />
          <Text style={styles.statValue}>{device.signal} dBm</Text>
        </View>
      </View>

      <View style={styles.deviceFooter}>
        <View style={styles.deviceId}>
          <Text style={styles.deviceIdText}>ID: {device.id}</Text>
          <Text style={styles.uptimeText}>Uptime: {device.uptime}</Text>
        </View>
        <Text style={styles.lastUpdateText}>{device.lastUpdate}</Text>
      </View>
    </Animated.View>
  );

  const HealthCard = ({ label, value, color = colors.primary }: { 
    label: string; 
    value: number; 
    color?: string;
  }) => (
    <View style={styles.healthCard}>
      <Text style={styles.healthLabel}>{label}</Text>
      <View style={styles.healthProgress}>
        <View style={[styles.healthBar, { width: `${value}%`, backgroundColor: color }]} />
      </View>
      <Text style={[styles.healthValue, { color }]}>{value}%</Text>
    </View>
  );

  return (
    <SafeAreaView style={commonStyles.screenContainer}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Device Status</Text>
            <Text style={styles.headerSubtitle}>System Health & Device Monitoring</Text>
          </View>
          <View style={[styles.healthBadge, { backgroundColor: colors.technical }]}>
            <Text style={[styles.healthBadgeText, { color: colors.technicalForeground }]}>
              All Systems
            </Text>
          </View>
        </View>

        {/* System Health Overview */}
        <Card title="System Health" icon="pulse">
          <View style={styles.healthGrid}>
            <HealthCard label="Overall" value={systemHealth.overall} color={colors.success} />
            <HealthCard label="Network" value={systemHealth.network} color={colors.network} />
            <HealthCard label="Sensors" value={systemHealth.sensors} color={colors.technical} />
            <HealthCard label="Power" value={systemHealth.power} color={colors.warning} />
          </View>
        </Card>

        {/* Device List */}
        <Card title="Connected Devices" icon="phone-portrait">
          <View style={styles.devicesSection}>
            {devices.map((device) => (
              <DeviceCard key={device.id} device={device} />
            ))}
          </View>
        </Card>

        {/* System Information */}
        <Card title="System Information" icon="information-circle">
          <View style={styles.systemInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Firmware Version</Text>
              <Text style={styles.infoValue}>v2.1.0</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Hardware Model</Text>
              <Text style={styles.infoValue}>Lifeline IoT Pro</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Serial Number</Text>
              <Text style={styles.infoValue}>LL-2024-001</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Last Calibration</Text>
              <Text style={styles.infoValue}>2024-01-15</Text>
            </View>
          </View>
        </Card>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={[commonStyles.secondaryButton, styles.actionButton]}>
            <Ionicons name="refresh" size={16} color={colors.foreground} />
            <Text style={[commonStyles.secondaryButtonText, { marginLeft: 8 }]}>
              Refresh Status
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[commonStyles.primaryButton, styles.actionButton]}>
            <Ionicons name="settings" size={16} color={colors.primaryForeground} />
            <Text style={[commonStyles.primaryButtonText, { marginLeft: 8 }]}>
              Device Settings
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
  healthBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  healthBadgeText: {
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
  healthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  healthCard: {
    width: '48%',
    marginBottom: 16,
  },
  healthLabel: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginBottom: 8,
  },
  healthProgress: {
    height: 8,
    backgroundColor: colors.muted,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  healthBar: {
    height: '100%',
    borderRadius: 4,
  },
  healthValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  devicesSection: {
    // Devices container
  },
  deviceCard: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  deviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
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
  deviceType: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  deviceStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 14,
    marginLeft: 8,
    fontFamily: 'monospace',
  },
  deviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  deviceId: {
    flex: 1,
  },
  deviceIdText: {
    fontSize: 12,
    color: colors.mutedForeground,
    fontFamily: 'monospace',
    marginBottom: 2,
  },
  uptimeText: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  lastUpdateText: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  systemInfo: {
    // System info container
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  infoValue: {
    fontSize: 14,
    color: colors.foreground,
    fontFamily: 'monospace',
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

export default DeviceStatusScreen;