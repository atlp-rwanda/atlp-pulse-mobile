import { ProfileType } from '@/app/dashboard/profile';
import { logo } from '@/assets/Icons/dashboard/Icons';
import { useColorScheme } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Text, View } from '../Themed';

type ProfileOrganizationTabProps = {
  profile?: ProfileType;
};

export default function ProfileOrganizationTab({ profile }: ProfileOrganizationTabProps) {
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? 'text-gray-100' : 'text-gray-800';
  const bgColor = colorScheme === 'dark' ? 'bg-secondary-dark-900' : 'bg-secondary-light-300';
  return (
    <View className="pt-4">
      <View style={{ backgroundColor: '#8667F2' }} className="p-4 rounded-t-2xl flex-row gap-7">
        <View className="bg-white rounded-full flex justify-center left-5">
          <SvgXml xml={logo} />
        </View>
        <View className="left-5">
          <Text className={`text-white text-lg font-bold`} style={{ fontSize: 18 }}>
            Andela
          </Text>
          <Text className="text-white">https://andela.pulse.com</Text>
        </View>
      </View>

      <View className={`${bgColor} p-4 mt-4 rounded-lg gap-2`}>
        <Text className={`${textColor} font-Inter-SemiBold text-xl mb-2`}>
          YOUR ORGANIZATION DETAILS
        </Text>
        <View className="gap-2 flex-row m-1">
          <Text className={`${textColor} font-Inter-Regular`}>Organisation name:</Text>
          <Text className={`${textColor}`}>{profile?.user.organizations[0]}</Text>
        </View>
        <View className="gap-2 flex-row m-1">
          <Text className={`${textColor} font-Inter-Regular`}>Admin email:</Text>
          <Text className={`${textColor}`}>devpulse@proton.me</Text>
        </View>
        <View className="gap-2 flex-row m-1">
          <Text className={`${textColor} font-Inter-Regular`}>Role:</Text>
          <Text className={`${textColor}`}>{profile?.user?.role || 'Unavailable'}</Text>
        </View>
      </View>

      <View className={`${bgColor} p-4 mt-4 rounded-lg gap-2`}>
        <Text className={`${textColor} font-Inter-SemiBold text-xl mb-2`}>MANAGEMENT</Text>
        <View className="gap-2 flex-row m-1">
          <Text className={`${textColor} font-Inter-Regular`}>Program:</Text>
          <Text className={`${textColor}`}>
            {profile?.user?.team?.cohort?.program?.name || 'Unavailable'}
          </Text>
        </View>
        <View className="gap-2 flex-row m-1">
          <Text className={`${textColor} font-Inter-Regular`}>Cohort:</Text>
          <Text className={`${textColor}`}>
            {profile?.user?.team?.cohort?.name || 'Unavailable'}
          </Text>
        </View>
        <View className="gap-2 flex-row m-1">
          <Text className={`${textColor} font-Inter-Regular`}>Team:</Text>
          <Text className={`${textColor}`}>{profile?.user?.team?.name || 'Unavailable'}</Text>
        </View>
        <View className="gap-2 flex-row m-1">
          <Text className={`${textColor} font-Inter-Regular`}>Phase:</Text>
          <Text className={`${textColor}`}>
            {' '}
            {profile?.user?.team?.cohort?.phase?.name || 'Unavailable'}
          </Text>
        </View>
      </View>
    </View>
  );
}
