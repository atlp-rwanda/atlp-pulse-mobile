import React from 'react';
import { View, Text, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

interface Profile {
  name?: string;
  user?: {
    email?: string;
  };
  phoneNumber?: string;
  address?: string;
  githubUsername?: string;
  resume?: string;
  cover?: string;
  biography?: string;
}

interface AboutTraineeProps {
  profile: Profile;
  bgColor: string;
  textColor: string;
  Resume: Profile;
}

const AboutTrainee: React.FC<AboutTraineeProps> = ({ profile, bgColor, textColor,Resume }) => {
  const colorScheme = useColorScheme();

  return (
    <>
      <View className={`${bgColor} w-[100%] p-6 rounded-md `}>
        <Text className={`${textColor} text-xl`}>BASIC INFORMATION</Text>
        <View className="flex-row gap-5 m-2">
          <Ionicons name="person" size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
          <View className="flex-row gap-2">
            <Text className={`${textColor} text-lg`}>
              {profile.name ? profile.name : 'Unavailable'}
            </Text>
          </View>
        </View>
        <View className="flex-row gap-5 m-2">
          <Ionicons name="mail" size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
          <Text className={`${textColor} text-lg`}>
            {profile.user?.email ? profile.user?.email : 'Unavailable'}
          </Text>
        </View>
        <View className="flex-row gap-5 m-2">
          <Ionicons name="call" size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
          <Text className={`${textColor} text-lg`}>
            {profile.phoneNumber ? profile.phoneNumber : 'Unavailable'}
          </Text>
        </View>
        <View className="flex-row gap-5 m-2">
          <Ionicons name="home" size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
          <Text className={`${textColor} text-lg`}>
            {profile.address ? profile.address : 'Unavailable'}
          </Text>
        </View>
        <View className="flex-row gap-5 m-2">
          <Ionicons name="logo-github" size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
          <Text className={`${textColor} text-lg`}>
            {profile.githubUsername ? profile.githubUsername : 'Unavailable'}
          </Text>
        </View>
        <Text className={`${textColor} text-xl`}>RESUME</Text>
        <View className="flex-row m-2 items-center">
        <Ionicons name='book-outline' size={20} color={colorScheme === 'dark' ? 'white' : 'black'} />
        <Text className={`${textColor} text-md m-2`}>
            {Resume.resume ? (
            <Text style={{ color: `${textColor}`}} onPress={() => Resume.resume && Linking.openURL(Resume.resume)}>
              Resume
            </Text>
            ) : (
            'No Resume uploaded yet'
            )}
        </Text>
        </View>
      </View>
      <View className={`${bgColor} w-[100%] p-6 rounded-md mt-5 mb-20`}>
        <Text className={`${textColor} text-xl`}>BIOGRAPHY</Text>
        <Text className={`${textColor} text-md m-2`}>
          {profile.biography ? profile.biography : 'No Biography uploaded yet'}
        </Text>
      </View>
    </>
  );
};

export default AboutTrainee;