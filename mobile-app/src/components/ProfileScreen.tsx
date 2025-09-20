import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/colors';
import { commonStyles } from '../styles/commonStyles';

const ProfileScreen = () => {
  const [userProfile, setUserProfile] = useState({
    name: 'Vishal Yadav',
    emergencyContact: '+91638547154',
    medicalInfo: 'Type 1 Diabetes',
    bloodType: 'O+'
  });

  const [deviceSettings, setDeviceSettings] = useState({
    impactSensitivity: 7,
    alertThreshold: 5,
    loraFrequency: 915,
    gpsPrecision: 'High',
    powerSaving: false,
    autoEmergency: true
  });

  const [systemPreferences, setSystemPreferences] = useState({
    darkMode: true,
    notifications: true,
    vibration: true,
    offlineMaps: true
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

  const InputField = ({ 
    label, 
    value, 
    onChangeText, 
    placeholder, 
    keyboardType = 'default' 
  }: { 
    label: string; 
    value: string; 
    onChangeText: (text: string) => void; 
    placeholder?: string;
    keyboardType?: 'default' | 'numeric' | 'phone-pad';
  }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        keyboardType={keyboardType}
      />
    </View>
  );

  const SwitchField = ({ 
    label, 
    value, 
    onValueChange, 
    icon 
  }: { 
    label: string; 
    value: boolean; 
    onValueChange: (value: boolean) => void;
    icon?: string;
  }) => (
    <View style={styles.switchContainer}>
      <View style={styles.switchLabel}>
        {icon && <Ionicons name={icon as any} size={16} color={colors.foreground} />}
        <Text style={styles.switchText}>{label}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.muted, true: colors.primary }}
        thumbColor={value ? colors.primaryForeground : colors.mutedForeground}
      />
    </View>
  );

  const SliderField = ({ 
    label, 
    value, 
    onValueChange, 
    min = 0, 
    max = 10 
  }: { 
    label: string; 
    value: number; 
    onValueChange: (value: number) => void;
    min?: number;
    max?: number;
  }) => (
    <View style={styles.sliderContainer}>
      <View style={styles.sliderHeader}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.sliderValue}>{value}/{max}</Text>
      </View>
      <View style={styles.sliderTrack}>
        <View style={[styles.sliderFill, { width: `${(value / max) * 100}%` }]} />
        <View style={[styles.sliderThumb, { left: `${(value / max) * 100}%` }]} />
      </View>
      <View style={styles.sliderLabels}>
        <Text style={styles.sliderLabel}>Low</Text>
        <Text style={styles.sliderLabel}>High</Text>
      </View>
    </View>
  );

  const SelectField = ({ 
    label, 
    value, 
    options, 
    onValueChange 
  }: { 
    label: string; 
    value: string; 
    options: { label: string; value: string }[];
    onValueChange: (value: string) => void;
  }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity 
        style={styles.selectButton}
        onPress={() => {
          Alert.alert(
            label,
            'Select an option',
            options.map(option => ({
              text: option.label,
              onPress: () => onValueChange(option.value)
            }))
          );
        }}
      >
        <Text style={styles.selectText}>{options.find(opt => opt.value === value)?.label || value}</Text>
        <Ionicons name="chevron-down" size={16} color={colors.mutedForeground} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={commonStyles.screenContainer}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>System Configuration</Text>
            <Text style={styles.headerSubtitle}>Device & User Settings</Text>
          </View>
          <View style={[styles.versionBadge, { borderColor: colors.technical }]}>
            <Text style={[styles.versionText, { color: colors.technical }]}>v2.1.0</Text>
          </View>
        </View>

        {/* User Profile Section */}
        <Card title="User Profile" icon="person">
          <View style={styles.profileGrid}>
            <InputField
              label="Full Name"
              value={userProfile.name}
              onChangeText={(text) => setUserProfile({...userProfile, name: text})}
            />
            <InputField
              label="Blood Type"
              value={userProfile.bloodType}
              onChangeText={(text) => setUserProfile({...userProfile, bloodType: text})}
            />
          </View>
          
          <InputField
            label="Emergency Contact"
            value={userProfile.emergencyContact}
            onChangeText={(text) => setUserProfile({...userProfile, emergencyContact: text})}
            keyboardType="phone-pad"
          />
          
          <InputField
            label="Medical Information"
            value={userProfile.medicalInfo}
            onChangeText={(text) => setUserProfile({...userProfile, medicalInfo: text})}
          />
        </Card>

        {/* Device Configuration */}
        <Card title="Device Configuration" icon="settings">
          <SliderField
            label="Impact Sensitivity"
            value={deviceSettings.impactSensitivity}
            onValueChange={(value) => setDeviceSettings({...deviceSettings, impactSensitivity: value})}
          />

          <SliderField
            label="Alert Threshold"
            value={deviceSettings.alertThreshold}
            onValueChange={(value) => setDeviceSettings({...deviceSettings, alertThreshold: value})}
          />

          <View style={styles.profileGrid}>
            <InputField
              label="LoRa Frequency (MHz)"
              value={deviceSettings.loraFrequency.toString()}
              onChangeText={(text) => setDeviceSettings({...deviceSettings, loraFrequency: parseInt(text) || 915})}
              keyboardType="numeric"
            />
            <SelectField
              label="GPS Precision"
              value={deviceSettings.gpsPrecision}
              options={[
                { label: 'High (1-3m)', value: 'High' },
                { label: 'Medium (3-10m)', value: 'Medium' },
                { label: 'Low (10m+)', value: 'Low' }
              ]}
              onValueChange={(value) => setDeviceSettings({...deviceSettings, gpsPrecision: value})}
            />
          </View>

          <View style={styles.switchesContainer}>
            <SwitchField
              label="Power Saving Mode"
              value={deviceSettings.powerSaving}
              onValueChange={(value) => setDeviceSettings({...deviceSettings, powerSaving: value})}
              icon="battery-half"
            />

            <SwitchField
              label="Auto Emergency Detection"
              value={deviceSettings.autoEmergency}
              onValueChange={(value) => setDeviceSettings({...deviceSettings, autoEmergency: value})}
              icon="warning"
            />
          </View>
        </Card>

        {/* System Preferences */}
        <Card title="System Preferences" icon="phone-portrait">
          <View style={styles.switchesContainer}>
            <SwitchField
              label="Notifications"
              value={systemPreferences.notifications}
              onValueChange={(value) => setSystemPreferences({...systemPreferences, notifications: value})}
            />

            <SwitchField
              label="Vibration Feedback"
              value={systemPreferences.vibration}
              onValueChange={(value) => setSystemPreferences({...systemPreferences, vibration: value})}
            />

            <SwitchField
              label="Offline Maps"
              value={systemPreferences.offlineMaps}
              onValueChange={(value) => setSystemPreferences({...systemPreferences, offlineMaps: value})}
              icon="download"
            />
          </View>
        </Card>

        {/* Network Status */}
        <Card title="Network Configuration" icon="radio">
          <View style={styles.networkGrid}>
            <View style={styles.networkCard}>
              <Ionicons name="radio" size={24} color={colors.network} />
              <Text style={styles.networkTitle}>LoRa Mesh</Text>
              <Text style={styles.networkSubtitle}>915 MHz</Text>
              <View style={[styles.networkBadge, { backgroundColor: colors.success }]}>
                <Text style={[styles.networkBadgeText, { color: colors.successForeground }]}>
                  Connected
                </Text>
              </View>
            </View>
            
            <View style={styles.networkCard}>
              <Ionicons name="location" size={24} color={colors.primary} />
              <Text style={styles.networkTitle}>GPS Module</Text>
              <Text style={styles.networkSubtitle}>8 Satellites</Text>
              <View style={[styles.networkBadge, { backgroundColor: colors.success }]}>
                <Text style={[styles.networkBadgeText, { color: colors.successForeground }]}>
                  Active
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={[commonStyles.secondaryButton, styles.actionButton]}>
            <Ionicons name="settings" size={16} color={colors.foreground} />
            <Text style={[commonStyles.secondaryButtonText, { marginLeft: 8 }]}>
              Advanced Settings
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[commonStyles.primaryButton, styles.actionButton]}>
            <Ionicons name="shield" size={16} color={colors.primaryForeground} />
            <Text style={[commonStyles.primaryButtonText, { marginLeft: 8 }]}>
              Save Configuration
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
  versionBadge: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  versionText: {
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
  profileGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.mutedForeground,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.foreground,
  },
  selectButton: {
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {
    fontSize: 16,
    color: colors.foreground,
  },
  sliderContainer: {
    marginBottom: 24,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sliderValue: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  sliderTrack: {
    height: 6,
    backgroundColor: colors.muted,
    borderRadius: 3,
    position: 'relative',
    marginBottom: 8,
  },
  sliderFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  sliderThumb: {
    position: 'absolute',
    top: -6,
    width: 18,
    height: 18,
    backgroundColor: colors.primary,
    borderRadius: 9,
    marginLeft: -9,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  switchesContainer: {
    marginTop: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  switchText: {
    fontSize: 16,
    color: colors.foreground,
    marginLeft: 8,
  },
  networkGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  networkCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  networkTitle: {
    fontSize: 14,
    color: colors.foreground,
    marginTop: 8,
    marginBottom: 4,
  },
  networkSubtitle: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginBottom: 8,
  },
  networkBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  networkBadgeText: {
    fontSize: 10,
    fontWeight: '500',
  },
  actionButtons: {
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

export default ProfileScreen;