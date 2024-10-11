import { lightLogoIcon, darkLogoIcon, menu, lightNotifyIcon, darkNotifyIcon } from '@/assets/Icons/dashboard/Icons';
import { router, Slot } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
  useColorScheme,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import Sidebar from '@/components/sidebar';

export default function AuthLayout() {
  const insets = useSafeAreaInsets();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const colorScheme = useColorScheme();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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
        <View className={`bg-primary-light dark:bg-primary-dark h-full`}>
          <View className="w-full h-[60px] relative bg-primary-light dark:bg-primary-dark flex justify-center px-3 ">
            <View className="flex-row justify-between">
              <View className="flex-row">
                <TouchableOpacity onPress={toggleSidebar}>
                  <SvgXml xml={menu} width={40} height={40} />
                </TouchableOpacity>
                <SvgXml
                  xml={colorScheme === 'dark' ? darkLogoIcon : lightLogoIcon}
                  width={100}
                  height={40}
                />
              </View>
              <View className="flex-row gap-5">
                <TouchableOpacity onPress={() => router.push('/')}>
                <SvgXml 
                    xml={colorScheme === 'dark' ? darkNotifyIcon : lightNotifyIcon} 
                    width={25} 
                    height={40}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/dashboard/profile/orgInfo')}>
                  <Image
                    source={require('@/assets/images/profilePic.png')}
                    style={{ width: 40, height: 40 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Slot />
        </View>
      </ScrollView>
      {isSidebarOpen && (
        <View className="absolute top-0 left-0 bottom-0">
          <Sidebar onClose={toggleSidebar} />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
