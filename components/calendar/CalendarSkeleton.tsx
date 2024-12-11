import React from 'react';
import { View, useColorScheme } from 'react-native';

const CalendarSkeleton = () => {
  const colorScheme = useColorScheme();
  const skeletonBackground = colorScheme === 'light' ? '#E0E0E0' : '#2B2B2B';

  return (
    <View style={{ padding: 16 }}>
      <View
        style={{
          height: 30,
          width: 150,
          backgroundColor: skeletonBackground,
          borderRadius: 8,
          marginBottom: 16,
        }}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8 }}>
        {Array(7)
          .fill(null)
          .map((_, index) => (
            <View
              key={index}
              style={{
                height: 20,
                width: 30,
                backgroundColor: skeletonBackground,
                borderRadius: 4,
              }}
            />
          ))}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>
        {Array(30)
          .fill(null)
          .map((_, index) => (
            <View
              key={index}
              style={{
                height: 40,
                width: 40,
                margin: 4,
                backgroundColor: skeletonBackground,
                borderRadius: 8,
              }}
            />
          ))}
      </View>
    </View>
  );
};

export default CalendarSkeleton;
