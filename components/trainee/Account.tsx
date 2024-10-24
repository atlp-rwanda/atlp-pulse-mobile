import { CHANGE_USER_PASSWORD } from '@/graphql/mutations/changePassword';
import { PasswordResetSchema } from '@/validations/changePassword.schema';
import { ApolloError, useMutation } from '@apollo/client';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFormik } from 'formik';
import { useState } from 'react';
import { ActivityIndicator, TextInput, TouchableOpacity, useColorScheme } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import { Text, View } from '../Themed';

type FormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type ProfileAccountTabProps = {
  passwordUpdated: any;
};

export default function ProfileAccountTab({ passwordUpdated }: ProfileAccountTabProps) {
  const toast = useToast();
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(false);
  const [changeUserPassword] = useMutation(CHANGE_USER_PASSWORD);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const textColor = colorScheme === 'dark' ? 'text-gray-100' : 'text-gray-800';
  const bgColor = colorScheme === 'dark' ? 'bg-secondary-dark-900' : 'bg-secondary-light-300';

  const formik = useFormik<FormValues>({
    initialValues: {} as FormValues,
    onSubmit: async (values: FormValues) => {
      setLoading(true);
      try {
        const authToken = await AsyncStorage.getItem('authToken');
        const { data, errors } = await changeUserPassword({
          variables: {
            ...values,
            token: authToken,
          },
        });

        if (data) {
          toast.show(data?.changeUserPassword || 'Password updated successfully', {
            type: 'success',
          });
          passwordUpdated?.();
          formik.resetForm();
        }

        if (errors) {
          toast.show(errors[0].message, { type: 'danger' });
        }
      } catch (error) {
        if (error instanceof ApolloError) {
          toast.show(error.message, { type: 'danger' });
        } else {
          toast.show(`Oops, something went wrong`, { type: 'danger' });
        }
      }
      setLoading(false);
    },
    validationSchema: PasswordResetSchema,
  });

  return (
    <View className={`${bgColor} mx-4 p-6 rounded-lg w-full`}>
      <Text className={`${textColor} font-Inter-SemiBold text-xl mb-5`}>RESET YOUR PASSWORD</Text>
      <View className="mb-4">
        <Text className="text-gray-800 dark:text-gray-200 font-Inter-Medium mb-1">
          Current Password:
        </Text>
        <View
          className={`flex-row items-center rounded text-gray-700 border border-gray-300 shadow shadow-gray-50 dark:shadow-gray-600 bg-primary-light`}
        >
          <TextInput
            testID="current-password"
            placeholder="Current Password"
            onChangeText={formik.handleChange('currentPassword')}
            value={formik.values.currentPassword}
            style={{ flex: 1 }}
            autoCapitalize="none"
            secureTextEntry={!showCurrentPassword}
            className={`placeholder:text-gray-500 text-base px-3 py-4`}
          />
          <Ionicons
            name={showCurrentPassword ? 'eye-off' : 'eye'}
            size={20}
            color="gray"
            className="mx-2"
            onPress={() => {
              setShowCurrentPassword(!showCurrentPassword);
            }}
          />
        </View>
        {formik.errors.currentPassword && (
          <Text className="text-error-500 mt-1">{formik.errors.currentPassword}</Text>
        )}
      </View>

      <View className="mb-4">
        <Text className="text-gray-800 dark:text-gray-200 font-Inter-Medium mb-1">
          New Password:
        </Text>
        <View
          className={`flex-row items-center rounded text-gray-700 border border-gray-300 shadow shadow-gray-50 dark:shadow-gray-600 bg-primary-light`}
        >
          <TextInput
            testID="new-password"
            placeholder="New Password"
            onChangeText={formik.handleChange('newPassword')}
            value={formik.values.newPassword}
            style={{ flex: 1 }}
            autoCapitalize="none"
            secureTextEntry={!showNewPassword}
            className={`placeholder:text-gray-500 text-base px-3 py-4`}
          />
          <Ionicons
            name={showNewPassword ? 'eye-off' : 'eye'}
            size={20}
            color="gray"
            className="mx-2"
            onPress={() => {
              setShowNewPassword(!showNewPassword);
            }}
          />
        </View>
        {formik.errors.newPassword && (
          <Text className="text-error-500 mt-1">{formik.errors.newPassword}</Text>
        )}
      </View>

      <View className="mb-4">
        <Text className="text-gray-800 dark:text-gray-200 font-Inter-Medium mb-1">
          Confirm Password:
        </Text>
        <View
          className={`flex-row items-center rounded text-gray-700 border border-gray-300 shadow shadow-gray-50 dark:shadow-gray-600 bg-primary-light`}
        >
          <TextInput
            testID="confirm-password"
            placeholder="Confirm Password"
            onChangeText={formik.handleChange('confirmPassword')}
            value={formik.values.confirmPassword}
            style={{ flex: 1 }}
            autoCapitalize="none"
            secureTextEntry={!showConfirmPassword}
            className={`text-base placeholder:text-gray-500 px-3 py-4`}
          />
          <Ionicons
            name={showConfirmPassword ? 'eye-off' : 'eye'}
            size={20}
            color="gray"
            className="mx-2"
            onPress={() => {
              setShowConfirmPassword(!showConfirmPassword);
            }}
          />
        </View>
        {formik.errors.confirmPassword && (
          <Text className="text-error-500 mt-1">{formik.errors.confirmPassword}</Text>
        )}
      </View>
      <TouchableOpacity
        className="flex-row items-center justify-center py-4 mt-4 bg-action-500 rounded-lg"
        onPress={() => formik.submitForm()}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className={`text-white text-lg`}>Change Password</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
