import { useColorScheme } from '@/components/useColorScheme';
import '@/global.css';
import { client } from '@/graphql/client';
import NotificationsProvider from '@/providers/notifications';
import { ApolloProvider } from '@apollo/client';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { isDevice } from 'expo-device';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { ToastProvider } from 'react-native-toast-notifications';
import '../internationalization/index';

export const unstable_settings = {
  initialRouteName: '(onboarding)',
};

SplashScreen.preventAutoHideAsync();

if (isDevice) {
  SplashScreen.setOptions({
    duration: 1000,
    fade: true,
  });
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ApolloProvider client={client}>
      <ToastProvider placement="top" duration={5000}>
        <NotificationsProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(onboarding)" />
              <Stack.Screen name="auth" />
              <Stack.Screen name="dashboard" />
            </Stack>
          </ThemeProvider>
        </NotificationsProvider>
      </ToastProvider>
    </ApolloProvider>
  );
}
