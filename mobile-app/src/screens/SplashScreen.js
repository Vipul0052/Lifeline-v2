import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/colors';
import CircuitBoardBackground from '../components/CircuitBoardBackground';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const pulseAnim = useRef(new Animated.Value(0.8)).current;

  const initSteps = [
    { name: 'Device Connection', status: 'complete' },
    { name: 'Sensor Calibration', status: 'complete' },
    { name: 'LoRa Network', status: 'active' },
    { name: 'GPS Module', status: 'pending' },
    { name: 'System Ready', status: 'pending' }
  ];

  useEffect(() => {
    // Pulse animation for logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.8,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Progress animation
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          setTimeout(onFinish, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    // Step progression
    const stepTimer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= initSteps.length - 1) {
          clearInterval(stepTimer);
          return prev;
        }
        return prev + 1;
      });
    }, 600);

    return () => {
      clearInterval(progressTimer);
      clearInterval(stepTimer);
    };
  }, []);

  const getStatusIcon = (index) => {
    if (index < currentStep) {
      return <Ionicons name="checkmark-circle" size={16} color={colors.success} />;
    } else if (index === currentStep) {
      return <Ionicons name="radio-button-on" size={16} color={colors.primary} />;
    } else {
      return <Ionicons name="radio-button-off" size={16} color={colors.mutedForeground} />;
    }
  };

  const getStatusColor = (index) => {
    if (index < currentStep) return colors.success;
    if (index === currentStep) return colors.primary;
    return colors.mutedForeground;
  };

  return (
    <View style={styles.container}>
      <CircuitBoardBackground />
      
      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <Animated.View 
            style={[
              styles.logoContainer,
              { transform: [{ scale: pulseAnim }] }
            ]}
          >
            <View style={styles.outerCircle}>
              <View style={styles.innerCircle}>
                <View style={styles.centerDot} />
              </View>
            </View>
          </Animated.View>
          
          <Text style={styles.title}>LIFELINE</Text>
          <Text style={styles.subtitle}>Intelligent Safety Beyond Networks</Text>
          
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>v2.1.0 - IoT Emergency Response</Text>
          </View>
        </View>
        
        {/* Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>System Initialization</Text>
            <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
          </View>
          
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${progress}%` }
              ]} 
            />
          </View>
        </View>
        
        {/* Initialization Steps */}
        <View style={styles.stepsSection}>
          {initSteps.map((step, index) => (
            <View key={step.name} style={styles.stepRow}>
              {getStatusIcon(index)}
              <Text 
                style={[
                  styles.stepText,
                  { color: getStatusColor(index) }
                ]}
              >
                {step.name}
              </Text>
            </View>
          ))}
        </View>
        
        {/* Technical Status */}
        <View style={styles.technicalSection}>
          <View style={styles.techItem}>
            <Text style={styles.techLabel}>Network</Text>
            <Text style={styles.techValue}>LoRa Mesh</Text>
          </View>
          <View style={styles.techItem}>
            <Text style={styles.techLabel}>Sensors</Text>
            <Text style={styles.techValue}>MPU6050</Text>
          </View>
        </View>
        
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Emergency Response System</Text>
          <Text style={styles.copyrightText}>© 2024 Lifeline IoT Technologies</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 64,
  },
  logoContainer: {
    marginBottom: 24,
  },
  outerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.technical,
    backgroundColor: colors.technical + '33',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: colors.foreground,
    letterSpacing: 2,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: colors.mutedForeground,
    marginBottom: 16,
    textAlign: 'center',
  },
  versionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.technical,
    borderRadius: 16,
  },
  versionText: {
    fontSize: 12,
    color: colors.technical,
  },
  progressSection: {
    width: 320,
    maxWidth: '90%',
    marginBottom: 32,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: colors.foreground,
  },
  progressPercentage: {
    fontSize: 14,
    color: colors.foreground,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.muted,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  stepsSection: {
    width: 320,
    maxWidth: '90%',
    marginBottom: 32,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  stepText: {
    fontSize: 14,
    marginLeft: 12,
  },
  technicalSection: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: 320,
    maxWidth: '90%',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginBottom: 40,
  },
  techItem: {
    alignItems: 'center',
  },
  techLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginBottom: 4,
  },
  techValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
  },
  footerText: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 12,
    color: colors.technical,
  },
});

export default SplashScreen;