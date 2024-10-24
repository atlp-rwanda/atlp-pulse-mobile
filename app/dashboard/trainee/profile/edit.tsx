import Resume from '@/app/dashboard/Resume/Resume';
import ProfileAvatar from '@/components/ProfileAvatar';
import { COUNTRIES } from '@/constants/countries';
import { UPDATE_PROFILE } from '@/graphql/mutations/UpdateProfile.mutation';
import { GET_PROFILE } from '@/graphql/queries/user';
import { EditProfileSchema } from '@/validations/editProfile.schema';
import { useMutation, useQuery } from '@apollo/client';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useToast } from 'react-native-toast-notifications';
import { CoverImage } from '.';

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
  const [activeTab, setActiveTab] = useState<'EDIT PROFILE' | 'UPLOAD RESUME'>('EDIT PROFILE');
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? 'text-gray-100' : 'text-gray-800';
  const bgColor = colorScheme === 'dark' ? 'bg-secondary-dark-900' : 'bg-secondary-light-300';
  const toast = useToast();
  const [Loading, setLoading] = useState(false);
  const [tab, setTab] = useState(0);
  const [profile, setProfile] = useState<any>({});
  const [userToken, setUserToken] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [countrySelectOpen, setCountrySelectOpen] = useState(false);

  const handleTabPress = (tab: 'EDIT PROFILE' | 'UPLOAD RESUME') => {
    setActiveTab(tab);
    setTab(tab === 'EDIT PROFILE' ? 0 : 1);
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
          router.push('/dashboard/trainee/profile');
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

  useEffect(() => {
    formik.setFieldValue('country', country);
  }, [country]);

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
    <View>
      <View className="relative h-48 mb-12">
        <CoverImage cover={profile?.cover} name={profile?.name} />
        <View className=" absolute bottom-[-30px] left-6">
          <View className="relative">
            <ProfileAvatar name={profile?.name} src={profile.avatar} size="lg" />
            <TouchableOpacity className="absolute left-24 bottom-8 pl-3 pr-4 py-2.5 bg-action-500 rounded-lg flex flex-row justify-center items-center">
              <Ionicons name="pencil" size={18} color="white" />
              <Text className="text-white text-xl ml-1.5 font-Inter-SemiBold">Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className="flex-row justify-center items-center gap-3 my-4">
        <TouchableOpacity
          className={`${bgColor} px-4 py-3 border-b-4 ${
            activeTab === 'EDIT PROFILE'
              ? 'border-indigo-400 shadow-sm rounded-lg'
              : 'border-transparent shadow-sm rounded-lg'
          }`}
          onPress={() => handleTabPress('EDIT PROFILE')}
        >
          <Text className={`${textColor}`}>EDIT PROFILE</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`${bgColor} px-4 py-3 border-b-4 ${
            activeTab === 'UPLOAD RESUME'
              ? 'border-indigo-400 shadow-sm rounded-lg'
              : 'border-transparent shadow-sm rounded-lg'
          }`}
          onPress={() => handleTabPress('UPLOAD RESUME')}
        >
          <Text className={`${textColor}`}>UPLOAD RESUME</Text>
        </TouchableOpacity>
      </View>

      <View className={`mb-12 px-4 py-6 rounded-lg ${bgColor} shadow-lg`}>
        <View className="flex-row">
          <TouchableOpacity
            onPress={() => router.push('/dashboard/trainee/profile')}
            className="flex-row flex-grow-0 items-center justify-start mb-4 bg-action-500 px-2 py-2 rounded-lg"
          >
            <Ionicons name="arrow-back" size={20} color={'white'} />
            <Text className="text-white text-lg ">Back to Profile</Text>
          </TouchableOpacity>
        </View>

        {tab === 0 && (
          <>
            <View className="mb-4">
              <View className="mb-4">
                <Text className={`${textColor} p-2`}>First Name</Text>
                <View
                  className={`flex-row items-center ${bgColor} rounded-lg shadow border-2 border-[#D2D2D2]`}
                >
                  <TextInput
                    testID="first-name"
                    placeholder="First Name"
                    onChangeText={formik.handleChange('firstName')}
                    onBlur={formik.handleBlur('firstName')}
                    value={formik.values.firstName}
                    placeholderTextColor={colorScheme == 'dark' ? '#e5e7eb' : '#1f2937'}
                    className={`${colorScheme === 'dark' ? 'text-gray-100' : 'text-gray-800'} py-4 px-3 flex-1`}
                  />
                </View>
                {formik.touched.firstName && formik.errors.firstName && (
                  <Text className="text-error-500 mt-1">{formik.errors.firstName}</Text>
                )}
              </View>
              <View className="mb-4">
                <Text className={`${textColor} p-2`}>Last Name</Text>
                <View
                  className={`flex-row items-center ${bgColor} rounded-lg shadow border-2 border-[#D2D2D2]`}
                >
                  <TextInput
                    testID="last-name"
                    placeholder="Last Name"
                    onChangeText={formik.handleChange('lastName')}
                    onBlur={formik.handleBlur('lastName')}
                    value={formik.values.lastName}
                    placeholderTextColor={colorScheme == 'dark' ? '#e5e7eb' : '#1f2937'}
                    className={`${colorScheme === 'dark' ? 'text-gray-100' : 'text-gray-800'} py-4 px-3 flex-1`}
                  />
                </View>
                {formik.touched.lastName && formik.errors.lastName && (
                  <Text className="text-error-500 mt-1">{formik.errors.lastName}</Text>
                )}
              </View>
              <View className="mb-4">
                <Text className={`${textColor} p-2`}>Phone Number</Text>
                <View
                  className={`flex-row items-center ${bgColor} rounded-lg shadow border-2 border-[#D2D2D2]`}
                >
                  <TextInput
                    testID="phoneNumber"
                    placeholder="Phone Number"
                    onChangeText={formik.handleChange('phoneNumber')}
                    onBlur={formik.handleBlur('phoneNumber')}
                    value={formik.values.phoneNumber}
                    keyboardType="phone-pad"
                    maxLength={13}
                    placeholderTextColor={colorScheme == 'dark' ? '#e5e7eb' : '#1f2937'}
                    className={`${colorScheme === 'dark' ? 'text-gray-100' : 'text-gray-800'} py-4 px-3 flex-1`}
                  />
                </View>
              </View>

              <View className="mb-4">
                <Text className={`${textColor} p-2`}>GitHub Username</Text>
                <View
                  className={`flex-row items-center ${bgColor} rounded-lg shadow border-2 border-[#D2D2D2]`}
                >
                  <TextInput
                    testID="githubUsername"
                    placeholder="GitHub Username"
                    onChangeText={formik.handleChange('githubUsername')}
                    onBlur={formik.handleBlur('githubUsername')}
                    value={formik.values.githubUsername}
                    placeholderTextColor={colorScheme == 'dark' ? '#e5e7eb' : '#1f2937'}
                    className={`${colorScheme === 'dark' ? 'text-gray-100' : 'text-gray-800'} py-4 px-3 flex-1`}
                  />
                </View>
              </View>

              <View className="flex-row gap-4 mb-4 w-full">
                <View className="flex-1">
                  <Text className={`${textColor} p-2`}>Address</Text>
                  <View
                    className={`flex-row items-center ${bgColor} rounded-lg shadow border-2 border-[#D2D2D2]`}
                  >
                    <TextInput
                      testID="address"
                      placeholder="Address"
                      onChangeText={formik.handleChange('address')}
                      onBlur={formik.handleBlur('address')}
                      value={formik.values.address}
                      placeholderTextColor={colorScheme == 'dark' ? '#e5e7eb' : '#1f2937'}
                      className={`${colorScheme === 'dark' ? 'text-gray-100' : 'text-gray-800'} py-4 px-3 flex-1`}
                    />
                  </View>
                </View>

                <View className="flex-1">
                  <Text className={`${textColor} p-2`}>City</Text>
                  <View
                    className={`flex-row items-center ${bgColor} rounded-lg shadow border-2 border-[#D2D2D2]`}
                  >
                    <TextInput
                      testID="city"
                      placeholder="City"
                      onChangeText={formik.handleChange('city')}
                      onBlur={formik.handleBlur('city')}
                      value={formik.values.city}
                      placeholderTextColor={colorScheme == 'dark' ? '#e5e7eb' : '#1f2937'}
                      className={`${colorScheme === 'dark' ? 'text-gray-100' : 'text-gray-800'} py-4 px-3 flex-1`}
                    />
                  </View>
                </View>
              </View>

              <View className="mb-4 z-30">
                <Text className={`${textColor} p-2`}>Country</Text>

                <View
                  className={`flex-row items-center px-3 ${bgColor} rounded-lg shadow border-2 border-[#D2D2D2]`}
                >
                  <Ionicons name="female" size={20} color="gray" />
                  <View className="flex-1">
                    <DropDownPicker
                      open={countrySelectOpen}
                      items={COUNTRIES}
                      value={country}
                      setOpen={setCountrySelectOpen}
                      setValue={setCountry}
                      theme={colorScheme === 'dark' ? 'DARK' : 'LIGHT'}
                      placeholder="Select Gender"
                      multiple={false}
                      style={{ borderColor: 'transparent', backgroundColor: 'transparent' }}
                    />
                  </View>
                </View>
              </View>
              <View className="mb-4">
                <Text className={`${textColor} p-2`}>Biography</Text>
                <View
                  className={`flex-row items-center ${bgColor} rounded-lg shadow border-2 border-[#D2D2D2]`}
                >
                  <TextInput
                    testID="biography"
                    placeholder="Biography"
                    onChangeText={formik.handleChange('biography')}
                    onBlur={formik.handleBlur('biography')}
                    value={formik.values.biography}
                    multiline={true}
                    numberOfLines={10}
                    placeholderTextColor={colorScheme == 'dark' ? '#e5e7eb' : '#1f2937'}
                    className={`${colorScheme === 'dark' ? 'text-gray-100' : 'text-gray-800'} py-4 px-3 flex-1 h-32`}
                  />
                </View>
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
          </>
        )}

        {tab === 1 && <Resume />}
      </View>
    </View>
  );
};

export default EditProfile;
