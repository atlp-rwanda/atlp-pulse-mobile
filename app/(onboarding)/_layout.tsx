import { View } from '@/components/Themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Slot, useRouter } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TokenType = {
  exp: number;
};

export default function AppOnboardingLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const bgColor = () => (colorScheme === 'dark' ? 'bg-[#020917]' : 'bg-[#E0E7FF]');

  const [loaded, setLoaded] = useState(false);

  // Check if user is authenticated and proceed to the dashboard
  useEffect(() => {
    (async function () {
      try {
        const authToken = await AsyncStorage.getItem('authToken');

        if (authToken !== null) {
          const parsedToken = jwtDecode<TokenType>(authToken);
          const expiryTime = parsedToken.exp;
          const currentTime = Math.floor(Date.now() / 1000);

          if (expiryTime > currentTime) {
            return router.push('/dashboard');
          }

          await AsyncStorage.removeItem('authToken');
        }
      } catch (e) {
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  if (!loaded) {
    return <View className={`flex ${bgColor()}`} />;
  }

  return (
    <View
      className={`flex-1 ${bgColor()}`}
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <Slot />
    </View>
  );
}
