import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Path, Text, LinearGradient, Stop, Defs } from 'react-native-svg';

interface LogoProps {
  size?: number;
  color?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 100, color = '#1E88E5' }) => {
  const scale = size / 200; // Logo original este 200x200

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 200 200">
        <Defs>
          <LinearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#1E88E5" stopOpacity="1" />
            <Stop offset="100%" stopColor="#0D47A1" stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Circle cx="100" cy="100" r="90" fill="url(#grad1)" />
        <Path d="M100 40 L140 120 L60 120 Z" fill="white" />
        <Circle cx="100" cy="85" r="12" fill="#FFA000" />
        <Path d="M80 140 L120 140 L120 160 L80 160 Z" fill="white" />
        <Text
          x="100"
          y="155"
          fontSize="18"
          fontWeight="bold"
          textAnchor="middle"
          fill="#1E88E5"
        >
          SSM
        </Text>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Logo; 