import { DarkBottomIcon, LightBottomIcon } from '@/assets/Icons/auth/Icons';
import { Text } from '@/components/Themed';
import { OrgLoginSchema } from '@/validations/login.schema';
import { Ionicons } from '@expo/vector-icons';
import { useFormik } from 'formik';
import { useState } from 'react';
import { ActivityIndicator, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SvgXml } from 'react-native-svg';


type FormValues = {
  organization: string;
};

type OrgLoginProps = {
  onSubmit: (values: FormValues) => void;
};

export default function OrgLogin({ onSubmit }: OrgLoginProps) {
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? 'text-gray-100' : 'text-secondary-light-900';
  const formik = useFormik<FormValues>({
    initialValues: {} as FormValues,
    onSubmit: async (values) => {
      setLoading(true);
      await onSubmit(values);
      setLoading(false);
    },
    validationSchema: OrgLoginSchema,
  });

  return (
    <View testID="org-login">
      <View className="flex pt-36 justify-center items-center  gap-20 ">
        <View>
          <View className="flex p-8">
            <Text className={`text-2xl font-Inter-SemiBold text-center ${textColor}`}>
              Sign in to your Organization
            </Text>
            <Text className={`text-xl text-center text-gray-600 ${textColor}`}>
              Enter your organization's Pulse URL
            </Text>
          </View>

          <View className="flex flex-col gap-2">
            <View>
              <View
                className={`flex-row items-center ${colorScheme === 'dark' ? 'bg-primary-dark' : 'bg-secondary-light-50'} p-3 rounded-lg shadow border-2 border-[#D2D2D2]`}
              >
                <Ionicons name="globe-outline" size={24} color="gray" className="mr-2" />

                <TextInput
                  testID="org-input"
                  placeholder="<Your-organization>.pulse.co"
                  placeholderTextColor={colorScheme === 'dark' ? '#FFFFFF' : '#9e9e9e'}
                  onChangeText={formik.handleChange('organization')}
                  value={formik.values.organization}
                  style={{ flex: 1, marginLeft: 8 }}
                  autoCapitalize="none"
                  keyboardType="url"
                  className={`${colorScheme === 'dark' ? 'text-primary-light' : '#9e9e9e'}`}
                />
              </View>
            </View>
            <Text className="text-error-500 text-center mt-2">{formik.errors.organization}</Text>

            <View className="flex flex-col gap-4">
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
          </View>
        </View>

        <View className=" items-center">
          <SvgXml xml={colorScheme === 'dark' ? DarkBottomIcon : LightBottomIcon} />
        </View>
      </View>
    </View>
  );
}
