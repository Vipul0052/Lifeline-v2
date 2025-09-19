import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/colors';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const pulseAnim = new Animated.Value(1);

  const initSteps = [
    { name: 'Device Connection', status: 'complete' },
    { name: 'Sensor Calibration', status: 'complete' },
    { name: 'LoRa Network', status: 'active' },
    { name: 'GPS Module', status: 'pending' },
    { name: 'System Ready', status: 'pending' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    const stepTimer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= initSteps.length - 1) {
          clearInterval(stepTimer);
          return prev;
        }
        return prev + 1;
      });
    }, 600);

    // Pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => {
      clearInterval(timer);
      clearInterval(stepTimer);
      pulseAnimation.stop();
    };
  }, []);

  const ProgressBar = ({ progress }: { progress: number }) => (
    <View style={styles.progressContainer}>
      <View style={[styles.progressFill, { width: `${progress}%` }]} />
    </View>
  );

  const StepIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'complete':
        return <Ionicons name="checkmark-circle" size={16} color={colors.success} />;
      case 'active':
        return <Ionicons name="ellipse" size={16} color={colors.primary} />;
      default:
        return <Ionicons name="ellipse-outline" size={16} color={colors.mutedForeground} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Circuit Board Background Pattern */}
      <View style={styles.backgroundPattern}>
        {/* Simple grid pattern using View components */}
        {Array.from({ length: 20 }, (_, i) => (
          <View key={i} style={[styles.gridLine, { 
            left: (i % 5) * 80, 
            top: Math.floor(i / 5) * 80 
          }]} />
        ))}
      </View>

      {/* Main Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.logoWrapper}>
          <Animated.View style={[styles.logoInner, { transform: [{ scale: pulseAnim }] }]}>
            <View style={styles.logoCenter} />
          </Animated.View>
        </View>
        
        <Text style={styles.title}>LIFELINE</Text>
        <Text style={styles.subtitle}>Intelligent Safety Beyond Networks</Text>
        
        <View style={styles.versionBadge}>
          <Text style={styles.versionText}>v2.1.0 - IoT Emergency Response</Text>
        </View>
      </View>

      {/* Loading Progress */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>System Initialization</Text>
          <Text style={styles.progressPercent}>{progress}%</Text>
        </View>
        <ProgressBar progress={progress} />

        {/* Initialization Steps */}
        <View style={styles.stepsContainer}>
          {initSteps.map((step, index) => {
            let status = 'pending';
            if (index < currentStep) status = 'complete';
            else if (index === currentStep) status = 'active';
            
            return (
              <View key={step.name} style={styles.stepRow}>
                <StepIcon status={status} />
                <Text style={[
                  styles.stepText,
                  status === 'complete' && styles.stepTextComplete,
                  status === 'active' && styles.stepTextActive,
                ]}>
                  {step.name}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Technical Status */}
        <View style={styles.techStatus}>
          <View style={styles.techItem}>
            <Text style={styles.techLabel}>Network</Text>
            <Text style={styles.techValue}>LoRa Mesh</Text>
          </View>
          <View style={styles.techItem}>
            <Text style={styles.techLabel}>Sensors</Text>
            <Text style={styles.techValue}>MPU6050</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Emergency Response System</Text>
        <Text style={styles.footerCopyright}>© 2025 Lifeline IoT Technologies</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundPattern: {
    position: 'absolute',
    width: width,
    height: height,
    opacity: 0.1,
  },
  gridLine: {
    position: 'absolute',
    width: 60,
    height: 1,
    backgroundColor: colors.technical,
    opacity: 0.3,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
    zIndex: 10,
  },
  logoWrapper: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoInner: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: colors.technical,
    borderRadius: 24,
    backgroundColor: colors.technical + '33',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCenter: {
    width: 24,
    height: 24,
    backgroundColor: colors.primary,
    borderRadius: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.foreground,
    letterSpacing: 2,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.mutedForeground,
    marginBottom: 32,
  },
  versionBadge: {
    borderWidth: 1,
    borderColor: colors.technical,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  versionText: {
    color: colors.technical,
    fontSize: 12,
    fontWeight: '500',
  },
  progressSection: {
    width: width * 0.8,
    zIndex: 10,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: colors.foreground,
  },
  progressPercent: {
    fontSize: 14,
    color: colors.foreground,
  },
  progressContainer: {
    height: 8,
    backgroundColor: colors.muted,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 24,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  stepsContainer: {
    marginBottom: 24,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepText: {
    fontSize: 14,
    color: colors.mutedForeground,
    marginLeft: 12,
  },
  stepTextComplete: {
    color: colors.success,
  },
  stepTextActive: {
    color: colors.primary,
  },
  techStatus: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
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
    color: colors.technical,
  },
  footer: {
    position: 'absolute',
    bottom: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: colors.mutedForeground,
    marginBottom: 4,
  },
  footerCopyright: {
    fontSize: 12,
    color: colors.technical,
  },
});

export default SplashScreen;