import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useToast } from 'react-native-toast-notifications';
import { UPDATE_PROFILE } from '@/graphql/mutations/UpdateProfile.mutation';
import { GET_PROFILE } from '@/graphql/queries/GetProfile';
import { SvgXml } from 'react-native-svg';
import { editPic } from '@/assets/Icons/dashboard/Icons';
import { useState, useEffect, useCallback } from 'react';
import { router } from 'expo-router';
import { useFormik } from 'formik';
import { COUNTRIES } from '@/constants/countries';
import { useMutation, useQuery } from '@apollo/client';
import Resume from '@/app/dashboard/Resume/Resume';
import { EditProfileSchema } from '@/validations/editProfile.schema';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

type FormValues = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  githubUsername: string;
  address: string;
  city: string;
  country: string;
  biography: string;
};

const EditProfile = () => {
  const [activeTab, setActiveTab] = useState<'EDITING PROFILE' | 'UPLOAD RESUME'>(
    'EDITING PROFILE'
  );
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? 'text-gray-100' : 'text-gray-800';
  const bgColor = colorScheme === 'dark' ? 'bg-secondary-dark-900' : 'bg-secondary-light-300';
  const toast = useToast();
  const [Loading, setLoading] = useState(false);
  const [tab, setTab] = useState(0);
  const [profile, setProfile] = useState<any>({});
  const [userToken, setUserToken] = useState<string | null>(null);

  const handleTabPress = (tab: 'EDITING PROFILE' | 'UPLOAD RESUME') => {
    setActiveTab(tab);
    setTab(tab === 'EDITING PROFILE' ? 0 : 1);
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

  const [UpdateProfile] = useMutation(UPDATE_PROFILE, {
    context: {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    },
    update(cache, { data: { updateProfile } }) {
      cache.modify({
        fields: {
          getProfile(existingProfile = {}) {
            return { ...existingProfile, ...updateProfile };
          },
        },
      });
    },
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      phoneNumber: profile.phoneNumber,
      githubUsername: profile.githubUsername,
      address: profile.address,
      city: profile.city,
      country: profile.country,
      biography: profile.biography,
    },
    enableReinitialize: true,

    onSubmit: async (values: FormValues) => {
      setLoading(true);
      try {
        const { data } = await UpdateProfile({
          variables: {
            ...values,
          },
        });

        if (data) {
          toast.show('Profile has been updated', {
            type: 'success',
            placement: 'top',
            duration: 4000,
          });
          router.push('/dashboard/trainee/Profile');
        }
      } catch (error) {
        toast.show('Failed to update profile', {
          type: 'danger',
          placement: 'top',
          duration: 4000,
        });
      } finally {
        setLoading(false);
      }
    },
    validationSchema: EditProfileSchema,
  });

  if (loading) {
    return (
      <View className="flex justify-center items-center">
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex justify-center items-center">
        <Text className="text-red-500">Error fetching profile data</Text>
      </View>
    );
  }

  return (
    <ScrollView className={`flex p-4 pb-8 bg-gray-900 ${bgColor}`}>
      <View className="relative pb-10">
        <Image
          source={
            profile.cover ? { uri: profile.cover } : require('@/assets/images/background.png')
          }
          className="w-full h-48"
          resizeMode="cover"
        />
        <View className="absolute top-32 left-5 flex-row items-center">
          <View className="w-24 h-24 rounded-full bg-yellow-400">
            <Image
              source={
                profile.avatar
                  ? { uri: profile.avatar }
                  : {
                      uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=random&color=fff`,
                    }
              }
              className="w-full h-full rounded-full"
            />
          </View>
          <TouchableOpacity className="-ml-2">
            <SvgXml xml={editPic} />
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-row justify-between mt-4">
        <TouchableOpacity
          className={`${bgColor} px-4 py-2 border-b-4 ${
            activeTab === 'EDITING PROFILE'
              ? 'border-indigo-400 shadow-sm rounded-lg'
              : 'border-transparent shadow-sm rounded-lg'
          }`}
          onPress={() => handleTabPress('EDITING PROFILE')}
        >
          <Text className={`${textColor}`}>EDITING PROFILE</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`${bgColor} px-4 py-2 border-b-4 ${
            activeTab === 'UPLOAD RESUME'
              ? 'border-indigo-400 shadow-sm rounded-lg'
              : 'border-transparent shadow-sm rounded-lg'
          }`}
          onPress={() => handleTabPress('UPLOAD RESUME')}
        >
          <Text className={`${textColor}`}>UPLOAD RESUME</Text>
        </TouchableOpacity>
      </View>

      {tab === 0 && (
        <View className={`bg-[#272728] px-4 pt-10 pb-6 rounded-lg ${bgColor} shadow-lg`}>
          <TouchableOpacity
            onPress={() => router.push('/dashboard/trainee/Profile')}
            className="flex-row items-center mb-4 bg-action-500 w-40 p-2 rounded-lg"
          >
            <Ionicons name="arrow-back" size={20} color={'white'} />
            <Text className="text-white text-lg ">Back to Profile</Text>
          </TouchableOpacity>

          <View className="pb-4">
            <Text className={`${textColor} pb-2`}>First Name</Text>
            <View
              className={`flex-row items-center ${bgColor} rounded-lg shadow border-2 border-[#D2D2D2]`}
            >
              <TextInput
                testID="first-name"
                className={`p-3 rounded-lg ${textColor}`}
                placeholder="First Name"
                placeholderTextColor="#888"
                onChangeText={formik.handleChange('firstName')}
                value={formik.values.firstName}
              />
            </View>

            <Text className="text-error-500 my-1">{formik.errors.firstName}</Text>

            <Text className={`${textColor} pb-2`}>Last Name</Text>
            <View
              className={`flex-row items-center ${bgColor} rounded-lg shadow border-2 border-[#D2D2D2]`}
            >
              <TextInput
                testID="last-name"
                className={`p-3 rounded-lg ${textColor}`}
                placeholder="Last Name"
                placeholderTextColor="#888"
                onChangeText={formik.handleChange('lastName')}
                value={formik.values.lastName}
              />
            </View>
            <Text className="text-error-500 my-1">{formik.errors.lastName}</Text>

            <Text className={`${textColor} pb-2`}>Telephone</Text>
            <View
              className={`flex-row items-center ${bgColor} rounded-lg shadow border-2 border-[#D2D2D2]`}
            >
              <TextInput
                testID="telephone"
                className={`p-3 rounded-lg ${textColor}`}
                placeholder="Telephone"
                placeholderTextColor="#888"
                onChangeText={formik.handleChange('phoneNumber')}
                value={formik.values.phoneNumber}
                keyboardType="numeric"
                maxLength={13}
              />
            </View>

            <Text className={`${textColor} pb-2 pt-4`}>GitHub Username</Text>
            <View
              className={`flex-row items-center ${bgColor} rounded-lg shadow border-2 border-[#D2D2D2]`}
            >
              <TextInput
                testID="githubUsername"
                className={`p-3 rounded-lg ${textColor}`}
                placeholder="GitHub Username"
                placeholderTextColor="#888"
                onChangeText={formik.handleChange('githubUsername')}
                value={formik.values.githubUsername}
              />
            </View>

            <View className="flex-row gap-4 pb-4 pt-4 w-full">
              <View className="flex w-[47%]">
                <Text className={`${textColor} pb-2`}>Address</Text>
                <View
                  className={`flex-row items-center ${bgColor} rounded-lg shadow border-2 border-[#D2D2D2]`}
                >
                  <TextInput
                    testID="address"
                    className={`p-3 rounded-lg ${textColor} flex mr-2 `}
                    placeholder="Address"
                    placeholderTextColor="#888"
                    onChangeText={formik.handleChange('address')}
                    value={formik.values.address}
                  />
                </View>
              </View>

              <View className="flex w-[49%]">
                <Text className={`${textColor} pb-2`}>City</Text>
                <View
                  className={`flex-row items-center ${bgColor} rounded-lg shadow border-2 border-[#D2D2D2]`}
                >
                  <TextInput
                    testID="city"
                    className={`p-3 rounded-lg ${textColor} flex mr-2`}
                    placeholder="City"
                    placeholderTextColor="#888"
                    onChangeText={formik.handleChange('city')}
                    value={formik.values.city}
                  />
                </View>
              </View>
            </View>

            <Text className={`${textColor} pb-2`}>Country</Text>

            <View className={`${bgColor} rounded-lg shadow border-2 border-[#D2D2D2] mb-4`}>
              <Picker
                selectedValue={formik.values.country}
                onValueChange={(itemValue: string) => formik.setFieldValue('country', itemValue)}
                style={{ color: colorScheme === 'dark' ? '#F3F4F6' : '#1F2937' }}
              >
                <Picker.Item
                  label="Select a country"
                  value=""
                  style={{ color: colorScheme === 'dark' ? '#F3F4F6' : '#1F2937' }}
                />
                {COUNTRIES.map((country) => (
                  <Picker.Item
                    key={country.value}
                    label={country.title}
                    value={country.value}
                    style={{ color: colorScheme === 'dark' ? '#1F2937' : '#1F2937' }}
                  />
                ))}
              </Picker>
            </View>

            <Text className={`${textColor} pb-2`}>Biography</Text>
            <View
              className={`flex-row items-center ${bgColor} rounded-lg shadow border-2 border-[#D2D2D2]`}
            >
              <TextInput
                testID="biography"
                className={`p-3 rounded-lg ${textColor} rounded-lg h-32`}
                placeholder="Biography"
                placeholderTextColor="#888"
                onChangeText={formik.handleChange('biography')}
                value={formik.values.biography}
                multiline
                style={{ textAlignVertical: 'top' }}
              />
            </View>
          </View>

          <TouchableOpacity
            testID="submit-button"
            className="bg-action-500 p-4 rounded-lg"
            onPress={() => formik.handleSubmit()}
          >
            {Loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-center text-lg">Update Profile</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {tab === 1 && (
        <View>
          <Resume />
        </View>
      )}
    </ScrollView>
  );
};

export default EditProfile;
