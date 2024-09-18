import {
  email,
  lightEmail,
  lock,
  LightBottomIcon,
  DarkBottomIcon,
  DarkLock,
} from '@/assets/Icons/auth/Icons';
import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import { router } from 'expo-router';
import { View, TouchableOpacity, TextInput, ActivityIndicator, useColorScheme } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Text } from '@/components/Themed';
import { useState } from 'react';
import { useFormik } from 'formik';
import { UserLoginSchema } from '@/validations/login.schema';

type FormValues = {
  email: string;
  password: string;
};

type userLoginProps = {
  onSubmit: (values: FormValues) => void;
};

export default function UserLogin({ onSubmit }: userLoginProps) {
  const [isChecked, setChecked] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
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

  return (
    <View testID="user-login">
      <View className="flex-1 p-10 justify-center mt-16">
        <View>
          <Text className="text-lg font-Inter-Bold mb-6 text-center text-gray-600">
            Welcome to <Text className="font-Inter-Regular">your_organization_name</Text>
          </Text>
          <TouchableOpacity onPress={() => router.push('/auth/login/login')}>
            <Text className="text-sm font-Inter-Regular text-center text-action-600 mb-6">
              Switch your organization
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex flex-col">
          <View className="flex mb-4">
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
              <TouchableOpacity onPress={() => router.push('/auth/forget/reset-password')}>
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

            <View className="mt-4 flex-row justify-center">
              <Checkbox
                className="w-4 h-4 rounded border border-gray-300"
                value={isChecked}
                onValueChange={setChecked}
                color={isChecked ? '#8667F2' : undefined}
              />
              <Text className="ml-2">Remember me.</Text>
            </View>
          </View>
        </View>

        <View className="mt-12 items-center">
          <SvgXml xml={colorScheme === 'dark' ? DarkBottomIcon : LightBottomIcon} />
        </View>
      </View>
    </View>
  );
}
