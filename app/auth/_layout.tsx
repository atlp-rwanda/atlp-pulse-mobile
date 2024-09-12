import { logo } from '@/assets/Icons/auth/Icons';
import { Slot } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';

export default function AuthLayout() {
  const insets = useSafeAreaInsets();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const colorScheme = useColorScheme();
  const bgColor = colorScheme === 'dark' ? 'bg-primary-dark' : 'bg-secondary-light';

  useEffect(() => {}, [isDarkMode]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      className="bg-primary-light dark:bg-primary-dark"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        style={{
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        }}
      >
        <View className={`flex-1 bg-secondary-light-500 dark:bg-primary-dark h-full  ${bgColor}`}>
          <View className="w-full h-[87px] relative bg-primary-light dark:bg-primary-dark flex items-center justify-center px-12">
            <View className="flex-row items-center">
              <SvgXml xml={logo} />
            </View>
          </View>
          <Slot />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
