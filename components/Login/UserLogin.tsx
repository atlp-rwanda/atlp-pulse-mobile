import {
  email,
  lightEmail,
  lock,
  LightBottomIcon,
  DarkBottomIcon,
  DarkLock,
} from '@/assets/Icons/auth/Icons';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { View, TouchableOpacity, TextInput, ActivityIndicator, useColorScheme } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Text } from '@/components/Themed';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { UserLoginSchema } from '@/validations/login.schema';
import AsyncStorage from '@react-native-async-storage/async-storage';

type FormValues = {
  email: string;
  password: string;
};

type userLoginProps = {
  onSubmit: (values: FormValues) => void;
};

export default function UserLogin({ onSubmit }: userLoginProps) {
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const [orgName, setOrgName] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrgName = async () => {
      const name = await AsyncStorage.getItem('orgName');
      setOrgName(name);
    };
    fetchOrgName();
  }, []);

  const togglePasswordVisibility = () => {
    setSecureTextEntry((prev) => !prev);
  };

  const formik = useFormik({
    initialValues: {} as FormValues,
    onSubmit: async (values: FormValues) => {
      setLoading(true);
      await onSubmit(values);
      setLoading(false);
    },
    validationSchema: UserLoginSchema,
  });
  const textColor = colorScheme === 'dark' ? 'text-gray-100' : 'text-gray-800';
  return (
    <View testID="user-login">
      <View className="flex-1 p-10 justify-center mt-16">
        <View>
          <Text className={`text-lg font-Inter-Bold mb-6 text-center ${textColor}`}>
            Welcome to <Text className={`font-Inter-Regular ${textColor}`}>{orgName}</Text>
          </Text>
          <TouchableOpacity onPress={() => router.push('/auth/login')}>
            <Text className="text-sm font-Inter-Regular text-center text-action-600 mb-6">
              Switch your organization
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex flex-col">
          <View className="flex mb-4">
            <Text className={`p-2 ${textColor}`}>New Password</Text>
            <View
              className={`flex-row items-center ${colorScheme === 'dark' ? 'bg-primary-dark' : 'bg-secondary-light-50'} p-3 rounded-lg shadow border-2 border-[#D2D2D2]`}
            >
              <SvgXml
                xml={colorScheme === 'dark' ? lightEmail : email}
                color="gray"
                className="mr-2"
              />
              <TextInput
                placeholder="Email"
                placeholderTextColor={colorScheme === 'dark' ? '#FFFFFF' : '#9e9e9e'}
                onChangeText={formik.handleChange('email')}
                onBlur={formik.handleBlur('email')}
                value={formik.values.email}
                className={`flex-1 ml-2 rounded-[10px] font-Inter-Regular ${colorScheme === 'dark' ? 'text-primary-light' : 'text-secondary-dark-400'}`}
                autoCapitalize="none"
                keyboardType="url"
              />
            </View>
            <Text className="mt-2 text-error-400 ">{formik.errors.email}</Text>
            <Text className={`pl-2 pt-2 ${textColor}`}>New Password</Text>
            <View
              className={`mt-4 relative flex flex-row gap-2 border-2 border-[#D2D2D2] rounded-[10px] p-3 ${colorScheme === 'dark' ? 'bg-primary-dark' : 'bg-secondary-light-50'} p-3`}
            >
              <SvgXml xml={colorScheme === 'dark' ? DarkLock : lock} />
              <TextInput
                className={`font-Inter-Regular ${colorScheme === 'dark' ? 'text-primary-light' : 'text-secondary-dark-400'}`}
                placeholder="Password"
                placeholderTextColor={colorScheme === 'dark' ? '#FFFFFF' : '#9e9e9e'}
                secureTextEntry={secureTextEntry}
                onChangeText={formik.handleChange('password')}
                onBlur={formik.handleBlur('password')}
                value={formik.values.password}
              />

              <TouchableOpacity
                className="absolute right-3 top-3"
                onPress={togglePasswordVisibility}
              >
                <Ionicons
                  name={secureTextEntry ? 'eye-outline' : 'eye-off-outline'}
                  size={24}
                  color={'#575757'}
                />
              </TouchableOpacity>
            </View>

            <View className="flex flex-row justify-between">
              <Text className="mt-2 text-error-400">{formik.errors.password}</Text>
              <TouchableOpacity onPress={() => router.push('/auth/forgot-password')}>
                <Text className="text-action-500 p-2 text-right">Forgot Password?</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex flex-col gap-4">
            <TouchableOpacity
              onPress={() => formik.handleSubmit()}
              className="bg-[#7E6FF3] p-4 rounded-lg items-center"
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-secondary-light-500 text-lg font-semibold">Sign In</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-12 items-center">
          <SvgXml xml={colorScheme === 'dark' ? DarkBottomIcon : LightBottomIcon} />
        </View>
      </View>
    </View>
  );
}

