import React, { useState } from 'react';
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
import { colors } from '../styles/colors';
import { commonStyles } from '../styles/commonStyles';

const TrekMembersScreen = () => {
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: 'Alex Thompson',
      role: 'Team Leader',
      status: 'online',
      lastSeen: 'Now',
      location: { lat: 37.7749, lng: -122.4194, distance: 0 },
      battery: 87,
      signal: 4,
      emergency: false,
      deviceType: 'Primary'
    },
    {
      id: 2,
      name: 'Sarah Chen',
      role: 'Navigator',
      status: 'online',
      lastSeen: '2 min ago',
      location: { lat: 37.7751, lng: -122.4196, distance: 150 },
      battery: 73,
      signal: 3,
      emergency: false,
      deviceType: 'Secondary'
    },
    {
      id: 3,
      name: 'Mike Rodriguez',
      role: 'Safety Officer',
      status: 'offline',
      lastSeen: '15 min ago',
      location: { lat: 37.7747, lng: -122.4192, distance: 320 },
      battery: 45,
      signal: 2,
      emergency: false,
      deviceType: 'Backup'
    },
    {
      id: 4,
      name: 'Emma Wilson',
      role: 'Medic',
      status: 'emergency',
      lastSeen: '1 min ago',
      location: { lat: 37.7745, lng: -122.4190, distance: 450 },
      battery: 92,
      signal: 5,
      emergency: true,
      deviceType: 'Medical'
    }
  ]);

  const [emergencyContacts] = useState([
    { name: 'Emergency Services', number: '911', type: 'emergency' },
    { name: 'Mountain Rescue', number: '+1-555-RESCUE', type: 'rescue' },
    { name: 'Base Camp', number: '+1-555-0100', type: 'base' }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return colors.success;
      case 'offline': return colors.mutedForeground;
      case 'emergency': return colors.emergency;
      default: return colors.mutedForeground;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online': return colors.success;
      case 'offline': return colors.mutedForeground;
      case 'emergency': return colors.emergency;
      default: return colors.mutedForeground;
    }
  };

  const getSignalBars = (strength: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <View
        key={i}
        style={[
          styles.signalBar,
          {
            height: (i + 1) * 2 + 2,
            opacity: i < strength ? 1 : 0.2,
          }
        ]}
      />
    ));
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

  const MemberCard = ({ member }: { member: any }) => (
    <View style={[
      styles.memberCard,
      member.emergency && { borderColor: colors.emergency + '80', backgroundColor: colors.emergency + '10' }
    ]}>
      <View style={styles.memberContent}>
        <View style={styles.memberAvatar}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {member.name.split(' ').map((n: string) => n[0]).join('')}
            </Text>
          </View>
          <View style={[
            styles.statusDot,
            { backgroundColor: getStatusBadge(member.status) }
          ]} />
        </View>

        <View style={styles.memberInfo}>
          <View style={styles.memberHeader}>
            <View>
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberRole}>{member.role}</Text>
            </View>
            {member.emergency && (
              <View style={[styles.emergencyBadge, { backgroundColor: colors.emergency }]}>
                <Text style={[styles.emergencyBadgeText, { color: colors.emergencyForeground }]}>
                  EMERGENCY
                </Text>
              </View>
            )}
          </View>

          <View style={styles.memberStats}>
            <View style={styles.statItem}>
              <Ionicons name="time" size={12} color={getStatusColor(member.status)} />
              <Text style={[styles.statText, { color: getStatusColor(member.status) }]}>
                {member.lastSeen}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="location" size={12} color={colors.foreground} />
              <Text style={styles.statText}>{member.location.distance}m</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="battery-half" size={12} color={member.battery > 20 ? colors.foreground : colors.warning} />
              <Text style={[
                styles.statText,
                { color: member.battery > 20 ? colors.foreground : colors.warning }
              ]}>
                {member.battery}%
              </Text>
            </View>
            <View style={styles.statItem}>
              <View style={styles.signalBars}>
                {getSignalBars(member.signal)}
              </View>
              <Text style={styles.statText}>LoRa</Text>
            </View>
          </View>

          <View style={styles.memberActions}>
            <View style={[styles.deviceBadge, { borderColor: colors.border }]}>
              <Text style={styles.deviceBadgeText}>{member.deviceType}</Text>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={[styles.actionButton, { borderColor: colors.border }]}>
                <Ionicons name="chatbubble" size={12} color={colors.foreground} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, { borderColor: colors.border }]}>
                <Ionicons name="location" size={12} color={colors.foreground} />
              </TouchableOpacity>
              {member.emergency && (
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.emergency }]}>
                  <Ionicons name="shield" size={12} color={colors.emergencyForeground} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const ContactCard = ({ contact }: { contact: any }) => (
    <View style={[styles.contactCard, { borderColor: colors.border }]}>
      <View style={styles.contactInfo}>
        <View style={[
          styles.contactDot,
          {
            backgroundColor: contact.type === 'emergency' ? colors.emergency :
                            contact.type === 'rescue' ? colors.warning :
                            colors.primary
          }
        ]} />
        <View>
          <Text style={styles.contactName}>{contact.name}</Text>
          <Text style={styles.contactNumber}>{contact.number}</Text>
        </View>
      </View>
      <TouchableOpacity style={[styles.contactButton, { borderColor: colors.border }]}>
        <Ionicons name="call" size={12} color={colors.foreground} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={commonStyles.screenContainer}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Team Management</Text>
            <Text style={styles.headerSubtitle}>Trek Members & Emergency Contacts</Text>
          </View>
          <View style={[styles.onlineBadge, { borderColor: colors.network }]}>
            <Text style={[styles.onlineBadgeText, { color: colors.network }]}>
          {teamMembers.filter(m => m.status === 'online').length} Online
            </Text>
          </View>
        </View>

      {/* Network Status */}
        <Card title="LoRa Mesh Network" icon="radio">
          <View style={styles.networkStats}>
            <View style={styles.networkStat}>
              <Text style={[styles.networkStatValue, { color: colors.network }]}>
                {teamMembers.length}
              </Text>
              <Text style={styles.networkStatLabel}>Total Devices</Text>
            </View>
            <View style={styles.networkStat}>
              <Text style={[styles.networkStatValue, { color: colors.success }]}>
                {teamMembers.filter(m => m.status === 'online').length}
              </Text>
              <Text style={styles.networkStatLabel}>Connected</Text>
            </View>
            <View style={styles.networkStat}>
              <Text style={[styles.networkStatValue, { color: colors.technical }]}>
                45ms
              </Text>
              <Text style={styles.networkStatLabel}>Avg Latency</Text>
            </View>
          </View>
      </Card>

      {/* Team Members */}
        <View style={styles.membersSection}>
        {teamMembers.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </View>

      {/* Emergency Contacts */}
        <Card title="Emergency Contacts" icon="call">
          <View style={styles.contactsSection}>
          {emergencyContacts.map((contact, index) => (
              <ContactCard key={index} contact={contact} />
            ))}
          </View>
      </Card>

      {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={[commonStyles.secondaryButton, styles.actionButton]}>
            <Ionicons name="people" size={16} color={colors.foreground} />
            <Text style={[commonStyles.secondaryButtonText, { marginLeft: 8 }]}>
          Add Member
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.emergencyButton, styles.actionButton]}>
            <Ionicons name="warning" size={16} color={colors.emergencyForeground} />
            <Text style={[styles.emergencyButtonText, { marginLeft: 8 }]}>
          Emergency Alert
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
  onlineBadge: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  onlineBadgeText: {
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
  networkStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  networkStat: {
    alignItems: 'center',
  },
  networkStatValue: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  networkStatLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
  membersSection: {
    marginBottom: 24,
  },
  memberCard: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  memberContent: {
    flexDirection: 'row',
  },
  memberAvatar: {
    position: 'relative',
    marginRight: 16,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '33',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  statusDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.background,
  },
  memberInfo: {
    flex: 1,
  },
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.foreground,
    marginBottom: 2,
  },
  memberRole: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  emergencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  emergencyBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  memberStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statText: {
    fontSize: 12,
    marginLeft: 4,
  },
  signalBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: 4,
  },
  signalBar: {
    width: 2,
    backgroundColor: colors.network,
    marginRight: 1,
  },
  memberActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deviceBadge: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  deviceBadgeText: {
    fontSize: 12,
    color: colors.foreground,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  contactsSection: {
    // Contacts container
  },
  contactCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contactDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  contactName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.foreground,
    marginBottom: 2,
  },
  contactNumber: {
    fontSize: 12,
    color: colors.mutedForeground,
    fontFamily: 'monospace',
  },
  contactButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  emergencyButton: {
    backgroundColor: colors.emergency,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emergencyButtonText: {
    color: colors.emergencyForeground,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default TrekMembersScreen;