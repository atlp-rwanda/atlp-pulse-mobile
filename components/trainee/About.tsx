import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, useColorScheme, View } from 'react-native';

interface Profile {
  name?: string;
  user?: {
    email?: string;
  };
  phoneNumber?: string;
  address?: string;
  githubUsername?: string;
  resume?: string;
  biography?: string;
}

interface AboutTraineeProps {
  profile: Profile;
  bgColor: string;
  textColor: string;
}

const AboutTrainee: React.FC<AboutTraineeProps> = ({ profile, bgColor, textColor }) => {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  return (
    <>
      <View className={`${bgColor} w-[100%] p-6 rounded-md`}>
        <Text className={`${textColor} text-xl font-Inter-SemiBold mb-3`}>
          {t('about.basicInformation')}
        </Text>
        <View className="flex-row gap-3 m-2">
          <Ionicons name="person" size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
          <Text className={`${textColor} text-lg`}>
            {profile.name ? profile.name : t('organization.unavailable')}
          </Text>
        </View>
        <View className="flex-row gap-3 m-2">
          <Ionicons name="mail" size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
          <Text className={`${textColor} text-lg`}>
            {profile.user?.email ? profile.user?.email : t('organization.unavailable')}
          </Text>
        </View>
        <View className="flex-row gap-3 m-2">
          <Ionicons name="call" size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
          <Text className={`${textColor} text-lg`}>
            {profile.phoneNumber ? profile.phoneNumber : t('organization.unavailable')}
          </Text>
        </View>
        <View className="flex-row gap-3 m-2">
          <Ionicons name="home" size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
          <Text className={`${textColor} text-lg`}>
            {profile.address ? profile.address : t('organization.unavailable')}
          </Text>
        </View>
        <View className="flex-row gap-3 m-2">
          <Ionicons
            name="logo-github"
            size={20}
            color={colorScheme === 'dark' ? 'white' : 'black'}
          />
          <Text className={`${textColor} text-lg`}>
            {profile.githubUsername ? profile.githubUsername : t('organization.unavailable')}
          </Text>
        </View>
        <Text className={`${textColor} text-xl font-Inter-SemiBold mb-2 mt-6 uppercase`}>
          {t('about.resume')}
        </Text>
        <Text className={`${textColor} text-lg m-2`}>
          {profile.resume ? profile.resume : t('about.noResume')}
        </Text>
      </View>
      <View className={`${bgColor} w-[100%] p-6 rounded-md mt-5 mb-20`}>
        <Text className={`${textColor} text-xl font-Inter-SemiBold mb-2`}>
          {t('about.biography')}
        </Text>
        <Text className={`${textColor} text-lg m-2`}>
          {profile.biography ? profile.biography : t('about.noBiography')}
        </Text>
      </View>
    </>
  );
};

export default AboutTrainee;
