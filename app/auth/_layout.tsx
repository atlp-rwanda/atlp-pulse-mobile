import { logo } from '@/assets/Icons/auth/Icons';
import LanguagePicker from '@/components/LanguagePicker';
import { Slot } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, View, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';

export default function AuthLayout() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const bgColor = colorScheme === 'dark' ? 'bg-primary-dark' : 'bg-secondary-light';

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
        <View className={`flex-1 bg-secondary-light-500 dark:bg-primary-dark h-full ${bgColor}`}>
          {/* Header Section */}
          <View className="w-full h-[87px] bg-primary-light dark:bg-primary-dark flex flex-row items-center justify-between px-12">
            {/* Logo */}
            <View className="flex-row items-center">
              <SvgXml xml={logo} />
            </View>

            {/* Language Picker */}
            <View className="flex-row items-center space-x-2">
              <LanguagePicker
                // @ts-ignore
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                  backgroundColor: colorScheme === 'dark' ? '#333' : '#fff',
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: colorScheme === 'dark' ? '#444' : '#ccc',
                }}
              />
            </View>
          </View>

          {/* Slot for Auth Content */}
          <Slot />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
