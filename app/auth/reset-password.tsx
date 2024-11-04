import { lock } from '@/assets/Icons/auth/Icons';
import Button from '@/components/buttons';
import { bottomIcon_dark, bottomIcon_light } from '@/components/icons/icons';
import { FORGOT_PASSWORD, VERIFY_RESET_PASSWORD_TOKEN } from '@/graphql/mutations/resetPassword';
import { SetNewPasswordSchema } from '@/validations/login.schema';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useToast } from 'react-native-toast-notifications';

type FormValues = {
  confirmpassword: string;
  password: string;
};

const SetNewPassword = () => {
  const { token } = useLocalSearchParams();
  const {t} = useTranslation();
  const originalToken = Array.isArray(token) ? token.join('.') : token?.replace(/\*/g, '.');
  const [securePassword, setSecurePassword] = useState(true);
  const [secureConfirmPassword, setSecureConfirmPassword] = useState(true);
  const toast = useToast();
  const colorScheme = useColorScheme();

  const [ResetPassword] = useMutation(FORGOT_PASSWORD, {
    onCompleted: () => {
      setTimeout(() => {
        toast.show(t('toasts.auth.resetSuccess'), {
          type: 'success',
          placement: 'top',
          duration: 4000,
        });
        router.push('/auth/login');
      }, 2000);
    },
    onError: (err) => {
      toast.show(err.message, {
        type: 'danger',
        placement: 'top',
        duration: 4000,
      });
    },
  });

  const [VerifyResetPassword] = useLazyQuery(VERIFY_RESET_PASSWORD_TOKEN, {
    variables: { token: originalToken },
    onError: (err) => {
      toast.show(err.message, {
        type: 'danger',
        placement: 'top',
        duration: 4000,
      });
      router.push('/auth/login');
    },
  });

  useEffect(() => {
    VerifyResetPassword();
  }, []);

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmpassword: '',
    },
    validationSchema: SetNewPasswordSchema,
    onSubmit: async (values: FormValues) => {
      await ResetPassword({
        variables: {
          password: values.password,
          confirmPassword: values.confirmpassword,
          token: originalToken,
        },
      });
    },
  });

  const togglePasswordVisibility = () => {
    setSecurePassword(!securePassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setSecureConfirmPassword(!secureConfirmPassword);
  };

  const textColor = colorScheme === 'dark' ? 'text-gray-100' : 'text-gray-800';
  const bgColor = colorScheme === 'dark' ? 'bg-primary-dark' : 'bg-secondary-light';
  const banner = colorScheme === 'dark' ? 'bg-primary-dark' : 'bg-primary-light';
  const inputbg = colorScheme === 'dark' ? 'bg-primary-dark' : 'bg-primary-light';

  return (
    <View>
      <StatusBar />
      <View className={`flex-1 ${bgColor}`}>
        <View className="flex-1 p-8 justify-center ">
          <View>
            <Text className={`text-2xl font-Inter-Bold mb-6 text-center ${textColor}`}>
              Reset Password
            </Text>
          </View>

          <View className="flex flex-col gap-2 p-6">
            <View className="flex mb-4 gap-4">
              <Text className={`${textColor}`}>New Password</Text>
              <View
                className={`flex-row items-center ${colorScheme === 'dark' ? 'bg-primary-dark' : 'bg-secondary-light-50'} p-4 rounded-lg shadow border-2 border-[#D2D2D2]`}
              >
                <SvgXml xml={lock} />
                <TextInput
                  className={`flex-1 ml-2 rounded-[10px] font-Inter-Regular ${textColor}`}
                  placeholder="Password"
                  secureTextEntry={securePassword}
                  onChangeText={formik.handleChange('password')}
                  onBlur={formik.handleBlur('password')}
                  value={formik.values.password}
                />
                <TouchableOpacity
                  className="absolute right-3 top-3"
                  onPress={togglePasswordVisibility}
                >
                  <Ionicons
                    name={securePassword ? 'eye-outline' : 'eye-off-outline'}
                    size={24}
                    color={'#575757'}
                  />
                </TouchableOpacity>
              </View>
              {formik.touched.password && formik.errors.password && (
                <Text className="text-error-500 mg-2">{formik.errors.password}</Text>
              )}
              <Text className={`${textColor}`}>Confirm new Password</Text>
              <View
                className={`flex-row items-center ${inputbg} p-4 rounded-lg shadow border-2 border-[#D2D2D2]`}
              >
                <SvgXml xml={lock} />
                <TextInput
                  className={`flex-1 ml-2 rounded-[10px] font-Inter-Regular ${textColor}`}
                  placeholder="Confirm Password"
                  secureTextEntry={secureConfirmPassword}
                  onChangeText={formik.handleChange('confirmpassword')}
                  onBlur={formik.handleBlur('confirmpassword')}
                  value={formik.values.confirmpassword}
                />
                <TouchableOpacity
                  className="absolute right-3 top-3"
                  onPress={toggleConfirmPasswordVisibility}
                >
                  <Ionicons
                    name={secureConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={24}
                    color={'#575757'}
                  />
                </TouchableOpacity>
              </View>
              {formik.touched.confirmpassword && formik.errors.confirmpassword && (
                <Text className="text-error-500 mg-2">{formik.errors.confirmpassword}</Text>
              )}
            </View>

            <View className="flex flex-col gap-4">
              <Button
                state="Default"
                onPress={() => formik.handleSubmit()}
                title="Continue"
                className="rounded-lg items-center"
              />
            </View>
          </View>

          <View className="mt-12 items-center">
            {colorScheme === 'dark' ? (
              <SvgXml xml={bottomIcon_dark} />
            ) : (
              <SvgXml xml={bottomIcon_light} />
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default SetNewPassword;
