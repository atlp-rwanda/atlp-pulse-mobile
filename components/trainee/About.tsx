import { ProfileType } from '@/app/dashboard/_layout';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, Text, useColorScheme, View } from 'react-native';

interface AboutTraineeProps {
  profile?: ProfileType;
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
            {profile?.name || t('organization.unavailable')}
          </Text>
        </View>
        <View className="flex-row gap-3 m-2">
          <Ionicons name="mail" size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
          <Text className={`${textColor} text-lg`}>
            {profile?.user?.email || t('organization.unavailable')}
          </Text>
        </View>
        <View className="flex-row gap-3 m-2">
          <Ionicons name="call" size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
          <Text className={`${textColor} text-lg`}>
            {profile?.phoneNumber || t('organization.unavailable')}
          </Text>
        </View>
        <View className="flex-row gap-3 m-2">
          <Ionicons name="home" size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
          <Text className={`${textColor} text-lg`}>
            {profile?.address || t('organization.unavailable')}
          </Text>
        </View>
        <View className="flex-row gap-3 m-2">
          <Ionicons
            name="logo-github"
            size={20}
            color={colorScheme === 'dark' ? 'white' : 'black'}
          />
          <Text className={`${textColor} text-lg`}>
            {profile?.githubUsername || t('organization.unavailable')}
          </Text>
        </View>
        <Text className={`${textColor} text-xl font-Inter-SemiBold mt-6 mb-2 uppercase`}>
          {t('about.resume')}
        </Text>
        <View className="flex-row m-2 items-center">
          <Ionicons
            name="book-outline"
            size={20}
            color={colorScheme === 'dark' ? 'white' : 'black'}
          />
          <Text className={`${textColor} text-md m-2`}>
            {profile?.resume ? (
              <Text
                style={{ color: `${textColor}` }}
                onPress={() => Linking.openURL(profile?.resume!)}
              >
                {t('about.viewResume')}
              </Text>
            ) : (
              'No Resume uploaded yet'
            )}
          </Text>
        </View>
      </View>
      <View className={`${bgColor} w-[100%] p-6 rounded-md mt-5 mb-20`}>
        <Text className={`${textColor} text-xl font-Inter-SemiBold mb-2`}>
          {t('about.biography')}
        </Text>
        <Text className={`${textColor} text-lg m-2`}>
          {profile?.biography || t('about.noBiography')}
        </Text>
      </View>
    </>
  );
};

export default AboutTrainee;
