import { DarkBottomIcon, LightBottomIcon } from '@/assets/Icons/auth/Icons';
import { Text } from '@/components/Themed';
import { OrgLoginSchema } from '@/validations/login.schema';
import { Ionicons } from '@expo/vector-icons';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
      <View className="flex items-center justify-center gap-20 pt-36 ">
        <View>
          <View className="flex p-8">
            <Text className={`text-2xl font-Inter-SemiBold text-center ${textColor}`}>
              {t('orgLogin.signIn')}
            </Text>
            <Text className={`text-xl text-center text-gray-600 ${textColor}`}>
              {t('orgLogin.enterOrgURL')}
            </Text>
          </View>

          <View className="flex flex-col gap-2">
            <View
              className={`flex-row items-center ${colorScheme === 'dark' ? 'bg-primary-dark' : 'bg-secondary-light-50'} px-3 rounded-lg shadow border-2 border-[#D2D2D2]`}
            >
              <Ionicons
                name="globe-outline"
                className="py-4"
                size={20}
                color={colorScheme === 'dark' ? '#e5e7eb' : '#1f2937'}
              />

              <TextInput
                testID="org-input"
                placeholder={t('orgLogin.orgPlaceholder')}
                onChangeText={formik.handleChange('organization')}
                value={formik.values.organization}
                autoCapitalize="none"
                keyboardType="url"
                placeholderTextColor={colorScheme == 'dark' ? '#e5e7eb' : '#1f2937'}
                className={`${colorScheme === 'dark' ? 'text-gray-100' : 'text-gray-800'} py-4 ml-3`}
              />
              <Text testID="pulse.org" className="text-gray-400 dark:text-gray-500 py-4">
                .pulse.org
              </Text>
            </View>

            {formik.errors.organization && (
              <Text className="mt-1 text-error-500">{t('orgLogin.error')}</Text>
            )}

            <View className="flex flex-col gap-4 mt-4">
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
                    {t('orgLogin.continue')}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="items-center ">
          <SvgXml xml={colorScheme === 'dark' ? DarkBottomIcon : LightBottomIcon} />
        </View>
      </View>
    </View>
  );
}
