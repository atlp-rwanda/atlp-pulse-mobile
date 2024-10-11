import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, useColorScheme } from 'react-native';
import { editBG, editPic, logo } from '@/assets/Icons/dashboard/Icons';
import { SvgXml } from 'react-native-svg';
import { GET_PROFILE } from '@/graphql/queries/User';
import { useQuery } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useToast } from 'react-native-toast-notifications';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<'about' | 'organizations'>('about');
  const colorScheme = useColorScheme();
  const [userToken, setUserToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>({});
  const toast = useToast();

  const handleTabPress = (tab: 'about' | 'organizations') => {
    setActiveTab(tab);
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
    <View className="flex-1 bg-primary-light dark:bg-primary-dark px-4">
      <View className="relative w-full h-48">
        <Image
          source={require('@/assets/images/background.png')}
          className="w-full h-full object-cover"
        />
        <TouchableOpacity className="absolute bottom-1 right-4 rounded-full shadow-md">
          <SvgXml xml={editBG} />
        </TouchableOpacity>

        <View className="absolute bottom-[-30px] left-6">
          <View className="relative">
            <Image
              source={require('@/assets/images/avatar.png')}
              className="w-35 h-35 rounded-full"
            />
            <TouchableOpacity className="absolute right-[-65px] bottom-8 p-1">
              <SvgXml xml={editPic} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className="flex-row justify-center mt-10 gap-5">
        <TouchableOpacity className={`${bgColor} px-4 py-2 border-b-4 ${activeTab === 'about' ?
          'border-indigo-400 shadow-sm rounded-lg'
          : 'border-transparent shadow-sm rounded-lg'}`}
          onPress={() => handleTabPress('about')}
        >
          <Text className={`${textColor}`}>ABOUT</Text>
        </TouchableOpacity>
        <TouchableOpacity className={`${bgColor} px-4 py-2 border-b-4 ${activeTab === 'organizations' ?
            'border-indigo-400 shadow-sm rounded-lg'
            : 'border-transparent shadow-sm rounded-lg'}`}
          onPress={() => handleTabPress('organizations')}
        >
          <Text className={`${textColor}`}>ORGANIZATIONS</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'about' && (
        <View className="pt-4">
        <Text className={`text-lg font-bold ${textColor}`}>this is about section</Text>
        </View>
      )}

      {activeTab === 'organizations' && (
        <View className="pt-4">
          <View style={{ backgroundColor: '#8667F2' }} className="p-4 rounded-t-2xl flex-row gap-7">
            <View className="bg-white rounded-full flex justify-center left-5">
              <SvgXml xml={logo} />
            </View>
            <View className="left-5">
              <Text className={`text-white text-lg font-bold`} style={{ fontSize: 18 }}>Andela</Text>
              <Text className="text-white">https://andela.pulse.com</Text>
            </View>
          </View>

          <View className={`${bgColor} p-4 mt-4 rounded-lg gap-2`}>
            <Text className={`${textColor} font-bold`} style={{ fontSize: 18 }}>YOUR ORGANIZATION DETAILS</Text>
            <View className="gap-3 flex-row">
              <Text className={`${textColor} font-bold`}>Organisation name:</Text>
              <Text className={`${textColor}`}>{profile.user.organizations[0]}</Text>
            </View>
            <View className="gap-3 flex-row">
              <Text className={`${textColor} font-bold`}>Admin email:</Text>
              <Text className={`${textColor}`}> devpulse@proton.me</Text>
            </View>
            <View className="gap-3 flex-row">
              <Text className={`${textColor} font-bold`}>Role:</Text>
              <Text className={`${textColor}`}>{profile.user?.role || 'Unavailable'}</Text>
            </View>
          </View>

          <View className={`${bgColor} p-4 mt-4 rounded-lg gap-2`}>
            <Text className={`${textColor} font-bold`} style={{ fontSize: 18 }}>MANAGEMENT</Text>
            <View className="gap-3 flex-row">
              <Text className={`${textColor} font-bold`}>Program:</Text>
              <Text className={`${textColor}`}>{profile.user?.team?.cohort?.program?.name || 'Unavailable'}</Text>
            </View>
            <View className="gap-3 flex-row">
              <Text className={`${textColor} font-bold`}>Cohort:</Text>
              <Text className={`${textColor}`}>{profile.user?.team?.cohort?.name || 'Unavailable'}</Text>
            </View>
            <View className="gap-3 flex-row">
              <Text className={`${textColor} font-bold`}>Team:</Text>
              <Text className={`${textColor}`}>{profile.user?.team?.name || 'Unavailable'}</Text>
            </View>
            <View className="gap-3 flex-row">
              <Text className={`${textColor} font-bold`}>Phase:</Text>
              <Text className={`${textColor}`}> {profile.user?.team?.cohort?.phase?.name || 'Unavailable'}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default ProfilePage;
