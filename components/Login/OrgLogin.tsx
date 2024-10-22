import { DarkBottomIcon, LightBottomIcon } from '@/assets/Icons/auth/Icons';
import { Text } from '@/components/Themed';
import { OrgLoginSchema } from '@/validations/login.schema';
import { Ionicons } from '@expo/vector-icons';
import { useFormik } from 'formik';
import { useState } from 'react';
import { ActivityIndicator, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useTranslation } from 'react-i18next';


type FormValues = {
  organization: string;
};

type OrgLoginProps = {
  onSubmit: (values: FormValues) => void;
};

export default function OrgLogin({ onSubmit }: OrgLoginProps) {
  
  const [loading, setLoading] = useState(false);
  const [inputWidth, setInputWidth] = useState<number>();
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

  const handleNameChange = (inputText: string) => {
    formik.setFieldValue('organization', inputText);
    const newWidth = inputText ? Math.min(inputText.length * 11, 200) : 130
    setInputWidth(newWidth);
  };
  

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
            <View>
              <View
                className={`flex-row items-center ${colorScheme === 'dark' ? 'bg-primary-dark' : 'bg-secondary-light-50'} p-3 rounded-lg shadow border-2 border-[#D2D2D2]`}
              >
                <Ionicons name="globe-outline" size={24} color="gray" className="mr-4" />

                <TextInput
                  testID="org-input"
                  placeholder={t("orgLogin.orgPlaceholder")}
                  placeholderTextColor={colorScheme === 'dark' ? '#FFFFFF' : '#9e9e9e'}
                  onChangeText={formik.handleChange('organization')}
                  value={formik.values.organization}
                  style={{marginLeft:10,width:inputWidth}}
                  autoCapitalize="none"
                  keyboardType="url"
                  className={`${colorScheme === 'dark' ? 'text-primary-light' : '#9e9e9e'}`}
                />
                <Text testID='pulse.co' className='text-gray-400'>.pulse.co</Text>
              </View>
            </View>
            <Text className="mt-2 text-center text-error-500"> {formik.errors.organization ? t('orgLogin.error') : null}</Text>

            <View className="flex flex-col gap-4">
              <TouchableOpacity
                testID="submit-button"
                onPress={() => formik.handleSubmit()}
                className="items-center p-4 rounded-lg bg-action-500"
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-lg font-semibold text-secondary-light-500">{t('orgLogin.continue')}</Text>
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
