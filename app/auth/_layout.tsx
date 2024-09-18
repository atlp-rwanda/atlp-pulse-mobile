import { logo } from '@/assets/Icons/auth/Icons';
import { back_arrow_dark, back_arrow_light } from '@/components/icons/icons';
import { router, Slot } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';

export default function AuthLayout() {
  const insets = useSafeAreaInsets();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [colorScheme, setColorScheme] = useState(useColorScheme());
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
          <View className="w-full h-[87px] bg-primary-light dark:bg-primary-dark items-center  justify-between  px-5 flex-row">
            <View className="flex-row items-center gap-20 justify-between ">
              <TouchableOpacity onPress={() => router.back()}>
                {colorScheme == 'dark' ? (
                  <SvgXml xml={back_arrow_light} />
                ) : (
                  <SvgXml xml={back_arrow_dark} />
                )}
              </TouchableOpacity>
              <View className="flex-row items-center flex-[70&] ">
                <SvgXml xml={logo} />
              </View>
            </View>
          </View>
          <View className="flex justify-center items-center">
            <Slot />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
