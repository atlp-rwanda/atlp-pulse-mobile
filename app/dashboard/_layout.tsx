import {
  darkLogoIcon,
  darkNotifyIcon,
  lightLogoIcon,
  lightNotifyIcon,
  menu,
} from '@/assets/Icons/dashboard/Icons';
import Sidebar from '@/components/sidebar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Slot, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
  useColorScheme
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';

export type ProfileType = {
  firstName: string;
  lastName: string;
  name: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  avatar?: string;
  cover?: string;
  biography?: string;
  githubUsername?: string;
  resume?: string;
  user: {
    organizations: string[];
    email: string;
    role: string;
    team: {
      name: string;
      cohort: {
        name: string;
        startDate: string;
        phase: {
          name: string;
        };
        program: {
          name: string;
        };
      };
    };
  };
};

import ProfileDropdown from '@/components/ProfileDropdown';
export default function AuthLayout() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const colorScheme = useColorScheme();
  const [authToken, setAuthToken] = useState<string | null>(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);


  useEffect(() => {
    (async function () {
      const cachedToken = await AsyncStorage.getItem('authToken');
      if (cachedToken != authToken) {
        setAuthToken(cachedToken);
      }

      if (cachedToken === null) {
        router.push('/auth/login');
      }
    })();
  }, [authToken]);



  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      className="bg-primary-light dark:bg-primary-dark"
    >
      <View className={`bg-primary-light dark:bg-primary-dark h-full`}>
        <View className="w-full h-[60px] relative bg-primary-light dark:bg-primary-dark flex justify-center px-3 ">
          <View className="flex-row justify-between">
            <View className="flex-row items-center">
              <TouchableOpacity onPress={toggleSidebar}>
                <SvgXml xml={menu} width={40} height={40} />
              </TouchableOpacity>
              <SvgXml
                xml={colorScheme === 'dark' ? darkLogoIcon : lightLogoIcon}
                width={110}
                height={40}
              />
            </View>
            <View className="flex-row gap-5">
              <TouchableOpacity onPress={() => router.push('/dashboard')}>
                <SvgXml
                  xml={colorScheme === 'dark' ? darkNotifyIcon : lightNotifyIcon}
                  width={25}
                  height={40}
                />
              </TouchableOpacity>
              <ProfileDropdown />
            </View>
          </View>
        </View>
        <ScrollView
          contentContainerClassName="px-5 py-3"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Slot />
        </ScrollView>
      </View>
      {isSidebarOpen && (
        <View className="absolute top-0 left-0 bottom-0">
          <Sidebar onClose={toggleSidebar} />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
