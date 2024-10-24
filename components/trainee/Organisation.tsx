import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { pulse } from '../icons/icons';

interface Profile {
  user?: {
    organizations?: string[];
    role?: string;
    team?: {
      cohort?: {
        program?: {
          name?: string;
        };
        name?: string;
        phase?: {
          name?: string;
        };
      };
      name?: string;
    };
  };
}

interface TraineeOrgProps {
  profile: Profile;
  bgColor: string;
  textColor: string;
}

const TraineeOrg: React.FC<TraineeOrgProps> = ({ profile, bgColor, textColor }) => {
  const { t } = useTranslation(); // Use the translation hook

  return (
    <>
      <View className={`flex-row gap-5 bg-action-500 p-2 w-[100%] rounded-t-3xl`}>
        <View className="w-[50] h-[50] rounded-full bg-primary-light flex justify-center items-center">
          <SvgXml xml={pulse} />
        </View>
        <View>
          <Text className={`text-primary-light text-lg font-bold`}>Andela</Text>
          <Text className={`text-primary-light text-lg font-bold`}>Andela.pulse.orgm</Text>
        </View>
      </View>
      <View className={`${bgColor} w-[100%] p-4 rounded-md mt-3 text-bold`}>
        <Text className={`${textColor} text-xl font-Inter-SemiBold mb-2`}>
          {t('organization.organizationDetails')}
        </Text>
        <View className="flex-row gap-3 m-2">
          <Text
            className={`${textColor} text-lg font-Inter-Medium text-gray-400 dark:text-gray-300`}
          >
            {t('organization.organizationName')}
          </Text>
          <Text className={`${textColor} text-lg font-Inter-Regular`}>
            {profile.user?.organizations?.[0] || t('organization.unavailable')}
          </Text>
        </View>
        <View className="flex-row gap-3 m-2">
          <Text
            className={`${textColor} text-lg font-Inter-Medium text-gray-400 dark:text-gray-300`}
          >
            {t('organization.adminEmail')}
          </Text>
          <Text className={`${textColor} text-lg font-Inter-Regular`}>devpulse@proton.me</Text>
        </View>
        <View className="flex-row gap-3 m-2">
          <Text
            className={`${textColor} text-lg font-Inter-Medium text-gray-400 dark:text-gray-300`}
          >
            {t('organization.role')}
          </Text>
          <Text className={`${textColor} text-lg font-Inter-Regular capitalize`}>
            {profile.user?.role || t('organization.unavailable')}
          </Text>
        </View>
      </View>
      <View className={`${bgColor} w-[100%] p-4 rounded-md mt-3 text-bold mb-14`}>
        <Text className={`${textColor} text-xl font-Inter-SemiBold mb-2`}>
          {t('organization.management')}
        </Text>
        <View className="flex-row gap-3 m-2">
          <Text
            className={`${textColor} text-lg font-Inter-Medium text-gray-400 dark:text-gray-300`}
          >
            {t('organization.program')}
          </Text>
          <Text className={`${textColor} text-lg font-Inter-Regular`}>
            {profile.user?.team?.cohort?.program?.name || t('organization.unavailable')}
          </Text>
        </View>
        <View className="flex-row gap-3 m-2">
          <Text
            className={`${textColor} text-lg font-Inter-Medium text-gray-400 dark:text-gray-300`}
          >
            {t('organization.cohort')}
          </Text>
          <Text className={`${textColor} text-lg font-Inter-Regular`}>
            {profile.user?.team?.cohort?.name || t('organization.unavailable')}
          </Text>
        </View>
        <View className="flex-row gap-3 m-2">
          <Text
            className={`${textColor} text-lg font-Inter-Medium text-gray-400 dark:text-gray-300`}
          >
            {t('organization.team')}
          </Text>
          <Text className={`${textColor} text-lg font-Inter-Regular`}>
            {profile.user?.team?.name || t('organization.unavailable')}
          </Text>
        </View>
        <View className="flex-row gap-3 m-2">
          <Text
            className={`${textColor} text-lg font-Inter-Medium text-gray-400 dark:text-gray-300`}
          >
            {t('organization.phase')}
          </Text>
          <Text className={`${textColor} text-lg font-Inter-Regular`}>
            {profile.user?.team?.cohort?.phase?.name || t('organization.unavailable')}
          </Text>
        </View>
      </View>
    </>
  );
};

export default TraineeOrg;
