import {
  DarkBottomIcon,
  DarkLock,
  email,
  LightBottomIcon,
  lightEmail,
  lock,
} from '@/assets/Icons/auth/Icons';
import { Text } from '@/components/Themed';
import { UserLoginSchema } from '@/validations/login.schema';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { ActivityIndicator, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation(); 

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
      <View className="flex justify-center p-10 mt-16">
        <View>
          <Text className={`text-lg font-Inter-Bold mb-6 text-center ${textColor}`}>
          {t('userLogin.welcome')}  <Text className={`font-Inter-Regular ${textColor}`}>{orgName}</Text>
          </Text>
          <TouchableOpacity onPress={() => router.push('/auth/login')}>
            <Text className="mb-6 text-sm text-center font-Inter-Regular text-action-600">
            {t('userLogin.switchOrg')}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex flex-col">
          <View className="flex mb-4">
            <Text className={`p-2 ${textColor}`}>{t('userLogin.email')}</Text>
            <View
              className={`flex-row items-center ${colorScheme === 'dark' ? 'bg-primary-dark' : 'bg-secondary-light-50'} p-3 rounded-lg shadow border-2 border-[#D2D2D2]`}
            >
              <SvgXml
                xml={colorScheme === 'dark' ? lightEmail : email}
                color="gray"
                className="mr-2"
              />
              <TextInput
                placeholder={t('userLogin.email')}
                placeholderTextColor={colorScheme === 'dark' ? '#FFFFFF' : '#9e9e9e'}
                onChangeText={formik.handleChange('email')}
                onBlur={formik.handleBlur('email')}
                value={formik.values.email}
                className={`flex-1 ml-2 rounded-[10px] font-Inter-Regular ${colorScheme === 'dark' ? 'text-primary-light' : 'text-secondary-dark-400'}`}
                autoCapitalize="none"
                keyboardType="url"
              />
            </View>
            <Text className="mt-2 text-error-400 ">{formik.errors.email &&  t('userLogin.emailRequired')}</Text>
            <Text className={`pl-2  ${textColor}`}>{t('userLogin.password')}</Text>
            <View
              className={`mt-2 relative flex flex-row gap-2 border-2 border-[#D2D2D2] rounded-[10px] p-3 ${colorScheme === 'dark' ? 'bg-primary-dark' : 'bg-secondary-light-50'}`}
            >
              <SvgXml xml={colorScheme === 'dark' ? DarkLock : lock} />
              <TextInput
                className={`font-Inter-Regular ${colorScheme === 'dark' ? 'text-primary-light' : 'text-secondary-dark-400'}`}
                placeholder={t('userLogin.password')}
                placeholderTextColor={colorScheme === 'dark' ? '#FFFFFF' : '#9e9e9e'}
                secureTextEntry={secureTextEntry}
                onChangeText={formik.handleChange('password')}
                onBlur={formik.handleBlur('password')}
                value={formik.values.password}
              />

              <TouchableOpacity
                className="absolute right-3 top-3"
                onPress={togglePasswordVisibility}
                testID='password-toggle'
              >
                <Ionicons
                  name={secureTextEntry ? 'eye-outline' : 'eye-off-outline'}
                  size={24}
                  color={'#575757'}
                />
              </TouchableOpacity>
            </View>

            <View className="flex flex-row justify-between">
              <Text className="mt-2 text-error-400">{formik.errors.password && t('userLogin.passwordRequired')}</Text>
              <TouchableOpacity onPress={() => router.push('/auth/forgot-password')}>
                <Text className="p-2 text-right text-action-500">{t('userLogin.forgotPassword')}</Text>
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
                <Text className="text-lg font-semibold text-secondary-light-500">{t('userLogin.signIn')}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View className="items-center mt-12">
          <SvgXml xml={colorScheme === 'dark' ? DarkBottomIcon : LightBottomIcon} />
        </View>
      </View>
    </View>
  );
}
