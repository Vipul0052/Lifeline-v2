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
import * as Haptics from 'expo-haptics';
import { colors } from '../styles/colors';
import { commonStyles } from '../styles/commonStyles';
import SliderComponent from '../components/SliderComponent';
import { useAuth } from '../contexts/AuthContext';

const ProfileScreen = () => {
  const { user, signOut } = useAuth();
  
  const [userProfile, setUserProfile] = useState({
    name: user?.user_metadata?.name || user?.email || 'User',
    emergencyContact: '+1-555-0123',
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
    notifications: true,
    vibration: true,
    offlineMaps: true
  });

  const handleSaveConfiguration = () => {
    console.log('Configuration saved:', { userProfile, deviceSettings, systemPreferences });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Success', 'Configuration saved successfully!');
  };

  const handleAdvancedSettings = () => {
    console.log('Advanced settings pressed');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Advanced Settings', 'Advanced configuration options coming soon.');
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <ScrollView contentContainerStyle={commonStyles.scrollContainer}>
        {/* Header */}
        <View style={commonStyles.spaceBetween}>
          <View>
            <Text style={commonStyles.title}>System Configuration</Text>
            <Text style={commonStyles.subtitle}>Device & User Settings</Text>
          </View>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <Ionicons name="log-out-outline" size={20} color={colors.emergency} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* User Profile Section */}
        <View style={commonStyles.card}>
          <View style={commonStyles.cardHeader}>
            <Ionicons name="person" size={20} color={colors.foreground} />
            <Text style={commonStyles.cardTitle}>User Profile</Text>
          </View>

          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Text style={commonStyles.label}>Full Name</Text>
              <TextInput
                style={commonStyles.input}
                value={userProfile.name}
                onChangeText={(text) => setUserProfile({...userProfile, name: text})}
                placeholderTextColor={colors.mutedForeground}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={commonStyles.label}>Blood Type</Text>
              <TextInput
                style={commonStyles.input}
                value={userProfile.bloodType}
                onChangeText={(text) => setUserProfile({...userProfile, bloodType: text})}
                placeholderTextColor={colors.mutedForeground}
              />
            </View>
          </View>

          <Text style={commonStyles.label}>Emergency Contact</Text>
          <TextInput
            style={commonStyles.input}
            value={userProfile.emergencyContact}
            onChangeText={(text) => setUserProfile({...userProfile, emergencyContact: text})}
            keyboardType="phone-pad"
            placeholderTextColor={colors.mutedForeground}
          />

          <Text style={commonStyles.label}>Medical Information</Text>
          <TextInput
            style={commonStyles.input}
            value={userProfile.medicalInfo}
            onChangeText={(text) => setUserProfile({...userProfile, medicalInfo: text})}
            placeholderTextColor={colors.mutedForeground}
            multiline
          />
        </View>

        {/* Device Configuration */}
        <View style={commonStyles.card}>
          <View style={commonStyles.cardHeader}>
            <Ionicons name="settings" size={20} color={colors.foreground} />
            <Text style={commonStyles.cardTitle}>Device Configuration</Text>
          </View>

          <SliderComponent
            title="Impact Sensitivity"
            value={deviceSettings.impactSensitivity}
            minimumValue={1}
            maximumValue={10}
            step={1}
            onValueChange={(value) => setDeviceSettings({...deviceSettings, impactSensitivity: value})}
            lowLabel="Low"
            highLabel="High"
          />

          <SliderComponent
            title="Alert Threshold"
            value={deviceSettings.alertThreshold}
            minimumValue={1}
            maximumValue={10}
            step={1}
            onValueChange={(value) => setDeviceSettings({...deviceSettings, alertThreshold: value})}
          />

          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Text style={commonStyles.label}>LoRa Frequency (MHz)</Text>
              <TextInput
                style={commonStyles.input}
                value={deviceSettings.loraFrequency.toString()}
                onChangeText={(text) => setDeviceSettings({...deviceSettings, loraFrequency: parseInt(text) || 915})}
                keyboardType="numeric"
                placeholderTextColor={colors.mutedForeground}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={commonStyles.label}>GPS Precision</Text>
              <TouchableOpacity 
                style={styles.picker}
                onPress={() => Alert.alert('GPS Precision', 'Precision selector coming soon')}
              >
                <Text style={styles.pickerText}>{deviceSettings.gpsPrecision}</Text>
                <Ionicons name="chevron-down" size={20} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.switchContainer}>
            <View style={commonStyles.row}>
              <Ionicons name="battery-half" size={20} color={colors.warning} />
              <Text style={[commonStyles.label, { marginLeft: 12, marginBottom: 0 }]}>Power Saving Mode</Text>
            </View>
            <Switch
              value={deviceSettings.powerSaving}
              onValueChange={(value) => setDeviceSettings({...deviceSettings, powerSaving: value})}
              trackColor={{ false: colors.muted, true: colors.primary + '80' }}
              thumbColor={deviceSettings.powerSaving ? colors.primary : colors.mutedForeground}
            />
          </View>

          <View style={styles.switchContainer}>
            <View style={commonStyles.row}>
              <Ionicons name="warning" size={20} color={colors.emergency} />
              <Text style={[commonStyles.label, { marginLeft: 12, marginBottom: 0 }]}>Auto Emergency Detection</Text>
            </View>
            <Switch
              value={deviceSettings.autoEmergency}
              onValueChange={(value) => setDeviceSettings({...deviceSettings, autoEmergency: value})}
              trackColor={{ false: colors.muted, true: colors.primary + '80' }}
              thumbColor={deviceSettings.autoEmergency ? colors.primary : colors.mutedForeground}
            />
          </View>
        </View>

        {/* System Preferences */}
        <View style={commonStyles.card}>
          <View style={commonStyles.cardHeader}>
            <Ionicons name="phone-portrait" size={20} color={colors.foreground} />
            <Text style={commonStyles.cardTitle}>System Preferences</Text>
          </View>

          <View style={styles.switchContainer}>
            <Text style={[commonStyles.label, { marginBottom: 0 }]}>Notifications</Text>
            <Switch
              value={systemPreferences.notifications}
              onValueChange={(value) => setSystemPreferences({...systemPreferences, notifications: value})}
              trackColor={{ false: colors.muted, true: colors.primary + '80' }}
              thumbColor={systemPreferences.notifications ? colors.primary : colors.mutedForeground}
            />
          </View>

          <View style={styles.switchContainer}>
            <Text style={[commonStyles.label, { marginBottom: 0 }]}>Vibration Feedback</Text>
            <Switch
              value={systemPreferences.vibration}
              onValueChange={(value) => setSystemPreferences({...systemPreferences, vibration: value})}
              trackColor={{ false: colors.muted, true: colors.primary + '80' }}
              thumbColor={systemPreferences.vibration ? colors.primary : colors.mutedForeground}
            />
          </View>

          <View style={styles.switchContainer}>
            <View style={commonStyles.row}>
              <Ionicons name="download" size={20} color={colors.foreground} />
              <Text style={[commonStyles.label, { marginLeft: 12, marginBottom: 0 }]}>Offline Maps</Text>
            </View>
            <Switch
              value={systemPreferences.offlineMaps}
              onValueChange={(value) => setSystemPreferences({...systemPreferences, offlineMaps: value})}
              trackColor={{ false: colors.muted, true: colors.primary + '80' }}
              thumbColor={systemPreferences.offlineMaps ? colors.primary : colors.mutedForeground}
            />
          </View>
        </View>

        {/* Network Configuration */}
        <View style={commonStyles.card}>
          <View style={commonStyles.cardHeader}>
            <Ionicons name="radio" size={20} color={colors.foreground} />
            <Text style={commonStyles.cardTitle}>Network Configuration</Text>
          </View>

          <View style={styles.networkGrid}>
            <View style={styles.networkModule}>
              <Ionicons name="radio" size={24} color={colors.network} />
              <Text style={styles.networkTitle}>LoRa Mesh</Text>
              <Text style={styles.networkSubtitle}>915 MHz</Text>
              <View style={[commonStyles.statusIndicator, { backgroundColor: colors.success + '33', borderColor: colors.success, marginTop: 8 }]}>
                <Text style={[commonStyles.statusText, { color: colors.success }]}>Connected</Text>
              </View>
            </View>

            <View style={styles.networkModule}>
              <Ionicons name="satellite" size={24} color={colors.primary} />
              <Text style={styles.networkTitle}>GPS Module</Text>
              <Text style={styles.networkSubtitle}>8 Satellites</Text>
              <View style={[commonStyles.statusIndicator, { backgroundColor: colors.success + '33', borderColor: colors.success, marginTop: 8 }]}>
                <Text style={[commonStyles.statusText, { color: colors.success }]}>Active</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[commonStyles.secondaryButton, { flex: 1, marginRight: 8 }]}
            onPress={handleAdvancedSettings}
          >
            <View style={[commonStyles.row, { justifyContent: 'center' }]}>
              <Ionicons name="settings" size={16} color={colors.foreground} style={{ marginRight: 8 }} />
              <Text style={commonStyles.secondaryButtonText}>Advanced Settings</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[commonStyles.primaryButton, { flex: 1, marginLeft: 8 }]}
            onPress={handleSaveConfiguration}
          >
            <View style={[commonStyles.row, { justifyContent: 'center' }]}>
              <Ionicons name="shield-checkmark" size={16} color={colors.primaryForeground} style={{ marginRight: 8 }} />
              <Text style={commonStyles.primaryButtonText}>Save Configuration</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    marginHorizontal: -8,
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 8,
  },
  picker: {
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  pickerText: {
    fontSize: 16,
    color: colors.foreground,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  networkGrid: {
    flexDirection: 'row',
    marginHorizontal: -8,
  },
  networkModule: {
    flex: 1,
    marginHorizontal: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    alignItems: 'center',
  },
  networkTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.foreground,
    marginTop: 8,
  },
  networkSubtitle: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.emergency,
    borderRadius: 8,
    backgroundColor: colors.emergency + '10',
  },
  signOutText: {
    fontSize: 14,
    color: colors.emergency,
    fontWeight: '500',
    marginLeft: 6,
  },
});

export default ProfileScreen;