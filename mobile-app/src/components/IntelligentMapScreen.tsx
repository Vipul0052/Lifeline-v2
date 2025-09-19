import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/colors';
import { commonStyles } from '../styles/commonStyles';

const IntelligentMapScreen = () => {
  const [mapLayers] = useState([
    { name: 'Topographic', active: true },
    { name: 'Satellite', active: false },
    { name: 'Trail Markers', active: true },
    { name: 'Emergency Zones', active: true },
  ]);

  const [teamLocations] = useState([
    { name: 'Alex Thompson', distance: 0, status: 'online' },
    { name: 'Sarah Chen', distance: 150, status: 'online' },
    { name: 'Mike Rodriguez', distance: 320, status: 'offline' },
    { name: 'Emma Wilson', distance: 450, status: 'emergency' },
  ]);

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

  return (
    <SafeAreaView style={commonStyles.screenContainer}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Intelligent Map</Text>
            <Text style={styles.headerSubtitle}>Advanced Navigation & Team Tracking</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: colors.technical }]}>
            <Text style={[styles.statusBadgeText, { color: colors.technicalForeground }]}>
              Live Tracking
            </Text>
          </View>
        </View>

        {/* Map Placeholder */}
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map" size={64} color={colors.mutedForeground} />
          <Text style={styles.mapPlaceholderText}>Interactive Map View</Text>
          <Text style={styles.mapPlaceholderSubtext}>
            Real-time team locations and navigation
          </Text>
        </View>

        {/* Map Layers */}
        <Card title="Map Layers" icon="layers">
          <View style={styles.layersContainer}>
            {mapLayers.map((layer, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.layerItem,
                  layer.active && { backgroundColor: colors.primary + '20' }
                ]}
              >
                <View style={styles.layerInfo}>
                  <Text style={[
                    styles.layerName,
                    layer.active && { color: colors.primary }
                  ]}>
                    {layer.name}
                  </Text>
                </View>
                <View style={[
                  styles.layerToggle,
                  { backgroundColor: layer.active ? colors.primary : colors.muted }
                ]}>
                  {layer.active && (
                    <Ionicons name="checkmark" size={12} color={colors.primaryForeground} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Team Locations */}
        <Card title="Team Locations" icon="people">
          <View style={styles.teamContainer}>
            {teamLocations.map((member, index) => (
              <View key={index} style={styles.teamMember}>
                <View style={styles.memberInfo}>
                  <View style={[
                    styles.statusDot,
                    { backgroundColor: member.status === 'online' ? colors.success :
                                       member.status === 'emergency' ? colors.emergency :
                                       colors.mutedForeground }
                  ]} />
                  <Text style={styles.memberName}>{member.name}</Text>
                </View>
                <Text style={styles.memberDistance}>{member.distance}m</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Navigation Tools */}
        <Card title="Navigation Tools" icon="compass">
          <View style={styles.toolsGrid}>
            <TouchableOpacity style={[styles.toolButton, { borderColor: colors.border }]}>
              <Ionicons name="navigate" size={24} color={colors.primary} />
              <Text style={styles.toolText}>Navigate</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.toolButton, { borderColor: colors.border }]}>
              <Ionicons name="flag" size={24} color={colors.warning} />
              <Text style={styles.toolText}>Waypoint</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.toolButton, { borderColor: colors.border }]}>
              <Ionicons name="trail-sign" size={24} color={colors.technical} />
              <Text style={styles.toolText}>Trail</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.toolButton, { borderColor: colors.border }]}>
              <Ionicons name="location" size={24} color={colors.network} />
              <Text style={styles.toolText}>Share</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={[commonStyles.secondaryButton, styles.actionButton]}>
            <Ionicons name="download" size={16} color={colors.foreground} />
            <Text style={[commonStyles.secondaryButtonText, { marginLeft: 8 }]}>
              Download Map
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[commonStyles.primaryButton, styles.actionButton]}>
            <Ionicons name="refresh" size={16} color={colors.primaryForeground} />
            <Text style={[commonStyles.primaryButtonText, { marginLeft: 8 }]}>
              Sync Data
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
  mapPlaceholder: {
    height: 200,
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.foreground,
    marginTop: 16,
    marginBottom: 8,
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    color: colors.mutedForeground,
    textAlign: 'center',
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
  layersContainer: {
    // Layers container
  },
  layerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  layerInfo: {
    flex: 1,
  },
  layerName: {
    fontSize: 16,
    color: colors.foreground,
  },
  layerToggle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamContainer: {
    // Team container
  },
  teamMember: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  memberName: {
    fontSize: 16,
    color: colors.foreground,
  },
  memberDistance: {
    fontSize: 14,
    color: colors.mutedForeground,
    fontFamily: 'monospace',
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  toolButton: {
    width: '48%',
    height: 80,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  toolText: {
    fontSize: 12,
    color: colors.foreground,
    marginTop: 8,
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

export default IntelligentMapScreen;