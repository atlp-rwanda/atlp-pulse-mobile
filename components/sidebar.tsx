import React, { useEffect, useState } from 'react';
import { Text, View } from '@/components/Themed';
import { TouchableOpacity, useColorScheme } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { usePathname, useRouter } from 'expo-router';
import {
  lightAttendance,
  close,
  lightPerformance,
  lightCalender,
  lightDocument,
  lightLogoIcon,
  lightDashboard,
  lightHelp,
  lightLogout,
} from '@/assets/Icons/dashboard/Icons';
import {
  darkLogoIcon,
  darkDashboard,
  darkAttendance,
  darkPerformance,
  darkCalender,
  darkDocument,
  darkHelp,
  darkLogout,
} from '@/assets/Icons/dashboard/Icons';

interface SidebarProps {
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const colorScheme = useColorScheme();

  const UpperItems = [
    { name: 'Dashboard', iconLight: lightDashboard, iconDark: darkDashboard, path: '/dashboard' },
    {
      name: 'Attendance',
      iconLight: lightAttendance,
      iconDark: darkAttendance,
      path: '/dashboard/trainee',
    },
    {
      name: 'Performance',
      iconLight: lightPerformance,
      iconDark: darkPerformance,
      path: '/dashboard/trainee',
    },
    {
      name: 'Calendar',
      iconLight: lightCalender,
      iconDark: darkCalender,
      path: '/dashboard/trainee',
    },
  ];

  const LowerItems = [
    { name: 'Docs', iconLight: lightDocument, iconDark: darkDocument, path: '/dashboard/trainee' },
    { name: 'Help', iconLight: lightHelp, iconDark: darkHelp, path: '/dashboard/trainee' },
    { name: 'LogOut', iconLight: lightLogout, iconDark: darkLogout, path: '/dashboard/trainee' },
  ];

  useEffect(() => {
    const activeRouteItem = UpperItems.concat(LowerItems).find((item) => item.path === pathname);
    if (activeRouteItem) {
      setActiveItem(activeRouteItem.name);
    }
  }, [pathname]);

  const handleItemPress = async (item: { name: string; path: string }) => {
    setActiveItem(item.name);
    try {
      router.push(item.path as any);
      onClose();
    } catch (error) {
      console.error('Failed to navigate:', error);
    }
  };

  return (
    <View className=" w-96 h-full bg-primary-light dark:bg-primary-dark shadow-lg flex-1 pt-10">
      <View className="flex-row justify-between items-center p-4">
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
        <View className="border-b border-black-100 dark:border-white my-2" />
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
