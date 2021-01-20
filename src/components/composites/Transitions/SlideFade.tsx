import React from 'react';
import Box from '../../primitives/Box';
import { useThemeProps } from '../../../hooks/useThemeProps';
import { Animated, Platform } from 'react-native';
import type { ISlideFadeProps } from './props';
import { canUseDom } from '../../../utils';

const SlideFade = ({ children, ...props }: ISlideFadeProps) => {
  const isDomUsable = canUseDom();

  const { in: animationState, duration, offsetX, offsetY } = useThemeProps(
    'SlideFade',
    props
  );
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnimX = React.useRef(new Animated.Value(0)).current;
  const slideAnimY = React.useRef(new Animated.Value(0)).current;

  const animIn = () => {
    if (isDomUsable) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: duration,
        useNativeDriver: Platform.OS !== 'web',
      }).start();
      Animated.timing(slideAnimX, {
        toValue: 0,
        duration: duration,
        useNativeDriver: Platform.OS !== 'web',
      }).start();
      Animated.timing(slideAnimY, {
        toValue: 0,
        duration: duration,
        useNativeDriver: Platform.OS !== 'web',
      }).start();
    }
  };
  const animOut = () => {
    if (isDomUsable) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: duration,
        useNativeDriver: Platform.OS !== 'web',
      }).start();
      offsetX &&
        Animated.timing(slideAnimX, {
          toValue: offsetX,
          duration: duration,
          useNativeDriver: Platform.OS !== 'web',
        }).start();
      offsetY &&
        Animated.timing(slideAnimY, {
          toValue: offsetY,
          duration: duration,
          useNativeDriver: Platform.OS !== 'web',
        }).start();
    }
  };
  animationState ? animIn() : animOut();

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
          transform: [{ translateX: slideAnimX, translateY: slideAnimY }],
        },
      ]}
    >
      <Box {...props}>{children}</Box>
    </Animated.View>
  );
};

export default React.memo(SlideFade);
