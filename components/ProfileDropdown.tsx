import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet, useColorScheme } from 'react-native';
import Popover from 'react-native-popover-view';
import { useRouter } from 'expo-router';
import { ProfileType } from '@/app/dashboard/_layout';
import { useQuery } from '@apollo/client';
import { GET_PROFILE } from '@/graphql/queries/user';
import ProfileAvatar from './ProfileAvatar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
const ProfileDropdown = () => {
  const theme = useColorScheme();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  const {t} = useTranslation ();

  const togglePopover = () => {
    setIsVisible(!isVisible);
  };

  const handleNavigate = (route: any) => {
    setIsVisible(false);
    router.push(route);
  };

  const { data: profileData } = useQuery(GET_PROFILE, {
    context: {
      headers: { Authorization: `Bearer ${authToken}` },
    },
    skip: !authToken,
  });

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

  useEffect(() => {
    (async function () {
      if (profileData != undefined) {
        setProfile(profileData.getProfile);
        await AsyncStorage.setItem('userProfile', JSON.stringify(profileData.getProfile));
      }
    })();
  }, [profileData]);
  return (
    <View className="flex flex-row items-center">
      <Popover
        isVisible={isVisible}
        onRequestClose={togglePopover}
        from={
          <TouchableOpacity onPress={togglePopover}>
            <ProfileAvatar name={profile?.name} src={profile?.avatar} size="xs" />
          </TouchableOpacity>
        }
      >
        <View
          className={`py-2 px-8 border border-gray-300 shadow-lg shadow-black/30 w-48
    ${theme === 'light' ? 'bg-[#f9f9f9] text-[#333] border-[#ccc]' : 'bg-[#2b2b2b] text-[#f5f5f5] border-[#444]'}
  `}
        >
          <TouchableOpacity
            className="border-b border-gray-300 py-2"
            onPress={() => handleNavigate('/dashboard/trainee/profile')}
          >
            <Text
              className={`
                ${theme === 'light' ? 'text-[#333]' : 'text-[#f5f5f5]'}
                `}
            >
              {t('settings.profile')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="py-2"
            onPress={() => handleNavigate('/dashboard/trainee/preference')}
          >
            <Text
              className={`
                ${theme === 'light' ? 'text-[#333]' : 'text-[#f5f5f5]'}
                `}
            >
              {t('settings.title')}
            </Text>
          </TouchableOpacity>
        </View>
      </Popover>
    </View>
  );
};

export default ProfileDropdown;
