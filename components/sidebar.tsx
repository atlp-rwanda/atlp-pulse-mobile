import {
  close,
  darkAttendance,
  darkCalender,
  darkDashboard,
  darkDocument,
  darkHelp,
  darkLogoIcon,
  darkLogout,
  darkPerformance,
  darkTickets,
  lightAttendance,
  lightCalender,
  lightDashboard,
  lightDocument,
  lightHelp,
  lightLogoIcon,
  lightLogout,
  lightPerformance,
  lightTickets,
} from '@/assets/Icons/dashboard/Icons';
import { Text, View } from '@/components/Themed';
import { useApolloClient } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePathname, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, useColorScheme } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useToast } from 'react-native-toast-notifications';

interface SidebarProps {
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const toast = useToast();
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const client = useApolloClient();

  const UpperItems = [
    {
      name: t('navbar.dashboard'),
      iconLight: lightDashboard,
      iconDark: darkDashboard,
      path: '/dashboard',
    },
    {
      name: t('navbar.tickets'),
      iconLight: lightTickets,
      iconDark: darkTickets,
      path: '/dashboard/trainee/tickets',
    },
    {
      name: t('navbar.attendance'),
      iconLight: lightAttendance,
      iconDark: darkAttendance,
      path: '/dashboard/trainee/Attendance',
    },
    {
      name: t('navbar.performance'),
      iconLight: lightPerformance,
      iconDark: darkPerformance,
      path: '/dashboard/perfomance',
    },
    {
      name: t('navbar.calendar'),
      iconLight: lightCalender,
      iconDark: darkCalender,
      path: '/dashboard/calendar',
    },
  ];

  const LowerItems = [
    {
      name: t('navbar.docs'),
      iconLight: lightDocument,
      iconDark: darkDocument,
      path: '/dashboard/trainee/documentation',
    },
    {
      name: t('navbar.help'),
      iconLight: lightHelp,
      iconDark: darkHelp,
      path: '/dashboard/trainee',
    },
    {
      name: t('navbar.signOut'),
      iconLight: lightLogout,
      iconDark: darkLogout,
      path: '/auth/login',
    },
  ];

  useEffect(() => {
    const activeRouteItem = UpperItems.concat(LowerItems).find((item) => item.path === pathname);
    if (activeRouteItem) {
      setActiveItem(activeRouteItem.name);
    }
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('orgToken');
      await AsyncStorage.removeItem('orgName');
      await AsyncStorage.removeItem('userProfile');
      await AsyncStorage.removeItem('auth');
      router.push('/auth/login?logout=1');
    } catch (error) {
      toast.show(t('toasts.dashboard.logoutErr'), {
        type: 'danger',
        placement: 'top',
        duration: 4000,
        animationType: 'slide-in',
      });
    }
  };

  const handleItemPress = async (item: { name: string; path: string }) => {
    setActiveItem(item.name);
    try {
      if (item.name === t('navbar.signOut')) {
        await handleLogout();
        router.push(item.path as any);
      } else {
        router.push(item.path as any);
        onClose();
      }
    } catch (error) {
      toast.show(t('toasts.dashboard.navigationErr'), {
        type: 'danger',
        placement: 'top',
        duration: 4000,
        animationType: 'slide-in',
      });
    }
  };

  return (
    <View className="flex-1 h-full pt-10 shadow-lg w-screen bg-primary-light dark:bg-primary-dark">
      <View className="flex-row items-center justify-between p-4">
        <SvgXml
          xml={colorScheme === 'dark' ? darkLogoIcon : lightLogoIcon}
          width={100}
          height={40}
        />
        <TouchableOpacity onPress={onClose}>
          <SvgXml xml={close} width={24} height={24} />
        </TouchableOpacity>
      </View>
      <View className="flex-1">
        <View>
          {UpperItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleItemPress(item)}
              className={`flex-row items-center p-4 ${
                activeItem === item.name ? 'bg-indigo-300' : ''
              }`}
            >
              <SvgXml
                xml={colorScheme === 'light' ? item.iconLight : item.iconDark}
                width={26}
                height={26}
              />
              <Text
                className={`ml-4 text-base ${colorScheme === 'light' ? 'text-black' : 'text-white'}`}
                style={{ fontSize: 18 }}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View className="my-2 border-b border-black-100 dark:border-white" />
        <View>
          {LowerItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleItemPress(item)}
              className={`flex-row items-center p-4 ${
                activeItem === item.name ? 'bg-indigo-300' : ''
              }`}
            >
              <SvgXml
                xml={colorScheme === 'light' ? item.iconLight : item.iconDark}
                width={26}
                height={26}
              />
              <Text
                className={`ml-4 text-base ${colorScheme === 'light' ? 'text-black' : 'text-white'}`}
                style={{ fontSize: 18 }}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export default Sidebar;
