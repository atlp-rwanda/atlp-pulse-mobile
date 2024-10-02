import { useState } from 'react';
import { View, Text, TextInput, useColorScheme, SafeAreaView, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { StatusBar } from 'expo-status-bar';
import { bottomIcon_dark, bottomIcon_light } from '@/components/icons/icons';
import Button from '@/components/buttons';
import { useMutation } from '@apollo/client';
import { useToast } from 'react-native-toast-notifications';
import { useFormik } from 'formik';
import { ResetPasswordSchema } from '@/validations/login.schema';
import { RESET_PASSWORD_EMAIL } from '@/graphql/mutations/resetPassword';

type FormValues = {
  email: string;
};

export default function ResetPassword() {
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
          onCompleted: (data) => {
            toast.show('Check your email to proceed!', {
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
        <StatusBar/>
      <View className={`flex ${bgColor} mt-36`}>
        <View className="flex p-10 justify-center mt-16">
          <Text className={`text-3xl font-Inter-Bold mb-6 text-center ${textColor}`}>
            Reset Password
          </Text>

          {replace ? (
            <View>
              <Text className={`text-m font-Inter-regular mb-2 text-center ${textColor}`}>
                Password reset request successful!{' '}
              </Text>
              <Text className={`text-m font-Inter-regular mb-2 text-center ${textColor}`}>
                Please check your email for a link to reset your password!
              </Text>
            </View>
          ) : (
            <View>
              <Text className={`text-m font-Inter-regular mb-6 text-center ${textColor}`}>
                You will receive an email to proceed with resetting password
              </Text>
              <View className={`${inputbg} p-3 rounded-lg shadow border-2 border-[#D2D2D2] mb-2`}>
                <TextInput
                  placeholder="Enter Email"
                  placeholderTextColor="gray"
                  value={formik.values.email}
                  onChangeText={formik.handleChange('email')}
                  className={`rounded-[10px] font-Inter-Regular ${textColor}`}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
              {formik.errors.email && (
                <Text className="text-error-500 mb-4">{formik.errors.email}</Text>
              )}
              <TouchableOpacity
                testID="submit-button"
                onPress={() => formik.handleSubmit()}
                className="bg-action-500 p-4 rounded-lg items-center"
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-secondary-light-500 text-lg font-semibold">Continue</Text>
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