import { Text, View } from '@/components/Themed';
import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { editBG } from '@/assets/Icons/dashboard/Icons';
import AboutTrainee from '@/components/trainee/About';
import ProfileAccountTab from '@/components/trainee/Account';
import TraineeOrg from '@/components/trainee/Organisation';
import { GET_PROFILE } from '@/graphql/queries/user';
import { useQuery } from '@apollo/client';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useToast } from 'react-native-toast-notifications';

type TabKey = 'About' | 'Organisation' | 'Account';

export default function Profile() {
  const toast = useToast();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [selectedType, setSelectedType] = useState<TabKey>('About');
  const [type, setType] = useState<string[]>(['About', 'Organisation', 'Account']);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>({});

  const textColor = colorScheme === 'dark' ? 'text-gray-100' : 'text-gray-800';
  const bgColor = colorScheme === 'dark' ? 'bg-secondary-dark-900' : 'bg-secondary-light-300';

  const handleTypeChange = (type: string) => {
    setSelectedType(type as TabKey);
  };

  const accountPasswordUpdated = () => {
    setSelectedType('About');
  };

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          setUserToken(token);
        } else {
          toast.show('Token Not found.', { type: 'danger', placement: 'top', duration: 3000 });
        }
      } catch (error) {
        toast.show('Failed to retrieve token.', {
          type: 'danger',
          placement: 'top',
          duration: 3000,
        });
      }
    };
    fetchToken();
  }, []);

  const { data, loading, error } = useQuery(GET_PROFILE, {
    context: {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    },
    skip: !userToken,
  });

  useEffect(() => {
    if (error) {
      toast.show('Error fetching profile.', { type: 'danger', placement: 'top', duration: 3000 });
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      setProfile(data.getProfile);
    }
  }, [data]);

  return (
    <View>
      <View className="relative h-48">
        <CoverImage cover={profile?.cover} name={profile?.name} />
        <TouchableOpacity className="absolute bottom-1 right-4 rounded-full shadow-md">
          <SvgXml xml={editBG} />
        </TouchableOpacity>

        <View className=" absolute bottom-[-30px] left-6">
          <View className="relative">
            <Image
              source={
                profile.avatar
                  ? { uri: profile.avatar }
                  : {
                      uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || 'Unknown')}&background=cbecd7&size=256`,
                    }
              }
              className="w-28 h-28 rounded-full"
            />
            <TouchableOpacity
              onPress={() => router.push('/dashboard/EditProfile/EditProfile')}
              className="absolute left-24 bottom-8 pl-3 pr-4 py-2.5 bg-action-500 rounded-lg flex flex-row justify-center items-center"
            >
              <Ionicons name="pencil" size={18} color="white" />
              <Text className="text-white text-xl ml-1.5 font-Inter-SemiBold">Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View className="flex-row justify-center items-center gap-3 w-[100%] mt-16">
        {type.map((tabType, index) => (
          <Pressable
            key={index}
            onPress={() => handleTypeChange(tabType)}
            className={`px-5 py-2 border-b-2 border-action-500 items-center shadow-s shadow-action-500 justify-center rounded-lg
          ${colorScheme === 'dark' ? 'text-primary-dark bg-secondary-dark-700' : 'text-secondary-light bg-secondary-light-200'}
          ${selectedType === tabType ? 'border-action-500' : 'border-transparent'}`}
          >
            <Text
              className={`text-lg font-Inter-Medium
    ${colorScheme === 'dark' ? 'text-primary-light' : 'text-secondary-dark'}
    ${selectedType === tabType ? 'text-action-500' : ''}`}
            >
              {tabType}
            </Text>
          </Pressable>
        ))}
      </View>
      <ScrollView
        contentContainerStyle={{
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        className="mt-4 w-[100%] flex-grow"
      >
        {selectedType === 'About' && (
          <AboutTrainee profile={profile} bgColor={bgColor} textColor={textColor} />
        )}

        {selectedType === 'Organisation' && (
          <TraineeOrg profile={profile} bgColor={bgColor} textColor={textColor} />
        )}

        {selectedType === 'Account' && (
          <ProfileAccountTab passwordUpdated={accountPasswordUpdated} />
        )}
      </ScrollView>
    </View>
  );
}

const CoverImage = ({ cover, name }: { cover?: string; name?: string }) => {
  if (!cover) {
    return (
      <View className="w-full h-full object-cover rounded-lg bg-secondary-light-300 dark:bg-secondary-dark-900 justify-center items-center">
        <Text className="text-center text-gray-900 dark:text-white font-Inter-Medium text-xl">
          {name}
        </Text>
      </View>
    );
  }

  return <Image src={cover} className="w-full h-full object-cover rounded-lg" />;
};
