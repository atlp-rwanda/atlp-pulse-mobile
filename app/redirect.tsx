import { Text, View } from '@/components/Themed';
import { Href, Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Linking } from 'react-native';
import { useToast } from 'react-native-toast-notifications';

type RedirectParams = {
  path: string;
  dest: 'app' | 'web';
};

export default function Redirect() {
  const router = useRouter();
  const toast = useToast();
  const { path, dest } = useLocalSearchParams<RedirectParams>();

  useEffect(() => {
    (async () => {
      if (!path) {
        router.replace('/');
        return;
      }

      if (dest === 'web') {
        try {
          const url = path.startsWith('http') ? path : `https://${path}`;
          await Linking.openURL(url);
        } catch (error) {
          toast.show('Unable to open link', {
            type: 'danger',
            duration: 5000,
            placement: 'top',
          });
        }
      } else {
        router.replace(path as Href);
      }
    })();
  }, [path, dest]);

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-xl dark:text-white">Redirecting...</Text>
      <Link href="/" className="mt-12">
        <View className="py-3 px-4 bg-action-500 rounded-full">
          <Text className="text-lg text-white">Go to home screen!</Text>
        </View>
      </Link>
    </View>
  );
}
