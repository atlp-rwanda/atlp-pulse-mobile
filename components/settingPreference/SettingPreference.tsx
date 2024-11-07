import React, { useState } from 'react';
import { View, Switch, Text, useColorScheme, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import LanguagePicker from '../LanguagePicker';
import { Dropdown } from 'react-native-element-dropdown';
import { useTranslation } from 'react-i18next';

const settings = () => {
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('system');
  const { t } = useTranslation();

  const colorScheme = selectedTheme === 'system' ? useColorScheme() : selectedTheme;
  const textStyle = colorScheme === 'dark' ? 'text-gray-100' : 'text-gray-800';
  const borderColor = colorScheme === 'dark' ? 'border-gray-700' : 'border-gray-300';
  const containerStyle = colorScheme === 'dark' ? 'bg-primary-dark' : 'bg-primary-light';

  const themeData = [
    { label: 'System', value: 'system' },
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
  ];

  return (
    <View className={`p-4 mb-8 ${containerStyle}`}>
      <Text className={`text-2xl font-extrabold ml-4 mb-4 ${textStyle}`}>{t('settings.title')}</Text>
      {/* Profile Section */}
      <View className="mb-6 p-4 rounded-lg flex flex-row justify-center">
        <View className="flex-1 mr-4">
          <Text className={`text-xl font-bold ${textStyle}`}>{t('settings.profile')}</Text>
          <Text className={`text-lg mt-2 ${textStyle}`}>{t('settings.editProfile')}</Text>
        </View>
        <TouchableOpacity className="flex items-end">
          <Text
            className={`${textStyle} mt-2`}
            onPress={() => router.push('/dashboard/trainee/profile')}
          >
            {t('settings.change')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Theme Picker */}
      <View className={`mb-6 p-4 border-t ${borderColor} rounded-lg flex flex-row`}>
        <View className="flex-1 mr-4">
          <Text className={`text-xl font-bold ${textStyle}`}>{t('settings.appearance')}</Text>
          <Text className={`text-lg mt-2 ${textStyle}`}>{t('settings.themePreferences')}</Text>
        </View>
        <View className="flex-row items-center gap-5">
          <Dropdown
            labelField="label"
            valueField="value"
            data={themeData}
            value={selectedTheme}
            onChange={(item) => {}}
            placeholder="Select Theme"
            selectedTextStyle={{ color: colorScheme === 'dark' ? '#fff' : '#000' }}
            //@ts-ignore
            style={styles.picker(colorScheme)}
          />
        </View>
      </View>

      {/* Language Picker */}
      <View className={`mb-6 p-4 border-t ${borderColor} rounded-lg  justify-between`}>
        <Text className={`text-xl font-bold ${textStyle}`}>{t('settings.language')}</Text>
        <View className="flex-row justify-between  w-full mr-4">
          <Text className={`${textStyle} mt-2 text-lg flex-1`}>{t('settings.languagePreference')}</Text>
          <View className={`border  ${borderColor}  flex-1 rounded-md `}>
            <LanguagePicker showFlag={false} />
          </View>
        </View>
      </View>

      {/* Email Notifications */}
      <View className={`mb-6 p-4 border-t ${borderColor} rounded-lg flex-row justify-between`}>
        <View className="flex-1 mr-4">
          <Text className={`text-xl font-bold ${textStyle}`}>{t('settings.emailNotify')}</Text>
          <Text className={`text-lg mt-2 ${textStyle}`}>
          {t('settings.emailFeeds')}
          </Text>
        </View>
        <Switch
          value={emailNotifications}
          onValueChange={() => setEmailNotifications((prev) => !prev)}
          thumbColor={emailNotifications ? '#6200ee' : '#f4f3f4'}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
        />
      </View>

      {/* Push Notifications */}
      <View className={`mb-6 p-4 border-t ${borderColor} rounded-lg flex-row justify-between`}>
        <View className="flex-1 mr-4">
          <Text className={`text-xl font-bold ${textStyle}`}>{t('settings.pushNotify')}</Text>
          <Text className={`text-lg mt-2 ${textStyle}`}>
          {t('settings.pushUpdates')}
          </Text>
        </View>
        <Switch
          value={pushNotifications}
          onValueChange={() => setPushNotifications((prev) => !prev)}
          thumbColor={pushNotifications ? '#6200ee' : '#f4f3f4'}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
        />
      </View>

      {/* Privacy and Security */}
      <View className={`mb-6 p-4 border-t ${borderColor} rounded-lg flex-row justify-center`}>
        <View className="flex-1 mr-4">
          <Text className={`text-xl font-bold ${textStyle}`}>{t('settings.privacy')}</Text>
          <Text className={`text-lg mt-2 ${textStyle}`}>{t('settings.privacy')}</Text>
        </View>
        <Text className={`mt-2 ${textStyle}`}>{t('settings.change')}</Text>
      </View>

      {/* Login Activity */}
      <View className={`p-4 mb-7 border-t ${borderColor} rounded-lg flex flex-row justify-center`}>
        <View className="flex-1 mr-4">
          <Text className={`text-xl font-bold ${textStyle}`}>{t('settings.login')}</Text>
          <Text className={`text-lg ${textStyle}`}>{t('settings.loginHistory')}</Text>
        </View>
        <Text className={`mt-2 ${textStyle}`}>{t('settings.view')}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  //@ts-ignore
  picker: (colorScheme) => ({
    height: 50,
    width: 178,
    backgroundColor: colorScheme === 'dark' ? '#070E1C' : '#fff',
    color: colorScheme === 'dark' ? '#fff' : '#000',
    borderColor: colorScheme === 'dark' ? '#374151' : '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  }),
});

export default settings;
