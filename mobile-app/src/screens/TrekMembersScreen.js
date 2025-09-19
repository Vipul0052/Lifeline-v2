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
import { colors, getStatusColor } from '../styles/colors';
import { commonStyles } from '../styles/commonStyles';

const TrekMembersScreen = () => {
  const [members, setMembers] = useState([
    {
      id: 1,
      name: 'Alex Thompson',
      role: 'Team Leader',
      status: 'online',
      location: 'Base Camp',
      battery: 87,
      lastSeen: '2 minutes ago',
      deviceId: 'DEV001'
    },
    {
      id: 2,
      name: 'Emma Wilson',
      role: 'Medic',
      status: 'emergency',
      location: 'Trail Point B',
      battery: 23,
      lastSeen: '1 minute ago',
      deviceId: 'DEV002'
    },
    {
      id: 3,
      name: 'Marcus Chen',
      role: 'Navigator',
      status: 'online',
      location: 'Summit Ridge',
      battery: 65,
      lastSeen: '5 minutes ago',
      deviceId: 'DEV003'
    },
    {
      id: 4,
      name: 'Sarah Johnson',
      role: 'Communications',
      status: 'offline',
      location: 'Last: Valley Base',
      battery: 12,
      lastSeen: '15 minutes ago',
      deviceId: 'DEV004'
    }
  ]);

  const [newMemberName, setNewMemberName] = useState('');
  const [showAddMember, setShowAddMember] = useState(false);

  const handleAddMember = () => {
    if (newMemberName.trim()) {
      const newMember = {
        id: members.length + 1,
        name: newMemberName.trim(),
        role: 'Team Member',
        status: 'offline',
        location: 'Unknown',
        battery: 100,
        lastSeen: 'Never',
        deviceId: `DEV00${members.length + 1}`
      };
      
      setMembers([...members, newMember]);
      setNewMemberName('');
      setShowAddMember(false);
      
      console.log('Added new member:', newMember);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', `${newMemberName} has been added to the team.`);
    }
  };

  const handleMemberPress = (member) => {
    console.log('Member pressed:', member);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const statusText = member.status === 'emergency' ? 'Emergency Status' : 'Member Details';
    Alert.alert(
      statusText,
      `Name: ${member.name}\nRole: ${member.role}\nStatus: ${member.status.toUpperCase()}\nLocation: ${member.location}\nBattery: ${member.battery}%\nDevice: ${member.deviceId}\nLast Seen: ${member.lastSeen}`,
      [
        { text: 'OK' },
        member.status === 'emergency' && { 
          text: 'Respond', 
          onPress: () => {
            console.log('Emergency response initiated for:', member.name);
            Alert.alert('Emergency Response', `Initiating emergency response for ${member.name}`);
          }
        }
      ].filter(Boolean)
    );
  };

  const handleEmergencyBroadcast = () => {
    console.log('Emergency broadcast initiated');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    Alert.alert(
      'Emergency Broadcast',
      'Send emergency alert to all team members?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send Alert', 
          style: 'destructive',
          onPress: () => {
            console.log('Emergency alert sent to all members');
            Alert.alert('Alert Sent', 'Emergency broadcast sent to all team members.');
          }
        }
      ]
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online':
        return { name: 'checkmark-circle', color: colors.success };
      case 'emergency':
        return { name: 'warning', color: colors.emergency };
      case 'offline':
        return { name: 'radio-button-off', color: colors.mutedForeground };
      default:
        return { name: 'help-circle', color: colors.mutedForeground };
    }
  };

  const getBatteryIcon = (battery) => {
    if (battery > 75) return 'battery-full';
    if (battery > 50) return 'battery-half';
    if (battery > 25) return 'battery-charging';
    return 'battery-dead';
  };

  const getBatteryColor = (battery) => {
    if (battery > 50) return colors.success;
    if (battery > 20) return colors.warning;
    return colors.emergency;
  };

  const emergencyMembers = members.filter(m => m.status === 'emergency');
  const onlineMembers = members.filter(m => m.status === 'online');
  const offlineMembers = members.filter(m => m.status === 'offline');

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <ScrollView contentContainerStyle={commonStyles.scrollContainer}>
        {/* Header */}
        <View style={commonStyles.spaceBetween}>
          <View>
            <Text style={commonStyles.title}>Trek Team</Text>
            <Text style={commonStyles.subtitle}>Team Communication & Tracking</Text>
          </View>
          <View style={[commonStyles.statusIndicator, { backgroundColor: colors.network + '33', borderColor: colors.network }]}>
            <Text style={[commonStyles.statusText, { color: colors.network }]}>
              {members.length} Members
            </Text>
          </View>
        </View>

        {/* Team Statistics */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{onlineMembers.length}</Text>
            <Text style={styles.statLabel}>Online</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.emergency }]}>
              {emergencyMembers.length}
            </Text>
            <Text style={styles.statLabel}>Emergency</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.mutedForeground }]}>
              {offlineMembers.length}
            </Text>
            <Text style={styles.statLabel}>Offline</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {Math.round(members.reduce((sum, m) => sum + m.battery, 0) / members.length)}%
            </Text>
            <Text style={styles.statLabel}>Avg Battery</Text>
          </View>
        </View>

        {/* Emergency Members */}
        {emergencyMembers.length > 0 && (
          <View style={[commonStyles.card, { borderColor: colors.emergency + '80' }]}>
            <View style={commonStyles.cardHeader}>
              <Ionicons name="warning" size={20} color={colors.emergency} />
              <Text style={[commonStyles.cardTitle, { color: colors.emergency }]}>
                Emergency Alerts ({emergencyMembers.length})
              </Text>
            </View>
            
            {emergencyMembers.map((member) => (
              <TouchableOpacity 
                key={member.id} 
                style={[styles.memberCard, { borderColor: colors.emergency + '80' }]}
                onPress={() => handleMemberPress(member)}
              >
                <MemberInfo member={member} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Online Members */}
        <View style={commonStyles.card}>
          <View style={commonStyles.cardHeader}>
            <Ionicons name="people" size={20} color={colors.success} />
            <Text style={commonStyles.cardTitle}>
              Online Members ({onlineMembers.length})
            </Text>
          </View>
          
          {onlineMembers.map((member) => (
            <TouchableOpacity 
              key={member.id} 
              style={styles.memberCard}
              onPress={() => handleMemberPress(member)}
            >
              <MemberInfo member={member} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Offline Members */}
        {offlineMembers.length > 0 && (
          <View style={commonStyles.card}>
            <View style={commonStyles.cardHeader}>
              <Ionicons name="radio-button-off" size={20} color={colors.mutedForeground} />
              <Text style={commonStyles.cardTitle}>
                Offline Members ({offlineMembers.length})
              </Text>
            </View>
            
            {offlineMembers.map((member) => (
              <TouchableOpacity 
                key={member.id} 
                style={[styles.memberCard, { opacity: 0.7 }]}
                onPress={() => handleMemberPress(member)}
              >
                <MemberInfo member={member} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Add New Member */}
        <View style={commonStyles.card}>
          <View style={commonStyles.cardHeader}>
            <Ionicons name="person-add" size={20} color={colors.foreground} />
            <Text style={commonStyles.cardTitle}>Add Team Member</Text>
          </View>

          {showAddMember ? (
            <View>
              <TextInput
                style={commonStyles.input}
                placeholder="Enter member name"
                placeholderTextColor={colors.mutedForeground}
                value={newMemberName}
                onChangeText={setNewMemberName}
                autoFocus
              />
              <View style={styles.addMemberButtons}>
                <TouchableOpacity 
                  style={[commonStyles.secondaryButton, { flex: 1, marginRight: 8 }]}
                  onPress={() => {
                    setShowAddMember(false);
                    setNewMemberName('');
                  }}
                >
                  <Text style={commonStyles.secondaryButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[commonStyles.primaryButton, { flex: 1, marginLeft: 8 }]}
                  onPress={handleAddMember}
                >
                  <Text style={commonStyles.primaryButtonText}>Add Member</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity 
              style={commonStyles.secondaryButton}
              onPress={() => setShowAddMember(true)}
            >
              <View style={[commonStyles.row, { justifyContent: 'center' }]}>
                <Ionicons name="add" size={16} color={colors.foreground} style={{ marginRight: 8 }} />
                <Text style={commonStyles.secondaryButtonText}>Add New Member</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* Emergency Actions */}
        <View style={styles.emergencyActions}>
          <TouchableOpacity 
            style={[commonStyles.primaryButton, { backgroundColor: colors.emergency }]}
            onPress={handleEmergencyBroadcast}
          >
            <View style={[commonStyles.row, { justifyContent: 'center' }]}>
              <Ionicons name="megaphone" size={16} color={colors.emergencyForeground} style={{ marginRight: 8 }} />
              <Text style={[commonStyles.primaryButtonText, { color: colors.emergencyForeground }]}>
                Emergency Broadcast
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Member Info Component
const MemberInfo = ({ member }) => {
  const statusIcon = getStatusIcon(member.status);
  const batteryIcon = getBatteryIcon(member.battery);
  const batteryColor = getBatteryColor(member.battery);

  return (
    <View style={styles.memberInfo}>
      <View style={styles.memberHeader}>
        <View style={commonStyles.row}>
          <Ionicons name={statusIcon.name} size={20} color={statusIcon.color} />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.memberName}>{member.name}</Text>
            <Text style={styles.memberRole}>{member.role}</Text>
          </View>
        </View>
        
        <View style={styles.memberStats}>
          <View style={[commonStyles.row, { alignItems: 'center' }]}>
            <Ionicons name={batteryIcon} size={16} color={batteryColor} />
            <Text style={[styles.batteryText, { color: batteryColor }]}>
              {member.battery}%
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.memberDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="location" size={14} color={colors.mutedForeground} />
          <Text style={styles.detailText}>{member.location}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Ionicons name="time" size={14} color={colors.mutedForeground} />
          <Text style={styles.detailText}>{member.lastSeen}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Ionicons name="hardware-chip" size={14} color={colors.mutedForeground} />
          <Text style={styles.detailText}>{member.deviceId}</Text>
        </View>
      </View>
    </View>
  );
};

// Helper functions (moved outside component to avoid re-creation)
const getStatusIcon = (status) => {
  switch (status) {
    case 'online':
      return { name: 'checkmark-circle', color: colors.success };
    case 'emergency':
      return { name: 'warning', color: colors.emergency };
    case 'offline':
      return { name: 'radio-button-off', color: colors.mutedForeground };
    default:
      return { name: 'help-circle', color: colors.mutedForeground };
  }
};

const getBatteryIcon = (battery) => {
  if (battery > 75) return 'battery-full';
  if (battery > 50) return 'battery-half';
  if (battery > 25) return 'battery-charging';
  return 'battery-dead';
};

const getBatteryColor = (battery) => {
  if (battery > 50) return colors.success;
  if (battery > 20) return colors.warning;
  return colors.emergency;
};

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.foreground,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  memberCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.foreground,
  },
  memberRole: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginTop: 2,
  },
  memberStats: {
    alignItems: 'flex-end',
  },
  batteryText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  memberDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginLeft: 6,
  },
  addMemberButtons: {
    flexDirection: 'row',
  },
  emergencyActions: {
    marginTop: 16,
  },
});

export default TrekMembersScreen;