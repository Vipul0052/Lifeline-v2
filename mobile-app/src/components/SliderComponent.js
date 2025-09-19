import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { colors } from '../styles/colors';
import { commonStyles } from '../styles/commonStyles';

const SliderComponent = ({ 
  title, 
  value, 
  minimumValue, 
  maximumValue, 
  step, 
  onValueChange, 
  lowLabel, 
  highLabel 
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={commonStyles.label}>{title}</Text>
        <Text style={styles.valueText}>{Math.round(value)}/{maximumValue}</Text>
      </View>
      
      <Slider
        style={styles.slider}
        value={value}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        onValueChange={onValueChange}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor={colors.muted}
        thumbStyle={styles.thumb}
        trackStyle={styles.track}
      />
      
      {(lowLabel && highLabel) && (
        <View style={styles.labelContainer}>
          <Text style={styles.extremeLabel}>{lowLabel}</Text>
          <Text style={styles.extremeLabel}>{highLabel}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  valueText: {
    fontSize: 14,
    color: colors.mutedForeground,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  thumb: {
    backgroundColor: colors.primary,
    width: 20,
    height: 20,
  },
  track: {
    height: 4,
    borderRadius: 2,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -8,
  },
  extremeLabel: {
    fontSize: 12,
    color: colors.mutedForeground,
  },
});

export default SliderComponent;