import { DarkBottomIcon, LightBottomIcon } from '@/assets/Icons/auth/Icons';
import { Text } from '@/components/Themed';
import { UserLoginSchema } from '@/validations/login.schema';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

type FormValues = {
  email: string;
  password: string;
};

type userLoginProps = {
  onSubmit: (values: FormValues) => void;
};

export default function UserLogin({ onSubmit }: userLoginProps) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();

  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [loading, setLoading] = useState(false);
  const [orgName, setOrgName] = useState<string | null>(null);

  const textColor = colorScheme === 'dark' ? 'text-gray-100' : 'text-gray-800';

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
  return (
    <View testID="user-login">
      <View className="flex justify-center p-10 mt-16">
        <View>
          <Text className={`text-lg font-Inter-Bold mb-6 text-center ${textColor}`}>
            {t('userLogin.welcome')}
            <Text className={`font-Inter-Regular ${textColor}`}>{orgName}</Text>
          </Text>
          <TouchableOpacity onPress={() => router.push('/auth/login')}>
            <Text className="mb-6 text-sm text-center font-Inter-Regular text-action-600">
              {t('userLogin.switchOrg')}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex flex-col">
          <View className="flex mb-4">
            <View className="mb-4">
              <Text className={`p-2 ${textColor}`}>{t('userLogin.email')}</Text>
              <View
                className={`flex-row items-center gap-3 ${colorScheme === 'dark' ? 'bg-primary-dark' : 'bg-secondary-light-50'} px-3 rounded-lg shadow border-2 border-[#D2D2D2]`}
              >
                <Ionicons
                  name="mail"
                  className="py-4"
                  size={20}
                  color={colorScheme === 'dark' ? '#e5e7eb' : '#1f2937'}
                />
                <TextInput
                  placeholder={t('userLogin.email')}
                  onChangeText={formik.handleChange('email')}
                  onBlur={formik.handleBlur('email')}
                  value={formik.values.email}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholderTextColor={colorScheme == 'dark' ? '#e5e7eb' : '#1f2937'}
                  className={`${colorScheme === 'dark' ? 'text-gray-100' : 'text-gray-800'} py-4`}
                />
              </View>
              {formik.errors.email && (
                <Text className="mt-1 text-error-500 ">{t('userLogin.emailRequired')}</Text>
              )}
            </View>
            <View>
              <Text className={`pl-2  ${textColor}`}>{t('userLogin.password')}</Text>
              <View
                className={`mt-2 relative flex items-center flex-row gap-3 border-2 border-[#D2D2D2] rounded-[10px] px-3 ${colorScheme === 'dark' ? 'bg-primary-dark' : 'bg-secondary-light-50'}`}
              >
                <Ionicons
                  name="lock-closed"
                  className="py-4"
                  size={20}
                  color={colorScheme === 'dark' ? '#e5e7eb' : '#1f2937'}
                />
                <TextInput
                  placeholder={t('userLogin.password')}
                  secureTextEntry={secureTextEntry}
                  onChangeText={formik.handleChange('password')}
                  onBlur={formik.handleBlur('password')}
                  value={formik.values.password}
                  placeholderTextColor={colorScheme == 'dark' ? '#e5e7eb' : '#1f2937'}
                  className={`${colorScheme === 'dark' ? 'text-gray-100' : 'text-gray-800'} py-4 flex-1`}
                />

                <TouchableOpacity
                  className=""
                  onPress={togglePasswordVisibility}
                  testID="password-toggle"
                >
                  <Ionicons
                    name={secureTextEntry ? 'eye-outline' : 'eye-off-outline'}
                    size={24}
                    color={colorScheme === 'dark' ? '#e5e7eb' : '#1f2937'}
                  />
                </TouchableOpacity>
              </View>

              {formik.errors.password && (
                <Text className="mt-1 text-error-500">{t('userLogin.passwordRequired')}</Text>
              )}
            </View>
          </View>
          <TouchableOpacity onPress={() => router.push('/auth/forgot-password')}>
            <Text className="text-action-500 mt-1 mb-5 text-right">
              {t('userLogin.forgotPassword')}
            </Text>
          </TouchableOpacity>

          <View className="flex flex-col gap-4">
            <TouchableOpacity
              onPress={() => formik.submitForm()}
              className="bg-[#7E6FF3] p-4 rounded-lg items-center"
            >
              {loading ? (
                <ActivityIndicator color="#e5e7eb" />
              ) : (
                <Text className="text-secondary-light-500 text-lg font-semibold">
                  {t('userLogin.signIn')}
                </Text>
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
