import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { useTranslation } from 'react-i18next';

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
        <Text className={`${textColor} text-xl`}>{t('about.basicInformation')}</Text>
        <View className="flex-row gap-5 m-2">
          <Ionicons name="person" size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
          <Text className={`${textColor} text-lg`}>
            {profile.name ? profile.name : t('about.name')}
          </Text>
        </View>
        <View className="flex-row gap-5 m-2">
          <Ionicons name="mail" size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
          <Text className={`${textColor} text-lg`}>
            {profile.user?.email ? profile.user?.email : t('about.email')}
          </Text>
        </View>
        <View className="flex-row gap-5 m-2">
          <Ionicons name="call" size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
          <Text className={`${textColor} text-lg`}>
            {profile.phoneNumber ? profile.phoneNumber : t('about.phoneNumber')}
          </Text>
        </View>
        <View className="flex-row gap-5 m-2">
          <Ionicons name="home" size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
          <Text className={`${textColor} text-lg`}>
            {profile.address ? profile.address : t('about.address')}
          </Text>
        </View>
        <View className="flex-row gap-5 m-2">
          <Ionicons
            name="logo-github"
            size={20}
            color={colorScheme === 'dark' ? 'white' : 'black'}
          />
          <Text className={`${textColor} text-lg`}>
            {profile.githubUsername ? profile.githubUsername : t('about.githubUsername')}
          </Text>
        </View>
        <Text className={`${textColor} text-xl`}>{t('about.resume')}</Text>
        <Text className={`${textColor} text-md m-2`}>
          {profile.resume ? profile.resume : t('about.noResume')}
        </Text>
      </View>
      <View className={`${bgColor} w-[100%] p-6 rounded-md mt-5 mb-20`}>
        <Text className={`${textColor} text-xl`}>{t('about.biography')}</Text>
        <Text className={`${textColor} text-md m-2`}>
          {profile.biography ? profile.biography : t('about.noBiography')}
        </Text>
      </View>
    </>
  );
};

export default AboutTrainee;
