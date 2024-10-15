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
import { UPDATE_PROFILE } from '@/graphql/mutations/EditProfile';
import { SvgXml } from 'react-native-svg';
import { editBG, editPic } from '@/assets/Icons/dashboard/Icons';
import { useState, useEffect, useContext } from 'react';
import { router } from 'expo-router';
import { useFormik } from 'formik';
import { COUNTRIES } from '@/constants/countries';
import { UserContext } from '@/hooks/useAuth';
import { useApolloClient, useMutation } from '@apollo/client';
import Resume from '@/app/dashboard/Resume/Resume';
import { EditProfileSchema } from '@/validations/editProfile.schema';

type FormValues = {
  firstName: string;
  lastName: string;
  telephone: string;
  githubUsername: string;
  address: string;
  city: string;
  country: string;
  biography: string;
};

const EditProfile = () => {
  // const { setName } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState<'EDITNG PROFILE' | 'UPLOAD RESUME'>('EDITNG PROFILE');
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? 'text-gray-100' : 'text-gray-800';
  const bgColor = colorScheme === 'dark' ? 'bg-secondary-dark-900' : 'bg-secondary-light-300';
  const toast = useToast();
  const [Loading, setLoading] = useState(false);
  const [tab, setTab] = useState(0);
  const [Editprofile] = useMutation(UPDATE_PROFILE);
  const handleTabPress = (tab: 'EDITNG PROFILE' | 'UPLOAD RESUME') => {
    setActiveTab(tab);
    setTab(tab === 'EDITNG PROFILE' ? 0 : 1);
  };

  const client = useApolloClient();
  const [UpdateProfile, { loading }] = useMutation(UPDATE_PROFILE);
  const formik = useFormik<FormValues>({
    initialValues: {
      firstName: '',
      lastName: '',
      telephone: '',
      githubUsername: '',
      address: '',
      city: '',
      country: '',
      biography: '',
    },
    onSubmit: async (values: FormValues) => {
      setLoading(true);
      try {
        const { data, errors } = await Editprofile({
          variables: {
            ...values,
          },
        });

        await UpdateProfile({
          variables: { ...data },
        });
        await client.resetStore();
        toast.show('Profile has been updated', {
          type: 'success',
          placement: 'top',
          duration: 4000,
        });
        router.push('/dashboard/profile/orgInfo');
      } catch (error) {}
    },
    validationSchema: EditProfileSchema,
  });

  return (
    <ScrollView className={`flex p-4 pb-8 bg-gray-900 ${bgColor}`}>
      <View className="relative pb-10">
        <Image
          source={require('@/assets/images/background.png')}
          className="w-full h-48"
          resizeMode="cover"
        />

        <View className="absolute top-32 left-5 flex-row items-center">
          <View className="w-24 h-24 rounded-full bg-yellow-400">
            <Image
              source={require('@/assets/images/avatar.png')}
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
            activeTab === 'EDITNG PROFILE'
              ? 'border-indigo-400 shadow-sm rounded-lg'
              : 'border-transparent shadow-sm rounded-lg'
          }`}
          onPress={() => handleTabPress('EDITNG PROFILE')}
        >
          <Text className={`${textColor}`}>EDITNG PROFILE</Text>
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
            onPress={() => router.push('/dashboard/profile/orgInfo')}
            className="flex-row items-center mb-4"
          >
            <Text className="text-white text-lg bg-purple-500 p-2 rounded-lg">
              ← Back to Profile
            </Text>
          </TouchableOpacity>

          <View className="pb-4">
            <Text className={`${textColor} pb-2`}>First Name</Text>
            <TextInput
              testID="first-name"
              className="bg-gray-800 text-white p-3 rounded-lg mb-4"
              placeholder="First Name"
              placeholderTextColor="#888"
              onChangeText={formik.handleChange('firstName')}
              value={formik.values.firstName}
            />
            <Text className="text-error-500 my-1">{formik.errors.firstName}</Text>
            <Text className={`${textColor} pb-2`}>Last Name</Text>
            <TextInput
              className="bg-gray-800 text-white p-3 rounded-lg mb-4"
              testID="last-name"
              placeholder="Last Name"
              onChangeText={formik.handleChange('lastName')}
              value={formik.values.lastName}
              placeholderTextColor="#888"
            />
            <Text className="text-error-500 my-1">{formik.errors.lastName}</Text>
            <Text className={`${textColor} pb-2`}>Telephone</Text>
            <TextInput
              className="bg-gray-800 text-white p-3 rounded-lg mb-4"
              placeholder="Telephone"
              placeholderTextColor="#888"
              onChangeText={formik.handleChange('telephone')}
              value={formik.values.telephone}
            />
            <Text className={`${textColor} pb-2`}>GitHub Username</Text>
            <TextInput
              className="bg-gray-800 text-white p-3 rounded-lg mb-4"
              placeholder="GitHub Username"
              placeholderTextColor="#888"
              onChangeText={formik.handleChange('githubUsername')}
              value={formik.values.githubUsername}
            />
            <View className="flex-row">
              <View className="flex">
                <Text className={`${textColor} pb-2`}>Address</Text>
                <TextInput
                  className="bg-gray-800 text-white p-3 rounded-lg mb-4 flex mr-2 w-60"
                  placeholder="Address"
                  placeholderTextColor="#888"
                  onChangeText={formik.handleChange('address')}
                  value={formik.values.address}
                />
              </View>
              <View className="flex">
                <Text className={`${textColor} pb-2`}>City</Text>
                <TextInput
                  className="bg-gray-800 text-white p-3 rounded-lg mb-4 flex w-60"
                  placeholder="City"
                  placeholderTextColor="#888"
                  onChangeText={formik.handleChange('city')}
                  value={formik.values.city}
                />
              </View>
            </View>
            <Text className={`${textColor} pb-2`}>Country</Text>
            <View className="bg-gray-800 rounded-lg mb-4">
              <Picker
                selectedValue={formik.values.country}
                onValueChange={(itemValue: string) => formik.setFieldValue('country', itemValue)}
                style={{ color: 'white', backgroundColor: 'transparent' }}
              >
                <Picker.Item label="Select a country" value="" />
                {COUNTRIES.map((country) => (
                  <Picker.Item key={country.value} label={country.title} value={country.value} />
                ))}
              </Picker>
            </View>
            <Text className={`${textColor} pb-2`}>Biography</Text>
            <TextInput
              className="bg-gray-800 text-white p-3 rounded-lg h-32"
              placeholder="Biography"
              placeholderTextColor="#888"
              onChangeText={formik.handleChange('biography')}
              value={formik.values.biography}
              multiline
            />
          </View>

          <TouchableOpacity
            className="bg-purple-500 p-4 rounded-lg"
            onPress={() => formik.handleSubmit()}
          >
            {loading ? (
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
