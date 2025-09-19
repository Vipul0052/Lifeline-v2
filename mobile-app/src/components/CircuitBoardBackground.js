import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Defs, Pattern, Rect, Circle, Line } from 'react-native-svg';
import { colors } from '../styles/colors';

const { width, height } = Dimensions.get('window');

const CircuitBoardBackground = () => {
  return (
    <View style={styles.container}>
      <Svg width={width} height={height} style={styles.svg}>
        <Defs>
          <Pattern
            id="circuit"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <Rect
              width="40"
              height="40"
              fill="none"
              stroke={colors.technical}
              strokeWidth="0.5"
              opacity="0.3"
            />
            <Circle
              cx="10"
              cy="10"
              r="2"
              fill={colors.technical}
              opacity="0.5"
            />
            <Circle
              cx="30"
              cy="30"
              r="2"
              fill={colors.technical}
              opacity="0.5"
            />
            <Line
              x1="10"
              y1="10"
              x2="30"
              y2="30"
              stroke={colors.technical}
              strokeWidth="0.5"
              opacity="0.3"
            />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#circuit)" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.1,
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

export default CircuitBoardBackground;