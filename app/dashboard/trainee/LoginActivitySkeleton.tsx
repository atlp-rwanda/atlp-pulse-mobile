import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const SkeletonLoader = () => {
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shimmerAnimation]);

  const shimmerStyle = {
    opacity: shimmerAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
    }),
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Animated.View style={[styles.skeletonBox, shimmerStyle]} />
        <Animated.View style={[styles.skeletonBox, shimmerStyle]} />
        <Animated.View style={[styles.skeletonBox, shimmerStyle]} />
      </View>
      <Animated.View style={[styles.skeletonLine, shimmerStyle]} />
      <Animated.View style={[styles.skeletonLine, shimmerStyle]} />
      <Animated.View style={[styles.skeletonLine, shimmerStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  skeletonBox: {
    width: 100,
    height: 50,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  skeletonLine: {
    height: 55,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginVertical: 4,
    width: '100%',
  },
});

export default SkeletonLoader;
