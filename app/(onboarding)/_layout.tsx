import { View } from '@/components/Themed';
import { Slot } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AppOnboardingLayout({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();

  const insets = useSafeAreaInsets();

  const bgColor = () => (colorScheme === 'dark' ? 'bg-[#020917]' : 'bg-[#E0E7FF]');

  return (
    <View
      className={`flex-1 ${bgColor()}`}
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <Slot />
    </View>
  );
}
