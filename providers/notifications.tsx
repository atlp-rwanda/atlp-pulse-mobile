import { ProfileType } from '@/app/dashboard/_layout';
import { ADD_PUSH_NOTIFICATION_TOKEN } from '@/graphql/queries/user';
import { useApolloClient, useMutation } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { useNetworkState } from 'expo-network';
import * as Notifications from 'expo-notifications';
import { Href, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Linking, Platform } from 'react-native';
import { useToast } from 'react-native-toast-notifications';

type NotificationData = {
  redirectURI?: string;
  criteria: {
    type: 'PUBLIC' | 'PERSONAL' | 'TEAM' | 'ORGANIZATION';
    value: string;
  };
};

export type NotificationContextType = {
  state: {
    token: string | null;
    profile: ProfileType | null;
  };
  actions: {
    setToken: (token: string) => void;
    setProfile: (profile: ProfileType) => void;
    reset: () => void;
  };
};

export const NotificationContext = React.createContext<NotificationContextType | null>(null);

export const useNotification = () => {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const toast = useToast();
  const router = useRouter();
  const client = useApolloClient();
  const networkState = useNetworkState();
  const [userProfile, setUserProfile] = useState<ProfileType | null>(null);
  const responseListener = useRef<Notifications.EventSubscription>();
  const notificationListener = useRef<Notifications.EventSubscription>();
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [addPushToken] = useMutation(ADD_PUSH_NOTIFICATION_TOKEN);

  const handleNotificationDisplay = async (
    notification: Notifications.Notification,
    userProfile?: ProfileType
  ) => {
    const SHOWN = { shouldShowAlert: true, shouldPlaySound: true, shouldSetBadge: true };
    const HIDDEN = { shouldShowAlert: false, shouldPlaySound: false, shouldSetBadge: false };

    if (Platform.OS === 'android') {
      notification.request.content.data = JSON.parse(
        (notification.request.content as any).dataString
      );
    }
    const { criteria } = notification.request.content.data as NotificationData;

    switch (criteria.type) {
      case 'PUBLIC':
        return SHOWN;
      case 'PERSONAL':
        return userProfile?.user?.id === criteria.value ? SHOWN : HIDDEN;
      case 'TEAM':
        return userProfile?.user?.team?.id === criteria.value ? SHOWN : HIDDEN;
      case 'ORGANIZATION':
        return userProfile?.user?.organizations?.includes(criteria.value) ? SHOWN : HIDDEN;
      default:
        return HIDDEN;
    }
  };

  Notifications.setNotificationHandler({
    handleNotification: (n) => handleNotificationDisplay(n, userProfile || undefined),
  });

  useEffect(() => {
    if (networkState.isConnected) {
      if (pushToken === null) {
        registerForPushNotificationsAsync();
        if (userProfile && userToken) {
          handlePushTokenRegistration(userProfile, userToken);
        }
      }
    }
  }, [networkState]);

  async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        toast.show('Notification permission not granted.', { type: 'warning' });
        return;
      }

      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

      if (!projectId) {
        // Handle when projectId is not defined
        toast.show('Notification not enabled for this project.', { type: 'warning' });
      }

      try {
        const token = await Notifications.getExpoPushTokenAsync({ projectId });
        setPushToken(token.data);
      } catch (e: unknown) {
        toast.show('Failed to get push token.', { type: 'danger' });
      }
    } else {
      // Handle when notifications are disabled on emulators
      toast.show('Notifications are disabled on this device', { type: 'warning' });
    }
  }

  async function handlePushTokenRegistration(profile?: ProfileType | null, token?: string | null) {
    if (pushToken === null || token === null) return;
    if (profile?.user?.pushNotificationTokens === null) return;

    if (!profile?.user?.pushNotificationTokens.includes(pushToken)) {
      const { data, errors } = await addPushToken({
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
        variables: {
          pushToken: pushToken,
        },
      });

      if (errors) {
        toast.show(errors[0].message, { type: 'danger' });
      }

      if (data) {
        client.refetchQueries({
          include: ['GetProfile'],
        });
      }
    }
  }

  useEffect(() => {
    (async () => {
      if (!pushToken) {
        await registerForPushNotificationsAsync();
      }
      const savedToken = await AsyncStorage.getItem('authToken');
      handlePushTokenRegistration(userProfile, savedToken);
    })();
  }, [userProfile, pushToken]);

  useEffect(() => {
    (async () => {
      const savedProfile = await AsyncStorage.getItem('userProfile');
      setUserProfile(JSON.parse(savedProfile || '{}'));
    })();

    registerForPushNotificationsAsync();
    // Handle when a notification is opened by tapping on it
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const { redirectURI } = response.notification.request.content.data as NotificationData;

      if (redirectURI && redirectURI.startsWith('http')) {
        Linking.openURL(redirectURI);
      }

      if (redirectURI && redirectURI.startsWith('/')) {
        router.replace(redirectURI as Href);
      }
    });

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      Notifications.setNotificationHandler({
        handleNotification: (n) => handleNotificationDisplay(n, userProfile || undefined),
      });
    });

    return () => {
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
      notificationListener.current &&
        Notifications.removeNotificationSubscription(notificationListener.current);
    };
  }, []);

  const reset = () => {
    setUserProfile(null);
    setUserToken(null);
    setPushToken(null);
  };

  return (
    <NotificationContext.Provider
      value={{
        state: {
          token: userToken,
          profile: userProfile,
        },
        actions: {
          setToken: setUserToken,
          setProfile: setUserProfile,
          reset,
        },
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
