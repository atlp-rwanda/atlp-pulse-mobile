import { bottomIcon_dark, bottomIcon_light } from '@/components/icons/icons';
import { RESET_PASSWORD_EMAIL } from '@/graphql/mutations/resetPassword';
import { ResetPasswordSchema } from '@/validations/login.schema';
import { useMutation } from '@apollo/client';
import { StatusBar } from 'expo-status-bar';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useToast } from 'react-native-toast-notifications';

type FormValues = {
  email: string;
};

export default function ResetPassword() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const toast = useToast();
  const [resetMutation] = useMutation(RESET_PASSWORD_EMAIL);
  const [replace, setReplace] = useState(false);
  const textColor = colorScheme === 'dark' ? 'text-gray-100' : 'text-gray-800';
  const bgColor = colorScheme === 'dark' ? 'bg-primary-dark' : 'bg-[#E0E7FF]';
  const inputbg = colorScheme === 'dark' ? 'bg-primary-dark' : 'bg-primary-light';

  const formik = useFormik({
    initialValues: {} as FormValues,
    onSubmit: async (values: FormValues) => {
      setLoading(true);
      try {
        await resetMutation({
          variables: { email: values.email },
          onCompleted: () => {
            toast.show(t('toasts.auth.checkEmail'), {
              type: 'success',
              placement: 'top',
              duration: 4000,
              animationType: 'slide-in',
            });
            setReplace(true);
          },
          onError: (err) => {
            toast.show(err.message, {
              type: 'danger',
              placement: 'top',
              duration: 4000,
              animationType: 'slide-in',
            });
          },
        });
      } catch (err) {}
      setLoading(false);
    },
    validationSchema: ResetPasswordSchema,
  });
  const screenHeight = Dimensions.get('window').height;

  return (
    <SafeAreaView>
      <StatusBar />
      <View className={`flex ${bgColor} mt-36`}>
        <View className="flex justify-center p-10 mt-16">
          <Text className={`text-3xl font-Inter-Bold mb-6 text-center ${textColor}`}>
            {t('forgotPassword.title')}
          </Text>

          {replace ? (
            <View>
              <Text className={`text-m font-Inter-regular mb-2 text-center ${textColor}`}>
                {t('forgotPassword.successMessage')}
              </Text>
            </View>
          ) : (
            <View>
              <Text className={`text-m font-Inter-regular mb-6 text-center ${textColor}`}>
                {t('forgotPassword.instructions')}
              </Text>
              <View className={`${inputbg} p-3 rounded-lg shadow border-2 border-[#D2D2D2] mb-2`}>
                <TextInput
                  placeholder={t('forgotPassword.placeholder')}
                  placeholderTextColor="gray"
                  value={formik.values.email}
                  onChangeText={formik.handleChange('email')}
                  onBlur={formik.handleBlur('email')}
                  className={`rounded-[10px] font-Inter-Regular ${textColor}`}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
              {formik.touched.email && formik.errors.email && (
                <Text className="mb-4 text-error-500">{t('forgotPassword.errorEmail')}</Text>
              )}
              <TouchableOpacity
                testID="submit-button"
                onPress={() => formik.handleSubmit()}
                className="items-center p-4 rounded-lg bg-action-500"
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-lg font-semibold text-secondary-light-500">
                    {t('forgotPassword.submitButton')}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View className="items-center mt-8">
          <SvgXml xml={colorScheme === 'dark' ? bottomIcon_dark : bottomIcon_light} />
        </View>
      </View>
    </SafeAreaView>
  );
}
