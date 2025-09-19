import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/colors';
import { commonStyles } from '../styles/commonStyles';

const TrekCodeScreen = () => {
  const [trekCode, setTrekCode] = useState('LIFELINE-2024');
  const [networkSettings, setNetworkSettings] = useState({
    frequency: 915,
    bandwidth: 125,
    spreadingFactor: 7,
    codingRate: 5,
    txPower: 14,
  });

  const [connectedDevices] = useState([
    { id: 'DEV001', name: 'Primary Device', signal: -45, status: 'connected' },
    { id: 'DEV002', name: 'Backup Device', signal: -67, status: 'connected' },
    { id: 'DEV003', name: 'Team Member 1', signal: -89, status: 'weak' },
    { id: 'DEV004', name: 'Team Member 2', signal: -120, status: 'disconnected' },
  ]);

  const [networkStats] = useState({
    packetsSent: 1247,
    packetsReceived: 1189,
    successRate: 95.3,
    avgLatency: 45,
  });

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
    <View style={[
      styles.deviceCard,
      { borderColor: device.status === 'connected' ? colors.success :
                    device.status === 'weak' ? colors.warning :
                    colors.mutedForeground }
    ]}>
      <View style={styles.deviceInfo}>
        <View style={styles.deviceHeader}>
          <Text style={styles.deviceName}>{device.name}</Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: device.status === 'connected' ? colors.success :
                              device.status === 'weak' ? colors.warning :
                              colors.mutedForeground }
          ]}>
            <Text style={[
              styles.statusBadgeText,
              { color: device.status === 'connected' ? colors.successForeground :
                      device.status === 'weak' ? colors.warningForeground :
                      colors.foreground }
            ]}>
              {device.status.toUpperCase()}
            </Text>
          </View>
        </View>
        <View style={styles.deviceDetails}>
          <Text style={styles.deviceId}>ID: {device.id}</Text>
          <Text style={styles.signalStrength}>Signal: {device.signal} dBm</Text>
        </View>
      </View>
      <View style={styles.signalBars}>
        {Array.from({ length: 5 }, (_, i) => (
          <View
            key={i}
            style={[
              styles.signalBar,
              {
                height: (i + 1) * 4 + 4,
                opacity: device.signal > -60 + (i * 15) ? 1 : 0.2,
                backgroundColor: device.status === 'connected' ? colors.success :
                                device.status === 'weak' ? colors.warning :
                                colors.mutedForeground
              }
            ]}
          />
        ))}
      </View>
    </View>
  );

  const StatCard = ({ label, value, unit, color = colors.foreground }: { 
    label: string; 
    value: string | number; 
    unit?: string;
    color?: string;
  }) => (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, { color }]}>
        {value}{unit && <Text style={styles.statUnit}>{unit}</Text>}
      </Text>
    </View>
  );

  const handleShareCode = () => {
    Alert.alert(
      'Share Trek Code',
      `Share this code with your team: ${trekCode}`,
      [
        { text: 'Copy', onPress: () => console.log('Copied to clipboard') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleGenerateCode = () => {
    const newCode = `LIFELINE-${Math.floor(Math.random() * 9000) + 1000}`;
    setTrekCode(newCode);
  };

  return (
    <SafeAreaView style={commonStyles.screenContainer}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Network Configuration</Text>
            <Text style={styles.headerSubtitle}>LoRa Mesh Network & Trek Codes</Text>
          </View>
          <View style={[styles.networkBadge, { backgroundColor: colors.network }]}>
            <Text style={[styles.networkBadgeText, { color: colors.networkForeground }]}>
              LoRa Active
            </Text>
          </View>
        </View>

        {/* Trek Code */}
        <Card title="Trek Code" icon="qr-code">
          <View style={styles.codeSection}>
            <View style={styles.codeDisplay}>
              <Text style={styles.codeLabel}>Current Trek Code</Text>
              <Text style={styles.codeValue}>{trekCode}</Text>
            </View>
            <View style={styles.codeActions}>
              <TouchableOpacity
                style={[commonStyles.secondaryButton, styles.codeButton]}
                onPress={handleGenerateCode}
              >
                <Ionicons name="refresh" size={16} color={colors.foreground} />
                <Text style={[commonStyles.secondaryButtonText, { marginLeft: 8 }]}>
                  Generate New
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[commonStyles.primaryButton, styles.codeButton]}
                onPress={handleShareCode}
              >
                <Ionicons name="share" size={16} color={colors.primaryForeground} />
                <Text style={[commonStyles.primaryButtonText, { marginLeft: 8 }]}>
                  Share Code
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card>

        {/* Network Settings */}
        <Card title="LoRa Settings" icon="radio">
          <View style={styles.settingsGrid}>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Frequency (MHz)</Text>
              <TextInput
                style={styles.settingInput}
                value={networkSettings.frequency.toString()}
                onChangeText={(text) => setNetworkSettings({
                  ...networkSettings,
                  frequency: parseInt(text) || 915
                })}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Bandwidth (kHz)</Text>
              <TextInput
                style={styles.settingInput}
                value={networkSettings.bandwidth.toString()}
                onChangeText={(text) => setNetworkSettings({
                  ...networkSettings,
                  bandwidth: parseInt(text) || 125
                })}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Spreading Factor</Text>
              <TextInput
                style={styles.settingInput}
                value={networkSettings.spreadingFactor.toString()}
                onChangeText={(text) => setNetworkSettings({
                  ...networkSettings,
                  spreadingFactor: parseInt(text) || 7
                })}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Coding Rate</Text>
              <TextInput
                style={styles.settingInput}
                value={networkSettings.codingRate.toString()}
                onChangeText={(text) => setNetworkSettings({
                  ...networkSettings,
                  codingRate: parseInt(text) || 5
                })}
                keyboardType="numeric"
              />
            </View>
          </View>
        </Card>

        {/* Network Statistics */}
        <Card title="Network Statistics" icon="bar-chart">
          <View style={styles.statsGrid}>
            <StatCard label="Packets Sent" value={networkStats.packetsSent} />
            <StatCard label="Packets Received" value={networkStats.packetsReceived} />
            <StatCard label="Success Rate" value={networkStats.successRate} unit="%" color={colors.success} />
            <StatCard label="Avg Latency" value={networkStats.avgLatency} unit="ms" color={colors.technical} />
          </View>
        </Card>

        {/* Connected Devices */}
        <Card title="Connected Devices" icon="phone-portrait">
          <View style={styles.devicesSection}>
            {connectedDevices.map((device) => (
              <DeviceCard key={device.id} device={device} />
            ))}
          </View>
        </Card>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={[commonStyles.secondaryButton, styles.actionButton]}>
            <Ionicons name="settings" size={16} color={colors.foreground} />
            <Text style={[commonStyles.secondaryButtonText, { marginLeft: 8 }]}>
              Advanced
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[commonStyles.primaryButton, styles.actionButton]}>
            <Ionicons name="refresh" size={16} color={colors.primaryForeground} />
            <Text style={[commonStyles.primaryButtonText, { marginLeft: 8 }]}>
              Sync Network
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
  networkBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  networkBadgeText: {
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
  codeSection: {
    // Code section
  },
  codeDisplay: {
    alignItems: 'center',
    marginBottom: 16,
  },
  codeLabel: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginBottom: 8,
  },
  codeValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  codeActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  codeButton: {
    flex: 1,
    marginHorizontal: 8,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  settingItem: {
    width: '48%',
    marginBottom: 16,
  },
  settingLabel: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginBottom: 8,
  },
  settingInput: {
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.foreground,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
  },
  statUnit: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  devicesSection: {
    // Devices container
  },
  deviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.foreground,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  deviceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deviceId: {
    fontSize: 12,
    color: colors.mutedForeground,
    fontFamily: 'monospace',
  },
  signalStrength: {
    fontSize: 12,
    color: colors.mutedForeground,
    fontFamily: 'monospace',
  },
  signalBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginLeft: 16,
  },
  signalBar: {
    width: 3,
    marginRight: 2,
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

export default TrekCodeScreen;