import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { ProfileType } from '../../app/dashboard/profile';
import { Text, View } from '../Themed';

type ProfileAboutTabProps = {
  profile?: ProfileType;
};

export default function ProfileAboutTab({ profile }: ProfileAboutTabProps) {
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? 'text-gray-100' : 'text-gray-800';
  const bgColor = colorScheme === 'dark' ? 'bg-secondary-dark-900' : 'bg-secondary-light-300';

  return (
    <>
      <View className={`${bgColor} w-[100%] p-6 rounded-md mt-4`}>
        <Text className={`${textColor} text-lg font-Inter-SemiBold mb-2`}>BASIC INFORMATION</Text>
        <View className="flex-row gap-2 m-1.5">
          <Ionicons name="person" size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
          <View className="flex-row gap-2">
            <Text className={`${textColor} font-Inter-Regular`}>
              {profile?.name ? profile.name : 'Unavailable'}
            </Text>
          </View>
        </View>
        <View className="flex-row gap-2 m-1.5">
          <Ionicons name="mail" size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
          <Text className={`${textColor} font-Inter-Regular`}>
            {profile?.user?.email ? profile?.user?.email : 'Unavailable'}
          </Text>
        </View>
        <View className="flex-row gap-2 m-1.5">
          <Ionicons name="call" size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
          <Text className={`${textColor} font-Inter-Regular`}>
            {profile?.phoneNumber ? profile.phoneNumber : 'Unavailable'}
          </Text>
        </View>
        <View className="flex-row gap-2 m-1.5">
          <Ionicons name="home" size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
          <Text className={`${textColor} font-Inter-Regular`}>
            {profile?.address ? profile.address : 'Unavailable'}
          </Text>
        </View>
        <View className="flex-row gap-2 m-1.5">
          <Ionicons
            name="logo-github"
            size={20}
            color={colorScheme === 'dark' ? 'white' : 'black'}
          />
          <Text className={`${textColor} font-Inter-Regular`}>
            {profile?.githubUsername ? profile.githubUsername : 'Unavailable'}
          </Text>
        </View>
        <Text className={`${textColor} text-lg font-Inter-SemiBold mb-2 mt-4`}>RESUME</Text>
        <Text className={`${textColor} text-md m-2`}>
          {profile?.resume ? profile.resume : 'No Resume uploaded yet'}
        </Text>
      </View>
      <View className={`${bgColor} w-[100%] p-6 rounded-md mt-5 mb-20`}>
        <Text className={`${textColor} text-lg font-Inter-SemiBold mb-2`}>BIOGRAPHY</Text>
        <Text className={`${textColor} text-md m-2`}>
          {profile?.biography ? profile.biography : 'No Biography uploaded yet'}
        </Text>
      </View>
    </>
  );
}
