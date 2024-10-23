import React from 'react';
import { View, Text } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { pulse } from '../icons/icons';
import { useTranslation } from 'react-i18next';

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
          <Text className={`text-primary-light text-lg font-bold`}>Andela.pulse.com</Text>
        </View>
      </View>
      <View className={`${bgColor} w-[100%] p-4 rounded-md mt-3 text-bold`}>
        <Text className={`${textColor} text-xl`}>{t('organization.organizationDetails')}</Text>
        <View className="flex-row gap-5 m-1">
          <Text className={`${textColor} text-lg`}>{t('organization.organizationName')}</Text>
          <Text className={`${textColor} text-lg`}>
            {profile.user?.organizations?.[0] || t('organization.unavailable')}
          </Text>
        </View>
        <View className="flex-row gap-5 m-1">
          <Text className={`${textColor} text-lg`}>{t('organization.adminEmail')}</Text>
          <Text className={`${textColor} text-lg`}>devpulse@proton.me</Text>
        </View>
        <View className="flex-row gap-5 m-1">
          <Text className={`${textColor} text-lg`}>{t('organization.role')}</Text>
          <Text className={`${textColor} text-lg`}>
            {profile.user?.role || t('organization.unavailable')}
          </Text>
        </View>
      </View>
      <View className={`${bgColor} w-[100%] p-4 rounded-md mt-3 text-bold mb-14`}>
        <Text className={`${textColor} text-xl`}>{t('organization.management')}</Text>
        <View className="flex-row gap-5 m-1">
          <Text className={`${textColor} text-lg`}>{t('organization.program')}</Text>
          <Text className={`${textColor} text-lg`}>
            {profile.user?.team?.cohort?.program?.name || t('organization.unavailable')}
          </Text>
        </View>
        <View className="flex-row gap-5 m-1">
          <Text className={`${textColor} text-lg`}>{t('organization.cohort')}</Text>
          <Text className={`${textColor} text-lg`}>
            {profile.user?.team?.cohort?.name || t('organization.unavailable')}
          </Text>
        </View>
        <View className="flex-row gap-5 m-1">
          <Text className={`${textColor} text-lg`}>{t('organization.team')}</Text>
          <Text className={`${textColor} text-lg`}>
            {profile.user?.team?.name || t('organization.unavailable')}
          </Text>
        </View>
        <View className="flex-row gap-5 m-1">
          <Text className={`${textColor} text-lg`}>{t('organization.phase')}</Text>
          <Text className={`${textColor} text-lg`}>
            {profile.user?.team?.cohort?.phase?.name || t('organization.unavailable')}
          </Text>
        </View>
      </View>
    </>
  );
};

export default TraineeOrg;
