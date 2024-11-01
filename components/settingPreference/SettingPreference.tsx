import {
  down_arrow,
  forward_pref_icon
} from '@/assets/Preference_icons/preference_icons';
import { updateEmailNotifications, updatePushNotifications } from '@/graphql/mutations/notificationMutation';
import { DisableTwoFactorAuth, EnableTwoFactorAuth } from '@/graphql/mutations/two-factor.mutation';
import { GET_PROFILE } from '@/graphql/queries/user';
import { useMutation, useQuery } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Switch, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useToast } from 'react-native-toast-notifications';
import LanguagePicker from '../LanguagePicker';

const settings = () => {
  const toast = useToast();
  const [profile, setprofile] = useState(null)
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [enableTwoFactorAuth] = useMutation(EnableTwoFactorAuth);
  const [disableTwoFactorAuth] = useMutation(DisableTwoFactorAuth);
  const [updateEmailNotificationsMutation] = useMutation(updateEmailNotifications);
  const [updatePushNotificationsMutation] = useMutation(updatePushNotifications);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState('system');
  const [themeSelectOpen, setThemeSelectOpen] = useState(false);
  const { t } = useTranslation();

  const [isProfileExpanded, setIsProfileExpanded] = useState(false);

  const colorScheme = selectedTheme === 'system' ? useColorScheme() : selectedTheme;
  const textStyle = colorScheme === 'dark' ? 'text-gray-100' : 'text-gray-800';
  const borderColor = colorScheme === 'dark' ? 'border-gray-700' : 'border-gray-300';
  const containerStyle = colorScheme === 'dark' ? 'bg-primary-dark' : 'bg-primary-light';

  const themeData = [
    { label: 'System', value: 'system' },
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
  ];

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        setUserToken(token);
      }
    })();
  }, []);

  const { data, error } = useQuery(GET_PROFILE, {
    context: {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    },
    skip: !userToken,
  });

  useEffect(() => {
    if (data?.getProfile?.user) {
      const user = data.getProfile.user;
      setprofile(user);
      setIsTwoFactorEnabled(user.twoFactorAuth);
      setPushEnabled(user.pushNotifications);
      setEmailEnabled(user.emailNotifications);
    }
  }, [data]);


  const handleEnableTwoFactor = async () => {
    try {
      setIsTwoFactorEnabled(true);
      await enableTwoFactorAuth({ variables: { email: data.getProfile.user?.email } });
      toast.show(t('toasts.preferences.enableTwo-way'), { type: 'success', placement: 'top', duration: 3000 });
      
    } catch (error) {
      setIsTwoFactorEnabled(false);
      toast.show(t('toasts.preferences.failEnableTwoway'), { type: 'danger', placement: 'top', duration: 3000 });
    }
  };

  const handleDisableTwoFactor = async () => {
    try {
      setIsTwoFactorEnabled(false);
      await disableTwoFactorAuth({ variables: { email: data.getProfile.user?.email } });
      toast.show(t('toasts.preferences.desableTwo-way'), { type: 'success', placement: 'top', duration: 3000 });

    } catch (error) {
      setIsTwoFactorEnabled(true);
      toast.show(t('toasts.preferences.failDesableTwoway'), { type: 'danger', placement: 'top', duration: 3000 });
    }
  };

  const handleEmailNotificationChange = async () => {
    try {
      await updateEmailNotificationsMutation({
        variables: { updateEmailNotificationsId: data.getProfile.user.id },
      });
      setEmailEnabled((prevEmailEnabled) => !prevEmailEnabled);
      toast.show(t('toasts.preferences.updateEmailNotification'), { type: 'success', placement: 'top', duration: 3000 });

    } catch (error) {
      toast.show(t('toasts.preferences.failUpdatingeEmail'), { type: 'danger', placement: 'top', duration: 3000 });
    }
  };

  const handlePushNotificationChange = async () => {
    try {
      await updatePushNotificationsMutation({
        variables: { updatePushNotificationsId: data.getProfile.user?.id },
      });
      setPushEnabled((prevPushEnabled) => !prevPushEnabled);
      toast.show(t('toasts.preferences.updatePushNotification'), { type: 'success', placement: 'top', duration: 3000 });

    } catch (error) {
      toast.show(t('toasts.preferences.failUpdatingPush'), { type: 'danger', placement: 'top', duration: 3000 });
    }
  };

  return (
    <View className={`p-4 mb-8 ${containerStyle}`}>
      <Text className={`text-2xl font-extrabold ml-4 mb-4 ${textStyle}`}>
        {t('settings.title')}
      </Text>
      {/* Profile Section */}
      <View className={`rounded-lg`}>
        <TouchableOpacity
          className="p-4 flex-row items-center justify-between"
          onPress={() => setIsProfileExpanded(!isProfileExpanded)}
        >
          <View className="flex-row items-center gap-2">
            <Text className={`text-xl font-bold ${textStyle}`}>{t('settings.profile')}</Text>
          </View>
          <Image
            source={isProfileExpanded ? down_arrow : forward_pref_icon}
            style={{
              height: 24,
              width: 24,
              tintColor: colorScheme === 'dark' ? '#ffffff' : '#000000',
            }}
          />
        </TouchableOpacity>
        {isProfileExpanded && (
          <View className="p-4 flex flex-row justify-between">
            <Text className={`text-lg mt-2 w-56 ${textStyle}`}>{t('settings.editProfile')}</Text>
            <TouchableOpacity>
              <Text
                className={`mt-2 font-Inter-Bold ${colorScheme === 'light' ? 'text-black' : 'text-white'}`}
                onPress={() => router.push('/dashboard/trainee/profile')}
              >
                {t('settings.change')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Theme Picker */}
      <View className={`mb-6 p-4 border-t ${borderColor} rounded-lg flex flex-row`}>
        <View className="flex-1 mr-4">
          <Text className={`text-xl font-bold ${textStyle}`}>{t('settings.appearance')}</Text>
          <Text className={`text-lg mt-2 ${textStyle}`}>{t('settings.themePreferences')}</Text>
        </View>
        <View className="flex-row items-center gap-5">
          <DropDownPicker
            items={themeData}
            value={selectedTheme}
            open={themeSelectOpen}
            setOpen={setThemeSelectOpen}
            placeholder="Select Theme"
            theme={colorScheme === 'dark' ? 'DARK' : 'LIGHT'}
            setValue={setSelectedTheme}
            style={{ borderColor: 'transparent' }}
          />
        </View>
      </View>

      {/* Language Picker */}
      <View className={`mb-6 p-4 border-t ${borderColor} rounded-lg  justify-between`}>
        <Text className={`text-xl font-bold ${textStyle}`}>{t('settings.language')}</Text>
        <View className="flex-row justify-between  w-full mr-4">
          <Text className={`${textStyle} mt-2 text-lg flex-1`}>
            {t('settings.languagePreference')}
          </Text>
          <View className={`border  ${borderColor}  flex-1 rounded-md `}>
            <LanguagePicker showFlag={false} />
          </View>
        </View>
      </View>

      {/* Email Notifications */}
      <View className={`mb-6 p-4 border-t ${borderColor} rounded-lg flex-row justify-between`}>
        <View className="flex-1 mr-4">
          <Text className={`text-xl font-bold ${textStyle}`}>{t('settings.emailNotify')}</Text>
          <Text className={`text-lg mt-2 ${textStyle}`}>{t('settings.emailFeeds')}</Text>
        </View>
        <Switch
            value={emailEnabled}
            onValueChange={handleEmailNotificationChange}
            thumbColor={emailEnabled ? '#6200ee' : '#f4f3f4'}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
          />
      </View>

      {/* Push Notifications */}
      <View className={`mb-6 p-4 border-t ${borderColor} rounded-lg flex-row justify-between`}>
        <View className="flex-1 mr-4">
          <Text className={`text-xl font-bold ${textStyle}`}>{t('settings.pushNotify')}</Text>
          <Text className={`text-lg mt-2 ${textStyle}`}>{t('settings.pushUpdates')}</Text>
        </View>
        <Switch
            value={pushEnabled}
            onValueChange={handlePushNotificationChange}
            thumbColor={pushEnabled ? '#6200ee' : '#f4f3f4'}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
          />
      </View>

      {/* Privacy and Security */}
      <View className={`mb-6 p-4 border-t ${borderColor} rounded-lg flex-row justify-between`}>
        <View className="flex-1 mr-4">
          <Text className={`text-xl font-bold ${textStyle}`}>{t('settings.Two-factor')}</Text>
          <Text className={`text-lg mt-2 ${textStyle}`}>
          {t('settings.Two-factor-Preference')}
          </Text>
        </View>
        <Switch
            value={isTwoFactorEnabled}
            onValueChange={isTwoFactorEnabled ? handleDisableTwoFactor : handleEnableTwoFactor}
            thumbColor={isTwoFactorEnabled ? '#6200ee' : '#f4f3f4'}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
          />
      </View>

      {/* Login Activity */}
  
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



