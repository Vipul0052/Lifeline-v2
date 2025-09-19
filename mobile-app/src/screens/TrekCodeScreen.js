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
import * as Haptics from 'expo-haptics';
import { colors } from '../styles/colors';
import { commonStyles } from '../styles/commonStyles';

const TrekCodeScreen = () => {
  const [networkStatus] = useState({
    meshNodes: 4,
    signalStrength: 'Strong',
    networkId: 'LIFELINE-MESH-001',
    frequency: '915 MHz',
    bandwidth: '125 kHz',
    spreadingFactor: 7,
    codingRate: '4/5',
    txPower: 14
  });

  const [joinCode] = useState('LF-2024-TREK-ALPHA-7X9K');
  const [inputCode, setInputCode] = useState('');
  const [qrCodeVisible, setQrCodeVisible] = useState(false);

  const [connectedDevices] = useState([
    {
      id: 1,
      name: 'Alex Thompson - DEV001',
      role: 'Leader',
      status: 'online',
      rssi: -45,
      distance: '12m',
      battery: 87,
      joinedAt: new Date(Date.now() - 3600000)
    },
    {
      id: 2,
      name: 'Emma Wilson - DEV002',
      role: 'Medic',
      status: 'emergency',
      rssi: -72,
      distance: '245m',
      battery: 23,
      joinedAt: new Date(Date.now() - 1800000)
    },
    {
      id: 3,
      name: 'Marcus Chen - DEV003',
      role: 'Navigator',
      status: 'online',
      rssi: -58,
      distance: '89m',
      battery: 65,
      joinedAt: new Date(Date.now() - 900000)
    },
    {
      id: 4,
      name: 'Sarah Johnson - DEV004',
      role: 'Communications',
      status: 'offline',
      rssi: -95,
      distance: 'Unknown',
      battery: 12,
      joinedAt: new Date(Date.now() - 7200000)
    }
  ]);

  const [meshMetrics] = useState({
    packetsTransmitted: 1247,
    packetsReceived: 1198,
    packetLoss: 3.9,
    averageLatency: 45,
    networkUptime: '2h 34m',
    dataTransferred: '2.4 MB'
  });

  const handleJoinNetwork = () => {
    if (!inputCode.trim()) {
      Alert.alert('Error', 'Please enter a trek code to join the network.');
      return;
    }

    console.log('Attempting to join network with code:', inputCode);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Simulate network join process
    Alert.alert(
      'Joining Network...',
      `Attempting to join LoRa mesh network with code: ${inputCode}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Join', 
          onPress: () => {
            console.log('Network join initiated');
            setInputCode('');
            Alert.alert('Success', 'Successfully joined the trek network!');
          }
        }
      ]
    );
  };

  const handleShareCode = () => {
    console.log('Sharing network code:', joinCode);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    Alert.alert(
      'Share Trek Code',
      `Network Code: ${joinCode}\n\nShare this code with team members to join your LoRa mesh network.`,
      [
        { text: 'Copy Code', onPress: () => console.log('Code copied to clipboard') },
        { text: 'Show QR Code', onPress: () => setQrCodeVisible(true) },
        { text: 'Close' }
      ]
    );
  };

  const handleDevicePress = (device) => {
    console.log('Device pressed:', device);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const statusMessage = `Status: ${device.status.toUpperCase()}\n` +
                         `Signal: ${device.rssi}dBm\n` +
                         `Distance: ${device.distance}\n` +
                         `Battery: ${device.battery}%\n` +
                         `Joined: ${device.joinedAt.toLocaleTimeString()}`;
    
    Alert.alert(device.name, statusMessage);
  };

  const handleNetworkDiagnostics = () => {
    console.log('Running network diagnostics');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    Alert.alert(
      'Network Diagnostics',
      'Running comprehensive network analysis...',
      [
        { text: 'View Report', onPress: () => console.log('Diagnostics report opened') },
        { text: 'OK' }
      ]
    );
  };

  const handleCreateNewNetwork = () => {
    console.log('Creating new network');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    Alert.alert(
      'Create New Network',
      'Create a new LoRa mesh network? This will disconnect from the current network.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Create', 
          style: 'destructive',
          onPress: () => {
            console.log('New network created');
            Alert.alert('Network Created', 'New LoRa mesh network has been created successfully.');
          }
        }
      ]
    );
  };

  const getDeviceStatusIcon = (status) => {
    switch (status) {
      case 'online': return { name: 'checkmark-circle', color: colors.success };
      case 'emergency': return { name: 'warning', color: colors.emergency };
      case 'offline': return { name: 'radio-button-off', color: colors.mutedForeground };
      default: return { name: 'help-circle', color: colors.mutedForeground };
    }
  };

  const getSignalStrengthColor = (rssi) => {
    if (rssi > -50) return colors.success;
    if (rssi > -70) return colors.warning;
    return colors.emergency;
  };

  const onlineDevices = connectedDevices.filter(d => d.status === 'online').length;
  const emergencyDevices = connectedDevices.filter(d => d.status === 'emergency').length;

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <ScrollView contentContainerStyle={commonStyles.scrollContainer}>
        {/* Header */}
        <View style={commonStyles.spaceBetween}>
          <View>
            <Text style={commonStyles.title}>LoRa Network</Text>
            <Text style={commonStyles.subtitle}>Mesh Communication System</Text>
          </View>
          <View style={[commonStyles.statusIndicator, { 
            backgroundColor: colors.network + '33', 
            borderColor: colors.network 
          }]}>
            <Text style={[commonStyles.statusText, { color: colors.network }]}>
              {networkStatus.meshNodes} Nodes
            </Text>
          </View>
        </View>

        {/* Network Status */}
        <View style={commonStyles.card}>
          <View style={commonStyles.cardHeader}>
            <Ionicons name="radio" size={20} color={colors.network} />
            <Text style={commonStyles.cardTitle}>Network Status</Text>
          </View>

          <View style={styles.networkGrid}>
            <View style={styles.networkStat}>
              <Text style={commonStyles.smallText}>Network ID</Text>
              <Text style={commonStyles.technicalText}>{networkStatus.networkId}</Text>
            </View>
            <View style={styles.networkStat}>
              <Text style={commonStyles.smallText}>Frequency</Text>
              <Text style={commonStyles.technicalText}>{networkStatus.frequency}</Text>
            </View>
            <View style={styles.networkStat}>
              <Text style={commonStyles.smallText}>Signal Strength</Text>
              <Text style={[styles.networkValue, { color: colors.success }]}>
                {networkStatus.signalStrength}
              </Text>
            </View>
            <View style={styles.networkStat}>
              <Text style={commonStyles.smallText}>TX Power</Text>
              <Text style={commonStyles.technicalText}>{networkStatus.txPower} dBm</Text>
            </View>
            <View style={styles.networkStat}>
              <Text style={commonStyles.smallText}>Bandwidth</Text>
              <Text style={commonStyles.technicalText}>{networkStatus.bandwidth}</Text>
            </View>
            <View style={styles.networkStat}>
              <Text style={commonStyles.smallText}>SF/CR</Text>
              <Text style={commonStyles.technicalText}>
                {networkStatus.spreadingFactor}/{networkStatus.codingRate}
              </Text>
            </View>
          </View>
        </View>

        {/* Network Metrics */}
        <View style={commonStyles.card}>
          <View style={commonStyles.cardHeader}>
            <Ionicons name="stats-chart" size={20} color={colors.technical} />
            <Text style={commonStyles.cardTitle}>Mesh Metrics</Text>
          </View>

          <View style={styles.metricsGrid}>
            <MetricItem 
              label="Packets TX" 
              value={meshMetrics.packetsTransmitted.toLocaleString()} 
            />
            <MetricItem 
              label="Packets RX" 
              value={meshMetrics.packetsReceived.toLocaleString()} 
            />
            <MetricItem 
              label="Packet Loss" 
              value={`${meshMetrics.packetLoss}%`}
              color={meshMetrics.packetLoss > 5 ? colors.warning : colors.success}
            />
            <MetricItem 
              label="Avg Latency" 
              value={`${meshMetrics.averageLatency}ms`} 
            />
            <MetricItem 
              label="Uptime" 
              value={meshMetrics.networkUptime} 
            />
            <MetricItem 
              label="Data Transfer" 
              value={meshMetrics.dataTransferred} 
            />
          </View>
        </View>

        {/* Join Network */}
        <View style={commonStyles.card}>
          <View style={commonStyles.cardHeader}>
            <Ionicons name="qr-code" size={20} color={colors.foreground} />
            <Text style={commonStyles.cardTitle}>Join Network</Text>
          </View>

          <Text style={commonStyles.label}>Enter Trek Code</Text>
          <TextInput
            style={commonStyles.input}
            placeholder="LF-2024-TREK-XXXXX-XXXX"
            placeholderTextColor={colors.mutedForeground}
            value={inputCode}
            onChangeText={setInputCode}
            autoCapitalize="characters"
          />

          <TouchableOpacity 
            style={commonStyles.primaryButton}
            onPress={handleJoinNetwork}
          >
            <View style={[commonStyles.row, { justifyContent: 'center' }]}>
              <Ionicons name="link" size={16} color={colors.primaryForeground} style={{ marginRight: 8 }} />
              <Text style={commonStyles.primaryButtonText}>Join Network</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Current Network Code */}
        <View style={commonStyles.card}>
          <View style={commonStyles.cardHeader}>
            <Ionicons name="key" size={20} color={colors.warning} />
            <Text style={commonStyles.cardTitle}>Your Network Code</Text>
          </View>

          <View style={styles.codeContainer}>
            <Text style={styles.networkCode}>{joinCode}</Text>
          </View>

          <Text style={styles.codeDescription}>
            Share this code with team members to join your LoRa mesh network
          </Text>

          <TouchableOpacity 
            style={commonStyles.secondaryButton}
            onPress={handleShareCode}
          >
            <View style={[commonStyles.row, { justifyContent: 'center' }]}>
              <Ionicons name="share" size={16} color={colors.foreground} style={{ marginRight: 8 }} />
              <Text style={commonStyles.secondaryButtonText}>Share Code</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Connected Devices */}
        <View style={commonStyles.card}>
          <View style={commonStyles.cardHeader}>
            <Ionicons name="devices" size={20} color={colors.foreground} />
            <Text style={commonStyles.cardTitle}>
              Connected Devices ({connectedDevices.length})
            </Text>
          </View>

          <View style={styles.deviceStats}>
            <View style={styles.deviceStat}>
              <Text style={[styles.deviceStatValue, { color: colors.success }]}>
                {onlineDevices}
              </Text>
              <Text style={commonStyles.smallText}>Online</Text>
            </View>
            <View style={styles.deviceStat}>
              <Text style={[styles.deviceStatValue, { color: colors.emergency }]}>
                {emergencyDevices}
              </Text>
              <Text style={commonStyles.smallText}>Emergency</Text>
            </View>
            <View style={styles.deviceStat}>
              <Text style={styles.deviceStatValue}>
                {Math.round(connectedDevices.reduce((sum, d) => sum + d.battery, 0) / connectedDevices.length)}%
              </Text>
              <Text style={commonStyles.smallText}>Avg Battery</Text>
            </View>
          </View>

          {connectedDevices.map((device) => {
            const statusIcon = getDeviceStatusIcon(device.status);
            const signalColor = getSignalStrengthColor(device.rssi);
            
            return (
              <TouchableOpacity 
                key={device.id}
                style={styles.deviceItem}
                onPress={() => handleDevicePress(device)}
              >
                <View style={[styles.deviceStatusIcon, { backgroundColor: statusIcon.color + '33' }]}>
                  <Ionicons name={statusIcon.name} size={16} color={statusIcon.color} />
                </View>
                
                <View style={styles.deviceDetails}>
                  <Text style={styles.deviceName}>{device.name}</Text>
                  <Text style={styles.deviceRole}>{device.role}</Text>
                  
                  <View style={styles.deviceMetrics}>
                    <Text style={[commonStyles.technicalText, { color: signalColor }]}>
                      {device.rssi}dBm
                    </Text>
                    <Text style={commonStyles.smallText}>•</Text>
                    <Text style={commonStyles.smallText}>{device.distance}</Text>
                    <Text style={commonStyles.smallText}>•</Text>
                    <Text style={commonStyles.smallText}>{device.battery}%</Text>
                  </View>
                </View>
                
                <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Network Actions */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[commonStyles.secondaryButton, { flex: 1, marginRight: 8 }]}
            onPress={handleNetworkDiagnostics}
          >
            <View style={[commonStyles.row, { justifyContent: 'center' }]}>
              <Ionicons name="analytics" size={16} color={colors.foreground} style={{ marginRight: 8 }} />
              <Text style={commonStyles.secondaryButtonText}>Diagnostics</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[commonStyles.secondaryButton, { flex: 1, marginLeft: 8 }]}
            onPress={handleCreateNewNetwork}
          >
            <View style={[commonStyles.row, { justifyContent: 'center' }]}>
              <Ionicons name="add-circle" size={16} color={colors.foreground} style={{ marginRight: 8 }} />
              <Text style={commonStyles.secondaryButtonText}>New Network</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Metric Item Component
const MetricItem = ({ label, value, color = colors.foreground }) => (
  <View style={styles.metricItem}>
    <Text style={commonStyles.smallText}>{label}</Text>
    <Text style={[styles.metricValue, { color }]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  networkGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  networkStat: {
    width: '50%',
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  networkValue: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  metricItem: {
    width: '33.33%',
    paddingHorizontal: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 4,
  },
  codeContainer: {
    backgroundColor: colors.muted,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  networkCode: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.warning,
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  codeDescription: {
    fontSize: 14,
    color: colors.mutedForeground,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  deviceStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  deviceStat: {
    alignItems: 'center',
  },
  deviceStatValue: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 4,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  deviceStatusIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  deviceDetails: {
    flex: 1,
  },
  deviceName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.foreground,
    marginBottom: 2,
  },
  deviceRole: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginBottom: 4,
  },
  deviceMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 16,
  },
});

export default TrekCodeScreen;