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
import { useContext, useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
  useColorScheme,
  Text,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import UserProvider from '@/hooks/useAuth';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NotificationProvider, NotificationContext } from '@/hooks/useNotification';
import ProfileAvatar from '@/components/ProfileAvatar';
import { GET_PROFILE } from '@/graphql/queries/user';
import { useQuery } from '@apollo/client';
import ProfileSidebar from '@/components/ProfileSidebar';

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

export default function DashboardLayout() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState<boolean>(false);
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const colorScheme = useColorScheme();
  const [authToken, setAuthToken] = useState<string | null>(null);

  const { data: profileData } = useQuery(GET_PROFILE, {
    context: { headers: { Authorization: `Bearer ${authToken}` } },
    skip: !authToken,
  });
  useEffect(() => {
    (async () => {
      const cachedToken = await AsyncStorage.getItem('authToken');
      setAuthToken(cachedToken);

      if (!cachedToken) {
        router.push('/auth/login');
      }
    })();
  }, []);

  if (!authToken) {
    return null; 
  }

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const toggleProfileSidebar = () => setIsProfileSidebarOpen((prev) => !prev);
  return (
    <NotificationProvider>
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
        <GestureHandlerRootView style={{ flex: 1 }}>
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
                <View className="flex flex-row items-center gap-3">
                  <UserProvider>
                    <NotificationContent />
                  </UserProvider>
                  <TouchableOpacity onPress={toggleProfileSidebar}>
                    <ProfileAvatar name={profile?.name} src={profile?.avatar} size="sm" />
                  </TouchableOpacity>
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
          {isProfileSidebarOpen && (
            <View className="absolute top-0 left-0 bottom-0">
              <ProfileSidebar onClose={toggleProfileSidebar} />
            </View>
          )}
        </GestureHandlerRootView>
      </KeyboardAvoidingView>
    </NotificationProvider>
  );
}

function NotificationContent() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { unreadCount } = useContext(NotificationContext);

  return (
    <View className="flex-row gap-5">
      <TouchableOpacity onPress={() => router.push('/dashboard/trainee/notifications' as any)}>
        <SvgXml
          xml={colorScheme === 'dark' ? darkNotifyIcon : lightNotifyIcon}
          width={25}
          height={40}
        />
      </TouchableOpacity>
      <View className="flex-row items-center">
        {unreadCount > 0 && (
          <View className="absolute top-0 right-[10] bg-red-500 rounded-full w-5 h-5 flex items-center justify-center">
            <Text className="text-white text-xs">{unreadCount}</Text>
          </View>
        )}
      </View>
    </View>
  );
}
