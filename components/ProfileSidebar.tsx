import { close, darkLogoIcon, lightLogoIcon } from '@/assets/Icons/dashboard/Icons';
import { Text, View } from '@/components/Themed';
import { useApolloClient } from '@apollo/client';
import { usePathname, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, useColorScheme } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useToast } from 'react-native-toast-notifications';

interface SidebarProps {
  onClose: () => void;
}

const ProfileSidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const theme = useColorScheme();
  const [isHovered, setIsHovered] = useState(false);

  const [isVisible, setIsVisible] = useState(false);

  const handleNavigate = (route: any) => {
    setIsVisible(false);
    router.push(route);
    onClose();
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
        <TouchableOpacity
          className=" py-2"
          onPress={() => handleNavigate('/dashboard/trainee/profile')}
        >
          <Text
            className={`font-bold text-xl ml-4
                ${theme === 'light' ? 'text-[#333]' : 'text-[#f5f5f5]'}
                `}
          >
            {t('settings.profile')}
          </Text>
        </TouchableOpacity>
        <View className="my-2 border-b border-black-100 dark:border-white" />

        <TouchableOpacity
          className="py-2"
          onPress={() => handleNavigate('/dashboard/trainee/preference')}
        >
          <Text
            className={`font-bold text-xl ml-4
                ${theme === 'light' ? 'text-[#333]' : 'text-[#f5f5f5]'}
                `}
          >
            {t('settings.title')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="py-2"
          onPress={() => handleNavigate('/dashboard/trainee/LoginActivity')}
          onPressIn={() => setIsHovered(true)}
          onPressOut={() => setIsHovered(false)}
        >
          <Text
            className={`font-bold text-xl ml-4
                ${theme === 'light' ? 'text-[#333]' : 'text-[#f5f5f5]'}
                ${isHovered ? 'text-blue-500' : ''}
                `}
          >
            {t('loginActivity.title')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileSidebar;
