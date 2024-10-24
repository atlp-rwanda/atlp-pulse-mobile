
import { View, Text } from '@/components/Themed';
import { Pressable, ScrollView, TouchableOpacity, useColorScheme, Image } from 'react-native';
import { Svg, SvgXml } from 'react-native-svg';
import ExpoImage from 'expo-image/build/ExpoImage';
import { useContext, useEffect, useState } from 'react';

import { useLazyQuery, useQuery } from '@apollo/client';
import AboutTrainee from '@/components/trainee/About';
import { router, useLocalSearchParams } from 'expo-router';
import { useToast } from 'react-native-toast-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { editBG, editPic } from '@/assets/Icons/dashboard/Icons';
import { GET_PROFILE, GET_TRAINEE_PROFILE } from '@/graphql/mutations/User';
import TraineeOrg from '@/components/trainee/Organisation';

type TabKey = 'About' | 'Organisation';

export default function Profile() {
  const colorScheme = useColorScheme();
  const [selectedType, setSelectedType] = useState<TabKey>('About');
  const [type, setType] = useState<string[]>(['About', 'Organisation']);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [orgToken, setOrgToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>({});
  const [traineeProfile, setTraineeProfile] = useState<any>({});
  const params = useLocalSearchParams();
  const toast = useToast();
  const handleTypeChange = (type: string) => {
    setSelectedType(type as TabKey);
  };
  const textColor = colorScheme === 'dark' ? 'text-gray-100' : 'text-gray-800';
  const bgColor = colorScheme === 'dark' ? 'bg-secondary-dark-900' : 'bg-secondary-light-300';
  
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
        toast.show('Failed to retrieve token.', { type: 'danger', placement: 'top', duration: 3000 });
      } 
    };
    fetchToken();
  }, []);

  useEffect(() => {
    const fetchOrgToken = async () => {
      try {
        const orgToken = await AsyncStorage.getItem('orgToken');
        if (orgToken) {
          setOrgToken(orgToken);
        } else {
          toast.show('Token Not found.', { type: 'danger', placement: 'top', duration: 3000 });
        }
      } catch (error) {
        toast.show('Failed to retrieve token.', { type: 'danger', placement: 'top', duration: 3000 });
      } 
    };
    fetchOrgToken();
  }, []);
 
 const { data: traineedata, error: err } = useQuery(GET_TRAINEE_PROFILE, {
  context: {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  },
  skip: !userToken,
  variables: {
    orgToken: orgToken,
  },
});

useEffect(() => {
  if (err) {
    console.log('Error:', err); 
    toast.show('Error fetching profile.', { type: 'danger', placement: 'top', duration: 3000 });
  }
}, [err]);

useEffect(() => {
  if (traineedata) {
    setTraineeProfile(traineedata.getProfile);
  }
}, [traineedata]);


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
    <>
      <View className="flex">
        <>
        <View className="relative w-full h-48 mb-10">
        <Image
          source={profile.cover ? { uri: profile.cover } : require('@/assets/images/background.png')}
          className="w-full h-full object-cover"
        />
        <TouchableOpacity onPress={() => router.push('/dashboard/EditProfile/EditProfile')} className="absolute bottom-1 right-4 rounded-full shadow-md">
          <SvgXml xml={editBG} />
        </TouchableOpacity>

        <View className=" absolute bottom-[-30px] left-6">
            <View className="relative">
            <Image
              source={profile.avatar ? { uri: profile.avatar } : { uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=random&color=fff` }}
              className="w-[100] h-[100] rounded-full"
            />
            <TouchableOpacity className="absolute right-[-65px] bottom-8 p-1">
              <SvgXml xml={editPic} />
            </TouchableOpacity>
            </View>
        </View>
      </View>
          <View className="flex-row justify-between items-center p-1  w-[100%] h-[8%] ">
            {type.map((tabType, index) => (
              <Pressable
                key={index}
                onPress={() => handleTypeChange(tabType)}
                className={`border-b-2 border-action-500 h-[70%] w-[49%] items-center shadow-s shadow-action-500 justify-center rounded-lg
              ${colorScheme === 'dark' ? 'text-primary-dark bg-secondary-dark-700' : 'text-secondary-light bg-secondary-light-200'}
              ${selectedType === tabType ? 'border-action-500' : 'border-transparent'}`}
              >
                <Text
                  className={`text-xl
        ${colorScheme === 'dark' ? 'text-primary-light' : 'text-secondary-dark'}
        ${selectedType === tabType ? 'text-action-500 font-bold' : ''}`}
                >
                  {tabType}
                </Text>
              </Pressable>
            ))}
          </View>
        </>
        <ScrollView contentContainerStyle={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }} className="p-1 w-[100%] flex-grow">

        {selectedType === 'About' ? (
          <AboutTrainee profile={profile} Resume={traineeProfile} bgColor={bgColor} textColor={textColor} />
        ) : (
          ''
        )}
        {selectedType === 'Organisation' ? (
          <TraineeOrg profile={profile}  bgColor={bgColor} textColor={textColor} />
        ) : (
          ''
        )}
        </ScrollView>
      </View>
    </>
  );
}