import { editBG } from '@/assets/Icons/dashboard/Icons';
import ProfileAboutTab from '@/components/profile/about';
import ProfileAccountTab from '@/components/profile/account';
import ProfileOrganizationTab from '@/components/profile/organization';
import { Text, View } from '@/components/Themed';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Image, TouchableOpacity, useColorScheme } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useToast } from 'react-native-toast-notifications';

type ProfileTabsType = 'about' | 'organization' | 'account';
export type ProfileType = {
  firstName: string;
  lastName: string;
  name: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  country?: string;
  avatar?: string;
  cover?: string;
  biography?: string;
  githubUsername?: string;
  resume?: string;
  user: {
    organizations: string[];
    email: string;
    role: string;
    team: {
      name: string;
      cohort: {
        name: string;
        startDate: string;
        phase: {
          name: string;
        };
        program: {
          name: string;
        };
      };
    };
  };
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTabsType>('about');
  const colorScheme = useColorScheme();
  const [profile, setProfile] = useState<ProfileType>();
  const toast = useToast();

  const handleTabPress = (tab: ProfileTabsType) => {
    setActiveTab(tab);
  };

  const accountPasswordUpdated = () => {
    setActiveTab('about');
  };

  const textColor = colorScheme === 'dark' ? 'text-gray-100' : 'text-gray-800';
  const bgColor = colorScheme === 'dark' ? 'bg-secondary-dark-900' : 'bg-secondary-light-300';

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const cachedProfile = await AsyncStorage.getItem('userProfile');
        setProfile(cachedProfile ? JSON.parse(cachedProfile) : null);
      } catch (error) {
        toast.show('Failed to retrieve profile info.', { type: 'danger' });
      }
    };
    fetchUserProfile();
  }, []);

  return (
    <View className="flex-1 bg-primary-light dark:bg-primary-dark">
      <View className="relative w-full h-48">
        <CoverImage cover={profile?.cover} name={profile?.name} />
        <TouchableOpacity className="absolute bottom-1 right-4 rounded-full shadow-md">
          <SvgXml xml={editBG} />
        </TouchableOpacity>

        <View className="absolute bottom-[-30px] left-6">
          <View className="relative">
            <Image
              source={
                profile?.avatar
                  ? { uri: profile.avatar }
                  : {
                      uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || 'Unknown')}&background=random&color=fff&size=256`,
                    }
              }
              className="w-28 h-28 rounded-full"
            />
            <TouchableOpacity className="absolute left-24 bottom-8 pl-2 pr-3 py-2 bg-action-500 rounded flex flex-row justify-center items-center">
              <Ionicons name="pencil" size={18} color="white" />
              <Text className="text-white text-lg ml-1">Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className="flex-row justify-center mt-16 gap-3">
        <TouchableOpacity
          className={`${bgColor} px-4 py-2 border-b-4 ${
            activeTab === 'about'
              ? 'border-indigo-400 shadow-sm rounded-lg'
              : 'border-transparent shadow-sm rounded-lg'
          }`}
          onPress={() => handleTabPress('about')}
        >
          <Text className={`${textColor}`}>ABOUT</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`${bgColor} px-4 py-2 border-b-4 ${
            activeTab === 'organization'
              ? 'border-indigo-400 shadow-sm rounded-lg'
              : 'border-transparent shadow-sm rounded-lg'
          }`}
          onPress={() => handleTabPress('organization')}
        >
          <Text className={`${textColor}`}>ORGANIZATION</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`${bgColor} px-4 py-2 border-b-4 ${
            activeTab === 'account'
              ? 'border-indigo-400 shadow-sm rounded-lg'
              : 'border-transparent shadow-sm rounded-lg'
          }`}
          onPress={() => handleTabPress('account')}
        >
          <Text className={`${textColor}`}>ACCOUNT</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'about' && <ProfileAboutTab profile={profile!} />}

      {activeTab === 'organization' && <ProfileOrganizationTab profile={profile!} />}

      {activeTab === 'account' && <ProfileAccountTab passwordUpdated={accountPasswordUpdated} />}
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
